import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, isNull } from "drizzle-orm";
import { can } from "@nusakerja/auth";
import {
  db,
  leaveRequests,
  expenseClaims,
  notifications,
  employees,
  users,
  auditLogs,
  resolveApproverEmployeeId,
  canActorDecideRequest,
  type ApprovalActorRole,
} from "@nusakerja/db";
import { router, protectedProcedure } from "../trpc";

async function writeAudit(opts: {
  userId?: string | null;
  tenantId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}) {
  await db.insert(auditLogs).values({
    userId: opts.userId ?? null,
    tenantId: opts.tenantId ?? null,
    action: opts.action,
    resource: opts.resource,
    resourceId: opts.resourceId,
    details: opts.details ?? {},
  });
}

async function resolveSelfEmployee(tenantId: string, userId: string) {
  const [row] = await db
    .select()
    .from(employees)
    .where(and(eq(employees.tenantId, tenantId), eq(employees.userId, userId)))
    .limit(1);
  return row ?? null;
}

async function hrFallbackEmployeeIds(tenantId: string): Promise<string[]> {
  const hrUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.tenantId, tenantId), eq(users.role, "hr_admin")));
  if (hrUsers.length === 0) return [];
  const ids: string[] = [];
  for (const u of hrUsers) {
    const [emp] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(and(eq(employees.tenantId, tenantId), eq(employees.userId, u.id)))
      .limit(1);
    if (emp) ids.push(emp.id);
  }
  return ids;
}

async function notifyUser(opts: {
  tenantId: string;
  userId: string;
  type: "LEAVE_SUBMITTED" | "LEAVE_DECIDED" | "EXPENSE_SUBMITTED" | "EXPENSE_DECIDED";
  title: string;
  body?: string;
  resource: string;
  resourceId: string;
}) {
  await db.insert(notifications).values({
    tenantId: opts.tenantId,
    userId: opts.userId,
    type: opts.type,
    title: opts.title,
    body: opts.body ?? null,
    resource: opts.resource,
    resourceId: opts.resourceId,
  });
}

async function userIdForEmployee(employeeId: string | null): Promise<string | null> {
  if (!employeeId) return null;
  const [emp] = await db.select().from(employees).where(eq(employees.id, employeeId)).limit(1);
  return emp?.userId ?? null;
}

