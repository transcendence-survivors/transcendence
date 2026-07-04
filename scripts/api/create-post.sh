#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3001/api/v1}"
COOKIE_JAR="$(dirname "$0")/.cookies"

DEFAULT_CONTENT="Post créé depuis le script"
DEFAULT_IMAGE_PATH="/private/tmp/claude-501/-Users-noafanizzi-Documents-42-transcendence/7f492e88-eb1e-4af9-b4da-b5dda7706074/scratchpad/test.png"

CONTENT="${1:-$DEFAULT_CONTENT}"
IMAGE_PATH="${2:-$DEFAULT_IMAGE_PATH}"

args=(-s -b "$COOKIE_JAR" -w "\n%{http_code}" -X POST "$API_URL/posts" -F "content=$CONTENT")

if [[ -n "$IMAGE_PATH" ]]; then
  args+=(-F "file=@$IMAGE_PATH")
fi

response=$(curl "${args[@]}")
body=$(echo "$response" | sed '$d')
status=$(echo "$response" | tail -n1)

echo "STATUS: $status"
echo "$body" | jq .
