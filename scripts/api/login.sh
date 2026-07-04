#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3001/api/v1}"
COOKIE_JAR="$(dirname "$0")/.cookies"

DEFAULT_USERNAME_OR_EMAIL="ben101"
DEFAULT_PASSWORD="sENOI12s+"

USERNAME_OR_EMAIL="${1:-$DEFAULT_USERNAME_OR_EMAIL}"
PASSWORD="${2:-$DEFAULT_PASSWORD}"

response=$(curl -s -c "$COOKIE_JAR" -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"usernameOrEmail\": \"$USERNAME_OR_EMAIL\", \"password\": \"$PASSWORD\"}")

body=$(echo "$response" | sed '$d')
status=$(echo "$response" | tail -n1)

echo "STATUS: $status"
echo "$body" | jq .
