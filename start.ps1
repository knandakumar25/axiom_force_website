<#
.SYNOPSIS
Starts the original game's database and accounts API, then builds and starts the shared site.
.PARAMETER GameRoot
Path to the original Axiom Force checkout. Defaults to the sibling frog_jumper folder.
#>
param([string]$GameRoot = (Join-Path (Split-Path $PSScriptRoot) 'frog_jumper'))

$ErrorActionPreference = 'Stop'
$game = (Resolve-Path -LiteralPath $GameRoot).Path
docker compose --project-directory $game up -d --build --wait --wait-timeout 120 db backend
if ($LASTEXITCODE -ne 0) { throw 'The original accounts stack did not become healthy.' }

docker compose --project-directory $PSScriptRoot up -d --build --wait --wait-timeout 120 website
if ($LASTEXITCODE -ne 0) { throw 'The shared website did not become healthy.' }