function assertCap(
  ctx: { user: { role: Parameters<typeof can>[0]["role"]; assignedTenantIds?: string[] }; tenantId: string | null },
  capability: Parameters<typeof can>[1]
) {
  const ok = can(
    { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
    capability,
    ctx.tenantId
  );
  if (!ok) {
    throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission for this leave action." });
  }
}

export const leaveRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
    }
    if (ctx.user.role === "super_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "SuperAdmin cannot access company leave." });
    }

    const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
    const canCompany = can(
      { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
      "company.full_ops",
      ctx.tenantId
    );

    if (canCompany) {
      return db.select().from(leaveRequests).where(eq(leaveRequests.tenantId, ctx.tenantId)).orderBy(desc(leaveRequests.createdAt));
    }

    if (ctx.user.role === "manager" && self) {
      return db
        .select()
        .from(leaveRequests)
        .where(
          and(
            eq(leaveRequests.tenantId, ctx.tenantId),
            eq(leaveRequests.approverEmployeeId, self.id)
          )
        )
        .orderBy(desc(leaveRequests.createdAt));
    }

    if (!self) return [];
    return db
      .select()
      .from(leaveRequests)
      .where(and(eq(leaveRequests.tenantId, ctx.tenantId), eq(leaveRequests.employeeId, self.id)))
      .orderBy(desc(leaveRequests.createdAt));
  }),

  myRequests: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) return [];
    const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
    if (!self) return [];
    return db
      .select()
      .from(leaveRequests)
      .where(and(eq(leaveRequests.tenantId, ctx.tenantId), eq(leaveRequests.employeeId, self.id)))
      .orderBy(desc(leaveRequests.createdAt));
  }),

  pendingForMe: protectedProcedure.query(async ({ ctx }) => {
    assertCap(ctx, "leave.approve");
    if (!ctx.tenantId) return [];
    const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
    const canCompany = can(
      { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
      "company.full_ops",
      ctx.tenantId
    );
    if (canCompany) {
      return db
        .select()
        .from(leaveRequests)
        .where(and(eq(leaveRequests.tenantId, ctx.tenantId), eq(leaveRequests.status, "PENDING")))
        .orderBy(desc(leaveRequests.createdAt));
    }
    if (!self) return [];
    return db
      .select()
      .from(leaveRequests)
      .where(
        and(
          eq(leaveRequests.tenantId, ctx.tenantId),
          eq(leaveRequests.status, "PENDING"),
          eq(leaveRequests.approverEmployeeId, self.id)
        )
      )
      .orderBy(desc(leaveRequests.createdAt));
  }),

  requestLeave: protectedProcedure
    .input(
      z.object({
        leaveType: z.enum([
          "CUTI_TAHUNAN",
          "CUTI_SAKIT",
          "CUTI_MELAHIRKAN",
          "CUTI_KEGUGURAN",
          "CUTI_HAID",
          "CUTI_PENTING",
          "CUTI_UNPAID",
        ]),
        startDate: z.string(),
        endDate: z.string(),
        totalDays: z.number().int().positive(),
        reason: z.string().optional(),
        attachmentUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "leave.request");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }

      const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
      if (!self) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No employee profile linked to this login.",
        });
      }

      const hrIds = await hrFallbackEmployeeIds(ctx.tenantId);
      const approverEmployeeId = resolveApproverEmployeeId({
        managerEmployeeId: self.managerEmployeeId ?? null,
        hrFallbackEmployeeIds: hrIds,
      });
      if (!approverEmployeeId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No approver available. Assign a manager or HR employee.",
        });
      }

      const [newRequest] = await db
        .insert(leaveRequests)
        .values({
          tenantId: ctx.tenantId,
          employeeId: self.id,
          leaveType: input.leaveType,
          startDate: input.startDate,
          endDate: input.endDate,
          totalDays: input.totalDays,
          reason: input.reason || null,
          attachmentUrl: input.attachmentUrl || null,
          status: "PENDING",
          approverEmployeeId,
        })
        .returning();

      const bossUserId = await userIdForEmployee(approverEmployeeId);
      if (bossUserId) {
        await notifyUser({
          tenantId: ctx.tenantId,
          userId: bossUserId,
          type: "LEAVE_SUBMITTED",
          title: "Leave request pending",
          body: `${self.fullName} submitted ${input.leaveType} (${input.totalDays} day(s)).`,
          resource: "leave_request",
          resourceId: newRequest.id,
        });
      }

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "leave.submit",
        resource: "leave_request",
        resourceId: newRequest.id,
        details: { approverEmployeeId },
      });

      return newRequest;
    }),

  decide: protectedProcedure
    .input(
      z.object({
        requestId: z.string().uuid(),
        decision: z.enum(["APPROVED", "REJECTED"]),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "leave.approve");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }

      const [existing] = await db
        .select()
        .from(leaveRequests)
        .where(eq(leaveRequests.id, input.requestId))
        .limit(1);
      if (!existing || existing.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Leave request not found." });
      }
      if (existing.status !== "PENDING") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Request is not pending." });
      }

      const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
      const allowed = canActorDecideRequest({
        actorEmployeeId: self?.id ?? null,
        actorRole: ctx.user.role as ApprovalActorRole,
        approverEmployeeId: existing.approverEmployeeId,
      });
      if (!allowed) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the assigned boss (or HR) can decide." });
      }

      const [updated] = await db
        .update(leaveRequests)
        .set({
          status: input.decision,
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
          decisionNote: input.note ?? null,
          updatedAt: new Date(),
        })
        .where(eq(leaveRequests.id, input.requestId))
        .returning();

      const requesterUserId = await userIdForEmployee(existing.employeeId);
      if (requesterUserId) {
        await notifyUser({
          tenantId: ctx.tenantId,
          userId: requesterUserId,
          type: "LEAVE_DECIDED",
          title: `Leave ${input.decision.toLowerCase()}`,
          body: input.note || `Your leave request was ${input.decision.toLowerCase()}.`,
          resource: "leave_request",
          resourceId: updated.id,
        });
      }

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: `leave.${input.decision.toLowerCase()}`,
        resource: "leave_request",
        resourceId: updated.id,
      });

      return updated;
    }),

  /** @deprecated prefer decide — kept for older clients */
  approveLeave: protectedProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "leave.approve");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }
      const [existing] = await db
        .select()
        .from(leaveRequests)
        .where(eq(leaveRequests.id, input.requestId))
        .limit(1);
      if (!existing || existing.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Leave request not found." });
      }
      const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
      if (
        !canActorDecideRequest({
          actorEmployeeId: self?.id ?? null,
          actorRole: ctx.user.role as ApprovalActorRole,
          approverEmployeeId: existing.approverEmployeeId,
        })
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the assigned boss (or HR) can decide." });
      }
      const [updated] = await db
        .update(leaveRequests)
        .set({
          status: "APPROVED",
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leaveRequests.id, input.requestId))
        .returning();
      return updated;
    }),
});

