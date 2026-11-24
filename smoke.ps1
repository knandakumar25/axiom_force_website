<#
.SYNOPSIS
Runs the public website smoke checks against the shared Compose site.
#>
$ErrorActionPreference = 'Stop'
docker compose --project-directory $PSScriptRoot run --rm playwright npx playwright test smoke.spec.cjs --workers=1
exit $LASTEXITCODE
