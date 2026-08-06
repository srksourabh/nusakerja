import { calculateBpjsContribution, calculatePph21Ter } from "./indonesian_payroll_engine";

export type PayComponent = {
  code: string;
  label?: string;
  amountIdr: number;
};

export type PayStructurePayload = {
  components?: Array<{
    code?: string;
    label?: string;
    amountIdr?: number;
    amount?: number;
  }>;
};

export type ParsedCompensation = {
  basicSalaryIdr: number;
  fixedAllowancesIdr: number;
  components: PayComponent[];
  source: "policy" | "fallback";
};

const BASIC_CODES = new Set(["BASIC", "BASE", "GAJI_POKOK", "BASIC_SALARY"]);

function toAmount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.round(value));
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.max(0, Math.round(n));
  }
  return 0;
}

/**
 * Map pay_structure policy payload → basic + fixed allowances.
 * BASIC (and aliases) become basic salary; all other components are fixed allowances.
 */
export function parsePayStructureCompensation(
  payload: Record<string, unknown> | PayStructurePayload | null | undefined,
  fallbackBasicSalaryIdr = 0
): ParsedCompensation {
  const rawComponents = (payload as PayStructurePayload | null | undefined)?.components;
  if (!Array.isArray(rawComponents) || rawComponents.length === 0) {
    return {
      basicSalaryIdr: Math.max(0, Math.round(fallbackBasicSalaryIdr)),
      fixedAllowancesIdr: 0,
      components: [],
      source: "fallback",
    };
  }

  const components: PayComponent[] = rawComponents.map((c) => ({
    code: String(c.code ?? "OTHER").toUpperCase(),
    label: c.label,
    amountIdr: toAmount(c.amountIdr ?? c.amount),
  }));

  let basicSalaryIdr = 0;
  let fixedAllowancesIdr = 0;
  for (const c of components) {
    if (BASIC_CODES.has(c.code)) basicSalaryIdr += c.amountIdr;
    else fixedAllowancesIdr += c.amountIdr;
  }

  if (basicSalaryIdr <= 0 && fallbackBasicSalaryIdr > 0) {
    basicSalaryIdr = Math.round(fallbackBasicSalaryIdr);
  }

  return {
    basicSalaryIdr,
    fixedAllowancesIdr,
    components,
    source: basicSalaryIdr > 0 || fixedAllowancesIdr > 0 ? "policy" : "fallback",
  };
}

export type StatutoryPayrollLineInput = {
  basicSalaryIdr: number;
  fixedAllowancesIdr: number;
  variableAllowancesIdr?: number;
  overtimePayIdr?: number;
  thrPayIdr?: number;
  ptkpStatus: string;
  hasNpwp: boolean;
  workerCategory: string;
  payStructureSource?: "policy" | "fallback";
};

export type StatutoryPayrollLine = {
  basicSalaryIdr: number;
  fixedAllowancesIdr: number;
  variableAllowancesIdr: number;
  overtimePayIdr: number;
  thrPayIdr: number;
  grossSalaryIdr: number;
  bpjsEmployeeIdr: number;
  bpjsEmployerIdr: number;
  pph21TaxIdr: number;
  netSalaryIdr: number;
  terCategory: string;
  terRatePercent: number;
  bpjs: ReturnType<typeof calculateBpjsContribution>;
  tax: ReturnType<typeof calculatePph21Ter>;
  payStructureSource: "policy" | "fallback";
};

/** Compose gross from pay structure, then run existing BPJS + PPh 21 TER engines unchanged. */
export function computeStatutoryPayrollLine(input: StatutoryPayrollLineInput): StatutoryPayrollLine {
  const variableAllowancesIdr = input.variableAllowancesIdr ?? 0;
  const overtimePayIdr = input.overtimePayIdr ?? 0;
  const thrPayIdr = input.thrPayIdr ?? 0;
  const grossSalaryIdr =
    input.basicSalaryIdr + input.fixedAllowancesIdr + variableAllowancesIdr + overtimePayIdr + thrPayIdr;

  const bpjs = calculateBpjsContribution(
    input.basicSalaryIdr,
    input.fixedAllowancesIdr,
    input.workerCategory
  );
  const tax = calculatePph21Ter(
    grossSalaryIdr,
    input.ptkpStatus,
    input.hasNpwp,
    input.workerCategory
  );
  const netSalaryIdr = grossSalaryIdr - bpjs.totalEmployeeDeductions - tax.pph21TaxIdr;

  return {
    basicSalaryIdr: input.basicSalaryIdr,
    fixedAllowancesIdr: input.fixedAllowancesIdr,
    variableAllowancesIdr,
    overtimePayIdr,
    thrPayIdr,
    grossSalaryIdr,
    bpjsEmployeeIdr: bpjs.totalEmployeeDeductions,
    bpjsEmployerIdr: bpjs.totalEmployerCost,
    pph21TaxIdr: tax.pph21TaxIdr,
    netSalaryIdr,
    terCategory: String(tax.terCategory),
    terRatePercent: tax.terRatePercent,
    bpjs,
    tax,
    payStructureSource: input.payStructureSource ?? "fallback",
  };
}