export const expensesRouter = router({
  myClaims: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) return [];
    const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
    if (!self) return [];
    return db
      .select()
      .from(expenseClaims)
      .where(and(eq(expenseClaims.tenantId, ctx.tenantId), eq(expenseClaims.employeeId, self.id)))
      .orderBy(desc(expenseClaims.createdAt));
  }),

  pendingForMe: protectedProcedure.query(async ({ ctx }) => {
    assertCap(ctx, "leave.approve");
    if (!ctx.tenantId) return [];
    const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
    const canCompany = can(
      { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
      "company.full_ops",
      ctx.tenantId
    );
    if (canCompany) {
      return db
        .select()
        .from(expenseClaims)
        .where(and(eq(expenseClaims.tenantId, ctx.tenantId), eq(expenseClaims.status, "PENDING")))
        .orderBy(desc(expenseClaims.createdAt));
    }
    if (!self) return [];
    return db
      .select()
      .from(expenseClaims)
      .where(
        and(
          eq(expenseClaims.tenantId, ctx.tenantId),
          eq(expenseClaims.status, "PENDING"),
          eq(expenseClaims.approverEmployeeId, self.id)
        )
      )
      .orderBy(desc(expenseClaims.createdAt));
  }),

  submit: protectedProcedure
    .input(
      z.object({
        amountIdr: z.number().positive(),
        category: z.enum(["TRAVEL", "MEAL", "MEDICAL", "OTHER"]),
        description: z.string().min(2).max(500),
        receiptUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "leave.request");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }
      const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
      if (!self) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No employee profile linked to this login." });
      }
      const hrIds = await hrFallbackEmployeeIds(ctx.tenantId);
      const approverEmployeeId = resolveApproverEmployeeId({
        managerEmployeeId: self.managerEmployeeId ?? null,
        hrFallbackEmployeeIds: hrIds,
      });
      if (!approverEmployeeId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No approver available. Assign a manager or HR employee.",
        });
      }

      const [claim] = await db
        .insert(expenseClaims)
        .values({
          tenantId: ctx.tenantId,
          employeeId: self.id,
          amountIdr: input.amountIdr.toFixed(2),
          category: input.category,
          description: input.description,
          receiptUrl: input.receiptUrl ?? null,
          status: "PENDING",
          approverEmployeeId,
        })
        .returning();

      const bossUserId = await userIdForEmployee(approverEmployeeId);
      if (bossUserId) {
        await notifyUser({
          tenantId: ctx.tenantId,
          userId: bossUserId,
          type: "EXPENSE_SUBMITTED",
          title: "Expense claim pending",
          body: `${self.fullName}: ${input.category} Rp ${input.amountIdr.toLocaleString("id-ID")}`,
          resource: "expense_claim",
          resourceId: claim.id,
        });
      }

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "expense.submit",
        resource: "expense_claim",
        resourceId: claim.id,
        details: { approverEmployeeId, category: input.category },
      });

      return claim;
    }),

  decide: protectedProcedure
    .input(
      z.object({
        claimId: z.string().uuid(),
        decision: z.enum(["APPROVED", "REJECTED"]),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "leave.approve");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }
      const [existing] = await db
        .select()
        .from(expenseClaims)
        .where(eq(expenseClaims.id, input.claimId))
        .limit(1);
      if (!existing || existing.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Expense claim not found." });
      }
      if (existing.status !== "PENDING") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Claim is not pending." });
      }
      const self = await resolveSelfEmployee(ctx.tenantId, ctx.user.id);
      if (
        !canActorDecideRequest({
          actorEmployeeId: self?.id ?? null,
          actorRole: ctx.user.role as ApprovalActorRole,
          approverEmployeeId: existing.approverEmployeeId,
        })
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the assigned boss (or HR) can decide." });
      }

      const [updated] = await db
        .update(expenseClaims)
        .set({
          status: input.decision,
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
          decisionNote: input.note ?? null,
          updatedAt: new Date(),
        })
        .where(eq(expenseClaims.id, input.claimId))
        .returning();

      const requesterUserId = await userIdForEmployee(existing.employeeId);
      if (requesterUserId) {
        await notifyUser({
          tenantId: ctx.tenantId,
          userId: requesterUserId,
          type: "EXPENSE_DECIDED",
          title: `Expense ${input.decision.toLowerCase()}`,
          body: input.note || `Your expense claim was ${input.decision.toLowerCase()}.`,
          resource: "expense_claim",
          resourceId: updated.id,
        });
      }

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: `expense.${input.decision.toLowerCase()}`,
        resource: "expense_claim",
        resourceId: updated.id,
      });

      return updated;
    }),
});

export const notificationsRouter = router({
  list: protectedProcedure
    .input(z.object({ unreadOnly: z.boolean().optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (!ctx.tenantId) return [];
      const rows = await db
        .select()
        .from(notifications)
        .where(and(eq(notifications.tenantId, ctx.tenantId), eq(notifications.userId, ctx.user.id)))
        .orderBy(desc(notifications.createdAt))
        .limit(50);
      if (input?.unreadOnly) return rows.filter((r) => !r.readAt);
      return rows;
    }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }
      const [row] = await db
        .update(notifications)
        .set({ readAt: new Date() })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id),
            eq(notifications.tenantId, ctx.tenantId),
            isNull(notifications.readAt)
          )
        )
        .returning();
      return row ?? null;
    }),
});
