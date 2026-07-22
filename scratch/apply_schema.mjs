import postgres from "postgres";

const sql = postgres("postgresql://postgres:NusaKerja2026SecurePass!@187.124.96.63:5432/nusakerja_db");

async function applySchema() {
  console.log("Connecting to Hostinger PostgreSQL container...");

  await sql`
    CREATE DO_NOTHING IF NOT EXISTS;
  `.catch(() => {});

  // Create Enums
  await sql`
    DO $$ BEGIN
      CREATE TYPE "user_role" AS ENUM('SUPER_ADMIN', 'RESELLER_ADMIN', 'CLIENT_ADMIN', 'HR_ADMIN', 'PAYROLL_ADMIN', 'MANAGER', 'EMPLOYEE');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "worker_category" AS ENUM('WNI', 'TKA');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "ptkp_status" AS ENUM('TK_0', 'TK_1', 'TK_2', 'TK_3', 'K_0', 'K_1', 'K_2', 'K_3', 'K_I_0', 'K_I_1', 'K_I_2', 'K_I_3');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "leave_type" AS ENUM('CUTI_TAHUNAN', 'CUTI_SAKIT', 'CUTI_MELAHIRKAN', 'CUTI_KEGUGURAN', 'CUTI_HAID', 'CUTI_PENTING', 'CUTI_UNPAID');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "leave_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "punch_type" AS ENUM('CLOCK_IN', 'CLOCK_OUT');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "payroll_status" AS ENUM('DRAFT', 'CALCULATED', 'APPROVED', 'DISBURSED', 'CLOSED');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `;

  // Create Tables
  await sql`
    CREATE TABLE IF NOT EXISTS "tenants" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "slug" text UNIQUE NOT NULL,
      "schema_name" text UNIQUE NOT NULL,
      "npwp" text NOT NULL,
      "address" text,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenant_id" uuid REFERENCES "tenants"("id") ON DELETE CASCADE,
      "email" text UNIQUE NOT NULL,
      "password_hash" text NOT NULL,
      "role" "user_role" DEFAULT 'EMPLOYEE' NOT NULL,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "employees" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenant_id" uuid REFERENCES "tenants"("id") ON DELETE CASCADE NOT NULL,
      "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
      "full_name" text NOT NULL,
      "nik" text NOT NULL,
      "npwp" text,
      "has_npwp" boolean DEFAULT true NOT NULL,
      "bpjs_tk_number" text,
      "bpjs_ks_number" text,
      "ptkp_status" "ptkp_status" NOT NULL,
      "worker_category" "worker_category" DEFAULT 'WNI' NOT NULL,
      "join_date" date NOT NULL,
      "basic_salary_idr" numeric(15, 2) NOT NULL,
      "kitas_expiry_date" date,
      "rptka_ref" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "statutory_parameters" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "parameter_key" text UNIQUE NOT NULL,
      "description" text,
      "effective_from" date NOT NULL,
      "effective_to" date,
      "parameter_value" jsonb NOT NULL,
      "source_note" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `;

  console.log("All Database Enums & Tables Created Successfully!");
  await sql.end();
}

applySchema().catch(console.error);
