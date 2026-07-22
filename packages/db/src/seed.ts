import { db } from "./index";
import { tenants, employees, statutoryParameters } from "./schema";

export async function seed() {
  console.log("Seeding NusaKerja database...");

  // 1. Seed Tenant
  const [tenant] = await db
    .insert(tenants)
    .values({
      name: "PT Nusantara Utama",
      slug: "pt-nusantara-utama",
      schema_name: "pt_nusantara_utama",
      npwp: "01.234.567.8-013.000",
      address: "Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan, DKI Jakarta",
      isActive: true,
    })
    .onConflictDoNothing()
    .returning();

  // 2. Seed Statutory Parameters (BPJS JP Cap March 2026)
  await db
    .insert(statutoryParameters)
    .values([
      {
        parameterKey: "BPJS_JP_CAP",
        description: "Plafon Upah BPJS Pensiun Effective March 2026",
        effectiveFrom: "2026-03-01",
        parameterValue: { capIdr: 11086300, rateEmployer: 0.02, rateEmployee: 0.01 },
        sourceNote: "BPJS Circular B/1226/022026",
      },
      {
        parameterKey: "BPJS_KS_CAP",
        description: "Plafon Upah BPJS Kesehatan",
        effectiveFrom: "2026-01-01",
        parameterValue: { capIdr: 12000000, rateEmployer: 0.04, rateEmployee: 0.01 },
        sourceNote: "Perpres BPJS Kesehatan",
      },
    ])
    .onConflictDoNothing();

  console.log("Database seeding completed successfully!");
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
