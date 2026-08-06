-- U2: employee grade (1-5) and immediate manager
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "grade" integer DEFAULT 1 NOT NULL;
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "manager_employee_id" uuid;
DO $$ BEGIN
  ALTER TABLE "employees"
    ADD CONSTRAINT "employees_manager_employee_id_employees_id_fk"
    FOREIGN KEY ("manager_employee_id") REFERENCES "public"."employees"("id")
    ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "employees_manager_employee_id_idx" ON "employees" ("manager_employee_id");
CREATE INDEX IF NOT EXISTS "employees_tenant_grade_idx" ON "employees" ("tenant_id", "grade");
