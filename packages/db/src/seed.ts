import { db } from "./index";
import {
  tenants,
  employees,
  statutoryParameters,
  users,
  companyCaAssignments,
  caFirms,
} from "./schema";
import { randomBytes, scryptSync } from "crypto";
import { eq } from "drizzle-orm";

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
      },
    ];

    for (const emp of sampleEmployees) {
      await db.insert(employees).values(emp).onConflictDoNothing();
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
