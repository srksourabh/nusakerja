-- U5: HR policies + assignments (grade / person / tenant default)
DO $$ BEGIN
  CREATE TYPE "policy_kind" AS ENUM ('leave', 'hr_general', 'pay_structure');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "hr_policies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "name" text NOT NULL,
  "kind" "policy_kind" NOT NULL,
  "payload" jsonb NOT NULL,
  "effective_from" date NOT NULL,
  "effective_to" date,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "policy_assignments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE cascade,
  "policy_id" uuid NOT NULL REFERENCES "hr_policies"("id") ON DELETE cascade,
  "grade" integer,
  "employee_id" uuid REFERENCES "employees"("id") ON DELETE cascade,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "hr_policies_tenant_kind_idx" ON "hr_policies" ("tenant_id", "kind");
CREATE INDEX IF NOT EXISTS "policy_assignments_tenant_policy_idx" ON "policy_assignments" ("tenant_id", "policy_id");
CREATE INDEX IF NOT EXISTS "policy_assignments_employee_idx" ON "policy_assignments" ("employee_id");
CREATE INDEX IF NOT EXISTS "policy_assignments_grade_idx" ON "policy_assignments" ("tenant_id", "grade");
