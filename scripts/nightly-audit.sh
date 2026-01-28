#!/usr/bin/env bash
set -euo pipefail

REPORT_PATH="${1:-audit-report.txt}"

has_script() {
  node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));process.exit(p.scripts && p.scripts['$1'] ? 0 : 1)"
}

{
  echo "Nightly Audit Report - $(date -u)"
  echo "Repo: ${GITHUB_REPOSITORY:-local}"
  echo "Commit: ${GITHUB_SHA:-local}"
  echo "Node: $(node -v || true)"
  echo "NPM: $(npm -v || true)"
  echo ""
  echo "== npm ci =="
} | tee "$REPORT_PATH"

npm ci 2>&1 | tee -a "$REPORT_PATH"

echo "" | tee -a "$REPORT_PATH"
echo "== npm run build ==" | tee -a "$REPORT_PATH"
npm run build 2>&1 | tee -a "$REPORT_PATH"

echo "" | tee -a "$REPORT_PATH"
echo "== npm run lint ==" | tee -a "$REPORT_PATH"
if has_script lint; then
  npm run lint 2>&1 | tee -a "$REPORT_PATH"
else
  echo "skip (no lint script)" | tee -a "$REPORT_PATH"
fi

echo "" | tee -a "$REPORT_PATH"
echo "== npm run test ==" | tee -a "$REPORT_PATH"
if has_script test; then
  npm run test 2>&1 | tee -a "$REPORT_PATH"
else
  echo "skip (no test script)" | tee -a "$REPORT_PATH"
fi

echo "" | tee -a "$REPORT_PATH"
echo "Audit completed successfully." | tee -a "$REPORT_PATH"

