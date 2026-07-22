import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  AUTH_SECRET: z.string().min(32),
  APP_NAME: z.string().default("NusaKerja"),
  APP_URL: z.string().url().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5432/nusakerja_db",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  AUTH_SECRET: process.env.AUTH_SECRET || "supersecret_change_me_in_production_min_32_chars",
  APP_NAME: process.env.APP_NAME || "NusaKerja",
  APP_URL: process.env.APP_URL || "http://localhost:3000",
});
