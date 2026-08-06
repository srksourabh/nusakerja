export type OrgEmployeeNode = {
  id: string;
  fullName: string;
  employeeCode: string;
  grade: number;
  managerEmployeeId: string | null;
};

export function assertGrade(grade: number): asserts grade is 1 | 2 | 3 | 4 | 5 {
  if (!Number.isInteger(grade) || grade < 1 || grade > 5) {
    throw new Error("Grade must be an integer from 1 (lowest) to 5 (highest).");
  }
}

/**
 * Return employee ids in the subtree rooted at `rootId` (including root),
 * walking managerEmployeeId edges (child.managerEmployeeId === parent.id).
 */
export function collectSubtreeIds(
  employees: OrgEmployeeNode[],
  rootId: string,
  maxDepth = 12
): Set<string> {
  const byManager = new Map<string | null, OrgEmployeeNode[]>();
  for (const e of employees) {
    const key = e.managerEmployeeId;
    const list = byManager.get(key) ?? [];
    list.push(e);
    byManager.set(key, list);
  }

  const result = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: rootId, depth: 0 }];
  while (queue.length) {
    const { id, depth } = queue.shift()!;
    if (result.has(id)) continue;
    result.add(id);
    if (depth >= maxDepth) continue;
    for (const child of byManager.get(id) ?? []) {
      queue.push({ id: child.id, depth: depth + 1 });
    }
  }
  return result;
}

export function buildOrgForest(employees: OrgEmployeeNode[]): Array<OrgEmployeeNode & { children: OrgEmployeeNode[] }> {
  const map = new Map<string, OrgEmployeeNode & { children: OrgEmployeeNode[] }>();
  for (const e of employees) {
    map.set(e.id, { ...e, children: [] });
  }
  const roots: Array<OrgEmployeeNode & { children: OrgEmployeeNode[] }> = [];
  for (const e of employees) {
    const node = map.get(e.id)!;
    if (e.managerEmployeeId && map.has(e.managerEmployeeId)) {
      map.get(e.managerEmployeeId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/** Detect cycles if assigning manager would create a loop. */
export function wouldCreateManagerCycle(
  employees: OrgEmployeeNode[],
  employeeId: string,
  newManagerId: string | null
): boolean {
  if (!newManagerId) return false;
  if (newManagerId === employeeId) return true;
  const byId = new Map(employees.map((e) => [e.id, e]));
  let cursor: string | null = newManagerId;
  const seen = new Set<string>();
  while (cursor) {
    if (cursor === employeeId) return true;
    if (seen.has(cursor)) return true;
    seen.add(cursor);
    cursor = byId.get(cursor)?.managerEmployeeId ?? null;
  }
  return false;
}
