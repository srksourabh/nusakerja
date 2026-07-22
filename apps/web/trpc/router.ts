import { router } from "./trpc";
import { employeesRouter } from "./routers/employees";
import { attendanceRouter } from "./routers/attendance";
import { leaveRouter } from "./routers/leave";
import { payrollRouter } from "./routers/payroll";
import { reportsRouter } from "./routers/reports";
import { alertsRouter } from "./routers/alerts";
import { severanceRouter } from "./routers/severance";

export const appRouter = router({
  employees: employeesRouter,
  attendance: attendanceRouter,
  leave: leaveRouter,
  payroll: payrollRouter,
  reports: reportsRouter,
  alerts: alertsRouter,
  severance: severanceRouter,
});

export type AppRouter = typeof appRouter;
