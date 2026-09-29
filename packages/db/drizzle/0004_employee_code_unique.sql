CREATE UNIQUE INDEX IF NOT EXISTS "employees_tenant_employee_code_uidx"
  ON "employees" ("tenant_id", "employee_code");
