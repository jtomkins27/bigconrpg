# ============================================================
# dev/soak.ps1 — hour-long soak runner for BIGCON RPG batteries
# ------------------------------------------------------------
# Repeats the harness batteries in a loop for <Minutes> and appends a
# per-run digest + tally to a log under %TEMP%\opencode\soak\.
#
#   powershell -ExecutionPolicy Bypass -File dev\soak.ps1 -Mode mp   -Tag MP   -Minutes 55
#   powershell -ExecutionPolicy Bypass -File dev\soak.ps1 -Mode solo -Tag SOLO -Minutes 55
#
# mp   : alternates dev/mp_test.js with 12 and 8 crews (multiplayer crews
#        played by the two-sandbox FakePeer auto-drivers, host + client)
# solo : dev/playtest.js with 14 full headless single-player playthroughs
#
# The script reads index.html only; it never edits game code. It is a
# supervisor for the harnesses — findings appear in node's output and
# dev/mp_debug.txt (gitignored), whose interesting run digests are copied
# into the soak log below.
# ============================================================
param(
  [int]$Minutes = 55,
  [ValidateSet('mp','solo')][string]$Mode = 'mp',
  [string]$Tag = 'A'
)
$ErrorActionPreference = 'Continue'
Set-Location -Path (Split-Path -Parent $PSScriptRoot)   # repo root (dev/ parent)

$logDir = Join-Path $env:TEMP 'opencode\soak'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$log = Join-Path $logDir ('soak_' + $Tag + '_' + (Get-Date -Format 'HHmmss') + '.log')

"=== SOAK start mode=$Mode tag=$Tag $(Get-Date -Format s) | planned $Minutes min ===" | Add-Content $log
$end = (Get-Date).AddMinutes($Minutes)
$i = 0
$failRuns = @()
$warnRuns = 0
$verdicts = 0
$stop = $false
while ((Get-Date) -lt $end) {
  $i++
  if ($Mode -eq 'mp') {
    $crews = if ($i % 2 -eq 0) { 12 } else { 8 }
    $label = "run $i · mp · $crews crews"
    $out = & node dev\mp_test.js $crews 2>&1 | Out-String
  } else {
    $label = "run $i · solo · 14 playthroughs"
    $out = & node dev\playtest.js 14 2>&1 | Out-String
  }
  $code = $LASTEXITCODE
  ($out -split "`r?`n" | Where-Object {
      $_ -match '(^RUN |CREW|VERDICT|findings|verdict mix|battle record|grind|error|SYNC FAIL|desync|stall|warndone|done in)'
    }) -join "`n" | Add-Content $log
  "$label -> exit=$code" | Add-Content $log

  if ($out -match '\[warn\]') { $warnRuns++ } else { if ($out -notmatch '\[error\]') { $verdicts++ } }
  if ($code -ne 0) { $failRuns += $i; "$label FAILED - full output:" | Add-Content $log; $out | Add-Content $log }
}
"=== SOAK end $(Get-Date -Format s) | runs=$i cleanRuns=$verdicts warnRuns=$warnRuns failRuns=$(($failRuns -join ',')) ===" | Add-Content $log
Write-Host ("SOAK COMPLETE mode=$mode runs=$i cleanRuns=$verdicts warnRuns=$warnRuns failRuns=" + ($failRuns -join ','))
Write-Host "LOG=$log"
