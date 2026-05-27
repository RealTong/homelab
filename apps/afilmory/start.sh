#!/bin/sh
set -eu

export NODE_ENV=production
export PORT=${PORT:-3000}
export PHOTO_BASE_PATH=${PHOTO_BASE_PATH:-/photos}
export PHOTO_BASE_URL=${PHOTO_BASE_URL:-/photos}

printf '[afilmory] generating manifest from %s with public base %s\n' "$PHOTO_BASE_PATH" "$PHOTO_BASE_URL"
pnpm build:manifest

printf '[afilmory] building SSR application\n'
pnpm --filter @afilmory/ssr build

printf '[afilmory] starting SSR server on port %s\n' "$PORT"
exec pnpm --filter @afilmory/ssr start --hostname 0.0.0.0
