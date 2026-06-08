#!/usr/bin/env sh
# Quick production smoke test. Usage:
#   ./scripts/smoke-production.sh https://api.example.com https://app.example.com

set -e

BACKEND_URL="${1:?Usage: $0 <backend-url> [frontend-url]}"
FRONTEND_URL="${2:-}"

echo "==> Health"
curl -sf "${BACKEND_URL%/}/health" | head -c 200
echo ""

echo "==> Comparisons list"
curl -sf "${BACKEND_URL%/}/api/comparisons" | head -c 200
echo ""

if [ -n "$FRONTEND_URL" ]; then
  echo "==> Frontend"
  curl -sf -o /dev/null -w "HTTP %{http_code}\n" "${FRONTEND_URL%/}/"
fi

echo "Smoke test passed."
