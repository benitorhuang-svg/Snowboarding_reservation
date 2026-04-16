param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "build", "lint", "db-push", "db-generate", "clean")]
    $Action
)

switch ($Action) {
    "dev" {
        Write-Host "Starting Development Services..." -ForegroundColor Cyan
        pnpm run dev
    }
    "build" {
        Write-Host "Building All Packages..." -ForegroundColor Cyan
        pnpm --filter "*" run build
    }
    "lint" {
        Write-Host "Linting Entire Monorepo..." -ForegroundColor Cyan
        pnpm run lint
    }
    "db-push" {
        Write-Host "Pushing Schema to Database..." -ForegroundColor Cyan
        pnpm run prisma:push
    }
    "db-generate" {
        Write-Host "Generating Prisma Client..." -ForegroundColor Cyan
        pnpm run prisma:generate
    }
    "clean" {
        Write-Host "Cleaning node_modules and dist..." -ForegroundColor Yellow
        Get-ChildItem -Path . -Include node_modules, dist, .turbo -Recurse -Directory | Remove-Item -Recurse -Force
    }
}
