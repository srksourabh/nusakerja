# NusaKerja Deployment & Cutover Script
# Usage: powershell -File ./scripts/deploy.ps1

Write-Host "=== Starting NusaKerja Deployment Pipeline ===" -ForegroundColor Red

# 1. Check environment variables
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file missing. Copy .env.example to .env first." -ForegroundColor Red
    exit 1
}

# 2. Run TypeScript Typecheck
Write-Host "Running typecheck..." -ForegroundColor Yellow
pnpm typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "Typecheck failed. Aborting deployment." -ForegroundColor Red
    exit 1
}

# 3. Push Database Schemas
Write-Host "Pushing PostgreSQL database schema..." -ForegroundColor Yellow
pnpm db:push

# 4. Run Monorepo Build
Write-Host "Building production artifacts..." -ForegroundColor Yellow
pnpm build

Write-Host "=== NusaKerja Deployment Build Ready for Production ===" -ForegroundColor Green
