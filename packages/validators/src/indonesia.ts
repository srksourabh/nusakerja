import { z } from "zod";

export const nikKtpSchema = z
  .string()
  .regex(/^\d{16}$/, "NIK/KTP must be exactly 16 digits");

export const npwpSchema = z
  .string()
  .regex(/^\d{15,16}$/, "NPWP must be 15 or 16 digits")
  .optional()
  .or(z.literal(""));

export const bpjsTkNoSchema = z
  .string()
  .regex(/^\d{11}$/, "BPJS Ketenagakerjaan number must be 11 digits")
  .optional()
  .or(z.literal(""));

export const bpjsKsNoSchema = z
  .string()
  .regex(/^\d{13}$/, "BPJS Kesehatan number must be 13 digits")
  .optional()
  .or(z.literal(""));

export const ptkpStatusSchema = z.enum([
  "TK_0", "TK_1", "TK_2", "TK_3",
  "K_0", "K_1", "K_2", "K_3",
  "K_I_0", "K_I_1", "K_I_2", "K_I_3"
]);

export const workerCategorySchema = z.enum([
  "PKWTT", "PKWT", "FREELANCE", "COMMISSIONER", "TKA"
]);
