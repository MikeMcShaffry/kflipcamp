param(
    [switch]$Unit,
    [switch]$Integration,
    [switch]$Live
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$publicHtml = Split-Path -Parent $root

Set-Location $publicHtml

$env:NODE_ENV = 'test'

# Run mocha directly under node to avoid cmd.exe wrapper quirks on Windows.

$unitGlob = '.\\test\\unit\\*.test.js'
$integrationGlob = '.\\test\\integration\\*.test.js'
$liveGlob = '.\\test\\live\\*.test.js'

$files = @()

# Selection rules:
# - If any switches are provided, run only the selected layers.
# - If no switches are provided, run unit + integration by default.

$anySwitch = $Unit -or $Integration -or $Live

if ($anySwitch) {
    if ($Unit) { $files += $unitGlob }
    if ($Integration) { $files += $integrationGlob }
    if ($Live) { $files += $liveGlob }
} else {
    $files += $unitGlob
    $files += $integrationGlob
}

# Live tests are opt-in and require a target base URL.
if ($files -contains $liveGlob) {
    if (-not $env:KFLIP_BASE_URL) {
        throw 'KFLIP_BASE_URL must be set to run live tests (e.g. https://www.kflipcamp.org)'
    }
}

# Only pass globs that actually match files (Mocha treats unmatched globs differently across shells).
$resolved = @()
foreach ($pattern in $files) {
    $matches = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    if ($matches) { $resolved += $matches.FullName }
}

if (-not $resolved -or $resolved.Count -eq 0) {
    Write-Host 'No matching test files found for the selected suite.'
    exit 0
}

node .\node_modules\mocha\bin\mocha.js --reporter spec --slow 200 --bail --timeout 10000 @resolved
exit $LASTEXITCODE
