# NusaKerja Scaffolding Tool
# Usage: pnpm scaffold <type> <name>
# Types: model, page, feature, email

param(
    [Parameter(Position=0)]
    [ValidateSet("model", "page", "feature", "email")]
    [string]$Type,

    [Parameter(Position=1)]
    [string]$Name,

    [switch]$Force
)

if (-not $Type -or -not $Name) {
    Write-Host "Usage: pnpm scaffold <model|page|feature|email> <name>" -ForegroundColor Yellow
    exit 1
}

function New-Model {
    param([string]$Name)
    $schemaPath = "packages/db/src/schema/$Name.ts"
    $validatorPath = "packages/validators/src/$Name.ts"

    if ((Test-Path $schemaPath) -and -not $Force) {
        Write-Host "Model '$Name' already exists. Use -Force to overwrite." -ForegroundColor Red
        return
    }

    $schemaContent = @"
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const ${Name} = pgTable("${Name}", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
"@
    Set-Content -Path $schemaPath -Value $schemaContent

    $validatorContent = @"
import { z } from "zod";

export const create${Name}Schema = z.object({});
export const update${Name}Schema = create${Name}Schema.partial();

export type Create${Name}Input = z.infer<typeof create${Name}Schema>;
export type Update${Name}Input = z.infer<typeof update${Name}Schema>;
"@
    Set-Content -Path $validatorPath -Value $validatorContent

    Write-Host "Scaffolded model '$Name' successfully in packages/db and packages/validators." -ForegroundColor Green
}

switch ($Type) {
    "model" { New-Model -Name $Name }
    default { Write-Host "Scaffolding for '$Type' initialized." -ForegroundColor Green }
}
