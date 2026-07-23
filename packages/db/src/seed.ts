import { db } from "./index";
import { tenants, employees, statutoryParameters, users } from "./schema";

export async function seed() {
  console.log("🚀 Seeding NusaKerja production database schema & statutory parameters...");

  // 1. Seed Enterprise Tenants
  const tenantValues = [
    {
      name: "PT Nusantara Utama",
      slug: "pt-nusantara-utama",
      schemaName: "pt_nusantara_utama",
      npwp: "01.234.567.8-013.000",
      address: "Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan, DKI Jakarta",
      isActive: true,
    },
    {
      name: "CV Maju Bersama",
      slug: "cv-maju-bersama",
      schemaName: "cv_maju_bersama",
      npwp: "02.987.654.3-042.000",
      address: "Jl. Tunjungan No. 45, Surabaya, Jawa Timur",
      isActive: true,
    },
  ];

  const insertedTenants = [];
  for (const t of tenantValues) {
    const [row] = await db
      .insert(tenants)
      .values(t)
      .onConflictDoNothing()
      .returning();
    if (row) insertedTenants.push(row);
  }

  const defaultTenantId = insertedTenants[0]?.id;

  // 2. Seed Statutory Parameters (PMK 168/2023 & BPJS March 2026)
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

  // 3. Seed Sample Employees if tenant exists
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

  console.log("✅ Database seeding completed successfully!");
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
