import { router } from "./trpc";
import { employeesRouter } from "./routers/employees";
import { attendanceRouter } from "./routers/attendance";
import { leaveRouter, expensesRouter, notificationsRouter } from "./routers/leave";
import { payrollRouter } from "./routers/payroll";
import { reportsRouter } from "./routers/reports";
import { alertsRouter } from "./routers/alerts";
import { severanceRouter } from "./routers/severance";
import { authRouter } from "./routers/auth";
import { platformRouter } from "./routers/platform";
import { caRouter } from "./routers/ca";
import { companyRouter } from "./routers/company";
import { policiesRouter } from "./routers/policies";

export const appRouter = router({
  auth: authRouter,
  platform: platformRouter,
  ca: caRouter,
  company: companyRouter,
  policies: policiesRouter,
  employees: employeesRouter,
  attendance: attendanceRouter,
  leave: leaveRouter,
  expenses: expensesRouter,
  notifications: notificationsRouter,
  payroll: payrollRouter,
  reports: reportsRouter,
  alerts: alertsRouter,
  severance: severanceRouter,
});

export type AppRouter = typeof appRouter;
