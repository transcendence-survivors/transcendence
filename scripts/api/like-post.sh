#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3001/api/v1}"
COOKIE_JAR="$(dirname "$0")/.cookies"

DEFAULT_POST_ID=""
DEFAULT_ACTION="add"

POST_ID="${1:-$DEFAULT_POST_ID}"
ACTION="${2:-$DEFAULT_ACTION}"

if [[ -z "$POST_ID" ]]; then
  echo "Usage: like-post.sh <postId> [add|remove|count]"
  exit 1
fi

case "$ACTION" in
  add)
    method="POST"
    ;;
  remove)
    method="DELETE"
    ;;
  count)
    method="GET"
    ;;
  *)
    echo "Action inconnue: $ACTION (attendu: add, remove, count)"
    exit 1
    ;;
esac

response=$(curl -s -b "$COOKIE_JAR" -w "\n%{http_code}" -X "$method" "$API_URL/likes/$POST_ID")
body=$(echo "$response" | sed '$d')
status=$(echo "$response" | tail -n1)

echo "STATUS: $status"
echo "$body" | jq .
