import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, employees, documentVault } from "@nusakerja/db";
import { eq, lte, and, gte } from "drizzle-orm";

export const alertsRouter = router({
  getStatutoryAlerts: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.tenantId || "00000000-0000-0000-0000-000000000000";
    const today = new Date();
    const alertList: Array<{ type: string; title: string; description: string; urgency: "critical" | "warning" | "info" }> = [];

    // 1. Check KITAS Expiry for TKA foreign staff
    const tkaEmployees = await db
      .select()
      .from(employees)
      .where(and(eq(employees.tenantId, tenantId), eq(employees.workerCategory, "TKA")));

    for (const tka of tkaEmployees) {
      if (tka.kitasExpiryDate) {
        const expiry = new Date(tka.kitasExpiryDate);
        const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
        if (daysLeft <= 90) {
          alertList.push({
            type: "KITAS_EXPIRY",
            title: `Izin KITAS TKA Akan Expire: ${tka.fullName}`,
            description: `KITAS (Ref: ${tka.rptkaRef || "N/A"}) expire dalam ${daysLeft} hari (${tka.kitasExpiryDate}). Perlu perpanjangan RPTKA/KITAS.`,
            urgency: daysLeft <= 30 ? "critical" : "warning",
          });
        }
      }
    }

    // 2. Check Monthly Statutory Deadlines
    const currentDay = today.getDate();
    if (currentDay <= 10) {
      alertList.push({
        type: "BPJS_KS_DEADLINE",
        title: "Batas Waktu Pembayaran BPJS Kesehatan",
        description: `Batas pembayaran tanggal 10. Tersisa ${10 - currentDay} hari untuk menyelesaikan e-Dabu.`,
        urgency: currentDay >= 8 ? "critical" : "info",
      });
    }
    if (currentDay <= 15) {
      alertList.push({
        type: "BPJS_TK_DEADLINE",
        title: "Batas Waktu Setor BPJS Ketenagakerjaan",
        description: `Batas upload SIPP & pembayaran tanggal 15. Tersisa ${15 - currentDay} hari.`,
        urgency: currentDay >= 12 ? "critical" : "info",
      });
    }
    if (currentDay <= 20) {
      alertList.push({
        type: "CORETAX_DEADLINE",
        title: "Batas Lapor SPT Masa PPh 21 (DJP Coretax)",
        description: `Pelaporan SPT Masa PPh 21 paling lambat tanggal 20. Ekspor file XML Coretax.`,
        urgency: currentDay >= 17 ? "critical" : "info",
      });
    }

    return alertList;
  }),
});
