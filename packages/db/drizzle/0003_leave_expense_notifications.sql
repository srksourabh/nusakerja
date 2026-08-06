-- U6: leave approver routing, expense claims, notifications
ALTER TABLE "leave_requests" ADD COLUMN IF NOT EXISTS "approver_employee_id" uuid;
ALTER TABLE "leave_requests" ADD COLUMN IF NOT EXISTS "decision_note" text;
DO $$ BEGIN
  ALTER TABLE "leave_requests"
    ADD CONSTRAINT "leave_requests_approver_employee_id_employees_id_fk"
    FOREIGN KEY ("approver_employee_id") REFERENCES "public"."employees"("id")
    ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "expense_category" AS ENUM ('TRAVEL', 'MEAL', 'MEDICAL', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "expense_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "notification_type" AS ENUM (
    'LEAVE_SUBMITTED',
    'LEAVE_DECIDED',
    'EXPENSE_SUBMITTED',
    'EXPENSE_DECIDED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "expense_claims" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "employee_id" uuid NOT NULL REFERENCES "employees"("id") ON DELETE cascade,
  "amount_idr" numeric(15, 2) NOT NULL,
  "category" "expense_category" NOT NULL,
  "description" text NOT NULL,
  "receipt_url" text,
  "status" "expense_status" DEFAULT 'PENDING' NOT NULL,
  "approver_employee_id" uuid REFERENCES "employees"("id") ON DELETE set null,
  "approved_by" uuid REFERENCES "users"("id") ON DELETE set null,
  "approved_at" timestamp,
  "decision_note" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "type" "notification_type" NOT NULL,
  "title" text NOT NULL,
  "body" text,
  "resource" text NOT NULL,
  "resource_id" uuid,
  "read_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "leave_requests_approver_idx" ON "leave_requests" ("approver_employee_id", "status");
CREATE INDEX IF NOT EXISTS "expense_claims_approver_idx" ON "expense_claims" ("approver_employee_id", "status");
CREATE INDEX IF NOT EXISTS "notifications_user_unread_idx" ON "notifications" ("user_id", "read_at");
