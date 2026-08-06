import { db } from "./index";
import {
  tenants,
  employees,
  statutoryParameters,
  users,
  companyCaAssignments,
  caFirms,
  hrPolicies,
  policyAssignments,
} from "./schema";
import { randomBytes, scryptSync } from "crypto";
import { eq, and } from "drizzle-orm";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function seed() {
  console.log("🚀 Seeding NusaKerja production database schema & statutory parameters...");

  const tenantValues = [
    {
      name: "PT Nusantara Utama",
      slug: "pt-nusantara-utama",
      schema_name: "pt_nusantara_utama",
      npwp: "01.234.567.8-013.000",
      address: "Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan, DKI Jakarta",
      isActive: true,
    },
    {
      name: "CV Maju Bersama",
      slug: "cv-maju-bersama",
      schema_name: "cv_maju_bersama",
      npwp: "02.987.654.3-042.000",
      address: "Jl. Tunjungan No. 45, Surabaya, Jawa Timur",
      isActive: true,
    },
  ];

  const insertedTenants = [];
  for (const t of tenantValues) {
    const existing = await db.select().from(tenants).where(eq(tenants.slug, t.slug)).limit(1);
    if (existing[0]) {
      insertedTenants.push(existing[0]);
      continue;
    }
    const [row] = await db.insert(tenants).values(t).returning();
    if (row) insertedTenants.push(row);
  }

  const defaultTenantId = insertedTenants[0]?.id;
  const secondTenantId = insertedTenants[1]?.id;

  await db
    .insert(statutoryParameters)
    .values([
      {
        parameterKey: "BPJS_JP_CAP_2026",
        description: "Plafon Upah Maksimum BPJS Jaminan Pensiun Effective March 2026",
        effectiveFrom: "2026-03-01",
        parameterValue: { capIdr: 11086300, rateEmployer: 0.02, rateEmployee: 0.01 },
        sourceNote: "Surat Edaran BPJS Ketenagakerjaan No. B/1226/022026",
      },
      {
        parameterKey: "BPJS_KS_CAP_2026",
        description: "Plafon Upah Maksimum BPJS Kesehatan",
        effectiveFrom: "2026-01-01",
        parameterValue: { capIdr: 12000000, rateEmployer: 0.04, rateEmployee: 0.01 },
        sourceNote: "Perpres BPJS Kesehatan & Perdir 3/2023",
      },
      {
        parameterKey: "TER_TAX_BRACKETS_2026",
        description: "Tarif Efektif Rata-Rata Bulanan PPh 21 (PMK 168/2023)",
        effectiveFrom: "2024-01-01",
        parameterValue: {
          categoryA: "TK/0, TK/1, K/0",
          categoryB: "TK/2, TK/3, K/1, K/2",
          categoryC: "K/3",
          decemberReconciliationRule: "Pasal 17 UU HPP Annual True-Up",
        },
        sourceNote: "PMK 168/2023 / PP 58/2023",
      },
    ])
    .onConflictDoNothing();

  if (defaultTenantId) {
    const sampleEmployees = [
      {
        tenantId: defaultTenantId,
        employeeCode: "NK-001",
        fullName: "Budi Santoso",
        nikKtp: "3171021990040001",
        npwp: "01.234.567.8-013.001",
        bpjsKetenagakerjaanNo: "10012345678",
        bpjsKesehatanNo: "0001234567890",
        ptkpStatus: "K_1" as const,
        workerCategory: "PKWTT" as const,
        joinDate: "2022-01-15",
        basicSalaryIdr: "15000000.00",
        grade: 1,
      },
      {
        tenantId: defaultTenantId,
        employeeCode: "NK-002",
        fullName: "Siti Nurhaliza",
        nikKtp: "3171021992080002",
        npwp: "01.234.567.8-013.002",
        bpjsKetenagakerjaanNo: "10012345679",
        bpjsKesehatanNo: "0001234567891",
        ptkpStatus: "TK_0" as const,
        workerCategory: "PKWTT" as const,
        joinDate: "2023-05-10",
        basicSalaryIdr: "9500000.00",
        grade: 1,
      },
      {
        tenantId: defaultTenantId,
        employeeCode: "NK-003",
        fullName: "Jean-Pierre Dupont",
        nikKtp: "3171021985120003",
        npwp: "01.234.567.8-013.003",
        bpjsKetenagakerjaanNo: "10012345680",
        bpjsKesehatanNo: "0001234567892",
        ptkpStatus: "K_2" as const,
        workerCategory: "TKA" as const,
        joinDate: "2024-02-01",
        basicSalaryIdr: "45000000.00",
        kitasExpiryDate: "2027-02-01",
        rptkaRef: "RPTKA-2024-88991",
        grade: 2,
      },
      {
        tenantId: defaultTenantId,
        employeeCode: "NK-MGR",
        fullName: "Rina Manager",
        nikKtp: "3171021988030011",
        npwp: "01.234.567.8-013.011",
        ptkpStatus: "K_1" as const,
        workerCategory: "PKWTT" as const,
        joinDate: "2020-03-01",
        basicSalaryIdr: "18000000.00",
        grade: 3,
      },
      {
        tenantId: defaultTenantId,
        employeeCode: "NK-HR",
        fullName: "Bambang Prasetyo, S.H.",
        nikKtp: "3171021985050022",
        npwp: "01.234.567.8-013.022",
        ptkpStatus: "K_2" as const,
        workerCategory: "PKWTT" as const,
        joinDate: "2019-01-10",
        basicSalaryIdr: "18500000.00",
        grade: 4,
      },
      {
        tenantId: defaultTenantId,
        employeeCode: "NK-ADM",
        fullName: "Administrator HR Master",
        nikKtp: "3171021980010033",
        npwp: "01.234.567.8-013.033",
        ptkpStatus: "K_3" as const,
        workerCategory: "PKWTT" as const,
        joinDate: "2018-01-01",
        basicSalaryIdr: "22000000.00",
        grade: 5,
      },
    ];

    for (const emp of sampleEmployees) {
      const existing = await db
        .select()
        .from(employees)
        .where(and(eq(employees.tenantId, defaultTenantId), eq(employees.employeeCode, emp.employeeCode)))
        .limit(1);
      if (existing[0]) {
        await db
          .update(employees)
          .set({ grade: emp.grade, updatedAt: new Date() })
          .where(eq(employees.id, existing[0].id));
      } else {
        await db.insert(employees).values(emp);
      }
    }
  }

  // Role seed users (demo passwords — non-production only)
  const seedUsers: Array<{
    email: string;
    name: string;
    role: "super_admin" | "reseller_admin" | "client_admin" | "hr_admin" | "manager" | "employee";
    tenantId?: string;
    password: string;
  }> = [
    {
      email: "srksourabh@gmail.com",
      name: "Sourabh (Platform SuperAdmin)",
      role: "super_admin",
      password: "DemoSuperAdmin!2026",
    },
    {
      email: "ca@nusakerja.id",
      name: "CA Demo Operator",
      role: "reseller_admin",
      password: "DemoCA!2026",
    },
    {
      email: "admin@nusantara.co.id",
      name: "Administrator HR Master",
      role: "client_admin",
      tenantId: defaultTenantId,
      password: "DemoAdmin!2026",
    },
    {
      email: "bambang.hr@nusantara.co.id",
      name: "Bambang Prasetyo, S.H.",
      role: "hr_admin",
      tenantId: defaultTenantId,
      password: "DemoHR!2026",
    },
    {
      email: "manager@nusantara.co.id",
      name: "Rina Manager",
      role: "manager",
      tenantId: defaultTenantId,
      password: "DemoManager!2026",
    },
    {
      email: "budi.santoso@nusantara.co.id",
      name: "Budi Santoso",
      role: "employee",
      tenantId: defaultTenantId,
      password: "DemoEmployee!2026",
    },
  ];

  let caUserId: string | undefined;
  for (const u of seedUsers) {
    const existing = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
    if (existing[0]) {
      if (u.role === "reseller_admin") caUserId = existing[0].id;
      continue;
    }
    const [created] = await db
      .insert(users)
      .values({
        email: u.email,
        name: u.name,
        role: u.role,
        tenantId: u.tenantId,
        passwordHash: hashPassword(u.password),
        locale: "id-ID",
      })
      .returning();
    if (u.role === "reseller_admin") caUserId = created.id;
  }

  if (caUserId) {
    const firmExisting = await db.select().from(caFirms).where(eq(caFirms.userId, caUserId)).limit(1);
    if (!firmExisting[0]) {
      await db.insert(caFirms).values({ name: "KAP Demo NusaKerja", userId: caUserId });
    }
    if (defaultTenantId) {
      const asg = await db
        .select()
        .from(companyCaAssignments)
        .where(eq(companyCaAssignments.tenantId, defaultTenantId))
        .limit(1);
      if (!asg[0]) {
        await db.insert(companyCaAssignments).values({
          tenantId: defaultTenantId,
          caUserId,
        });
      }
    }
    // Second tenant intentionally unassigned for AE4 demos
    void secondTenantId;
  }

  // Link login users → employee rows and wire manager tree (U2)
  if (defaultTenantId) {
    const byCode = async (code: string) => {
      const [row] = await db
        .select()
        .from(employees)
        .where(and(eq(employees.tenantId, defaultTenantId), eq(employees.employeeCode, code)))
        .limit(1);
      return row;
    };
    const linkUser = async (email: string, code: string) => {
      const [u] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      const emp = await byCode(code);
      if (u && emp) {
        await db.update(employees).set({ userId: u.id, updatedAt: new Date() }).where(eq(employees.id, emp.id));
      }
    };
    await linkUser("budi.santoso@nusantara.co.id", "NK-001");
    await linkUser("manager@nusantara.co.id", "NK-MGR");
    await linkUser("bambang.hr@nusantara.co.id", "NK-HR");
    await linkUser("admin@nusantara.co.id", "NK-ADM");

    const adm = await byCode("NK-ADM");
    const hr = await byCode("NK-HR");
    const mgr = await byCode("NK-MGR");
    const budi = await byCode("NK-001");
    const siti = await byCode("NK-002");
    const jean = await byCode("NK-003");

    // Admin (G5) → HR (G4), Manager (G3) → Budi/Siti/Jean (G1–2)
    if (adm && hr) {
      await db.update(employees).set({ managerEmployeeId: adm.id, updatedAt: new Date() }).where(eq(employees.id, hr.id));
    }
    if (adm && mgr) {
      await db.update(employees).set({ managerEmployeeId: adm.id, updatedAt: new Date() }).where(eq(employees.id, mgr.id));
    }
    for (const report of [budi, siti, jean]) {
      if (mgr && report) {
        await db
          .update(employees)
          .set({ managerEmployeeId: mgr.id, updatedAt: new Date() })
          .where(eq(employees.id, report.id));
      }
    }

    // U5 sample leave policies: tenant default 12d, grade 3 = 18d, Budi person override 24d
    const existingLeave = await db
      .select()
      .from(hrPolicies)
      .where(and(eq(hrPolicies.tenantId, defaultTenantId), eq(hrPolicies.kind, "leave")))
      .limit(1);
    if (!existingLeave[0]) {
      const [defPol] = await db
        .insert(hrPolicies)
        .values({
          tenantId: defaultTenantId,
          name: "Default annual leave",
          kind: "leave",
          payload: { annualLeaveDays: 12, sickLeaveDays: 14 },
          effectiveFrom: "2026-01-01",
        })
        .returning();
      const [g3Pol] = await db
        .insert(hrPolicies)
        .values({
          tenantId: defaultTenantId,
          name: "Grade 3 leave",
          kind: "leave",
          payload: { annualLeaveDays: 18, sickLeaveDays: 14 },
          effectiveFrom: "2026-01-01",
        })
        .returning();
      const [personPol] = await db
        .insert(hrPolicies)
        .values({
          tenantId: defaultTenantId,
          name: "Budi leave override",
          kind: "leave",
          payload: { annualLeaveDays: 24, sickLeaveDays: 14 },
          effectiveFrom: "2026-01-01",
        })
        .returning();
      if (defPol) {
        await db.insert(policyAssignments).values({
          tenantId: defaultTenantId,
          policyId: defPol.id,
          grade: null,
          employeeId: null,
        });
      }
      if (g3Pol) {
        await db.insert(policyAssignments).values({
          tenantId: defaultTenantId,
          policyId: g3Pol.id,
          grade: 3,
          employeeId: null,
        });
      }
      if (personPol && budi) {
        await db.insert(policyAssignments).values({
          tenantId: defaultTenantId,
          policyId: personPol.id,
          grade: null,
          employeeId: budi.id,
        });
      }
    }
  }

  console.log("✅ Database seeding completed successfully!");
  console.log("   Demo SuperAdmin: srksourabh@gmail.com / DemoSuperAdmin!2026");
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
