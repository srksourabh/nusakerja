import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const appDirectory = path.resolve("apps/web/app");
const pagePattern = /^page\.(?:js|jsx|ts|tsx)$/;

async function findPages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) pages.push(...(await findPages(entryPath)));
    else if (pagePattern.test(entry.name)) pages.push(entryPath);
  }

  return pages;
}

function routeForPage(pagePath) {
  const relativeDirectory = path.relative(appDirectory, path.dirname(pagePath));
  const segments = relativeDirectory
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

const pages = await findPages(appDirectory);
const routes = new Map();

for (const page of pages) {
  const route = routeForPage(page);
  const existing = routes.get(route) ?? [];
  existing.push(path.relative(process.cwd(), page).replaceAll(path.sep, "/"));
  routes.set(route, existing);
}

const conflicts = [...routes.entries()].filter(([, routePages]) => routePages.length > 1);
const requiredRoutes = ["/", "/dashboard"];
const missingRoutes = requiredRoutes.filter((route) => !routes.has(route));

if (conflicts.length > 0 || missingRoutes.length > 0) {
  console.error("App Router validation failed.");
  for (const [route, routePages] of conflicts) {
    console.error(`Duplicate route ${route}:`);
    for (const routePage of routePages) console.error(`  - ${routePage}`);
  }
  for (const route of missingRoutes) console.error(`Missing required route: ${route}`);
  process.exit(1);
}

console.log(`Validated ${routes.size} unique application routes:`);
for (const route of [...routes.keys()].sort()) console.log(`  ${route}`);
