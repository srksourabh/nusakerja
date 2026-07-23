# NusaKerja Production Deployment & Cutover Pipeline
# Usage: powershell -File ./scripts/deploy.ps1 [-Seed]

param (
    [switch]$Seed = $false
)

Write-Host "=========================================================" -ForegroundColor Red
Write-Host " 🚀 NusaKerja Enterprise HRMS & Statutory Deployment " -ForegroundColor White
Write-Host "=========================================================" -ForegroundColor Red

# 1. Environment Secrets Verification
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env secret configuration file missing." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Environment configuration validated." -ForegroundColor Green

# 2. TypeScript Compilation Check
Write-Host "🔍 Executing monorepo typecheck..." -ForegroundColor Yellow
pnpm typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Typecheck failed. Aborting deployment pipeline." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Typecheck passed cleanly (0 errors)." -ForegroundColor Green

# 3. ESLint Verification
Write-Host "🔍 Executing code quality linting..." -ForegroundColor Yellow
pnpm lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linting failed. Aborting deployment pipeline." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Code quality linting passed." -ForegroundColor Green

# 4. Database Schema Push & Optional Seeding
Write-Host "🗄️ Pushing PostgreSQL multi-tenant schema..." -ForegroundColor Yellow
pnpm db:push

if ($Seed) {
    Write-Host "🌱 Seeding default statutory parameters & sample enterprise data..." -ForegroundColor Yellow
    pnpm db:seed
}

# 5. Production Monorepo Build
Write-Host "📦 Building production distribution bundle..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Production build failed." -ForegroundColor Red
    exit 1
}

Write-Host "=========================================================" -ForegroundColor Green
Write-Host " 🎉 NusaKerja v1.0.0-GA Production Bundle Ready! " -ForegroundColor White
Write-Host "=========================================================" -ForegroundColor Green
