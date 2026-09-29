export function nextEmployeeCode(used: readonly string[], year = new Date().getFullYear()): string {
  const pattern = new RegExp(`^NK-${year}-(\\d+)$`);
  let max = 0;
  for (const code of used) {
    const match = pattern.exec(code);
    if (!match) continue;
    const serial = Number(match[1]);
    if (serial > max) max = serial;
  }
  return `NK-${year}-${String(max + 1).padStart(3, "0")}`;
}
