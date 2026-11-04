#!/usr/bin/env bash
# Deploy latest origin/Production on this host and restart PM2 (port 3004).
# Used by GitHub Actions and scripts/watch-production.sh.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PM2_APP="${PM2_APP:-imran-portfolio}"
PM2_TUNNEL="${PM2_TUNNEL:-imran-portfolio-tunnel}"
BRANCH="${DEPLOY_BRANCH:-Production}"
LOG="${ROOT}/scripts/last-deploy.log"
PORT="${PORT:-3004}"
BIND_HOST="${BIND_HOST:-0.0.0.0}"

export PATH="/usr/local/bin:/usr/bin:/bin:${HOME}/.local/bin:${PATH:-}"
export PORT BIND_HOST

exec > >(tee -a "$LOG") 2>&1

echo "==> $(date -Is) Deploy root: $ROOT"
cd "$ROOT"

echo "==> Fetch + reset to origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=out \
  --exclude=.env \
  --exclude=.env.local

if command -v git-lfs >/dev/null 2>&1 || git lfs version >/dev/null 2>&1; then
  echo "==> git lfs pull"
  git lfs pull
fi

echo "==> npm ci"
npm ci

echo "==> build"
npm run build

echo "==> Restart PM2: $PM2_APP (port $PORT)"
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 restart "$PM2_APP" --update-env
else
  pm2 start "$ROOT/scripts/pm2-start.sh" \
    --name "$PM2_APP" \
    --interpreter bash \
    --cwd "$ROOT" \
    --update-env
fi

if pm2 describe "$PM2_TUNNEL" >/dev/null 2>&1; then
  echo "==> Ensure tunnel online: $PM2_TUNNEL"
  status="$(pm2 jlist | python3 -c "
import json,sys
apps=json.load(sys.stdin)
name=sys.argv[1]
for a in apps:
  if a.get('name')==name:
    print(a.get('pm2_env',{}).get('status',''))
    break
" "$PM2_TUNNEL" 2>/dev/null || true)"
  if [[ "$status" != "online" ]]; then
    pm2 restart "$PM2_TUNNEL" --update-env
  fi
else
  echo "==> Start tunnel: $PM2_TUNNEL"
  pm2 start "$ROOT/scripts/start-cloudflare-tunnel.sh" \
    --name "$PM2_TUNNEL" \
    --interpreter bash \
    --cwd "$ROOT"
fi

pm2 save

echo "==> Health check"
ok=0
for i in 1 2 3 4 5 6 7 8 9 10; do
  sleep 2
  if curl -fsS -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:${PORT}/"; then
    ok=1
    break
  fi
  echo "waiting for :${PORT} (attempt $i)..."
done
if [[ "$ok" -ne 1 ]]; then
  echo "Health check failed on port ${PORT}" >&2
  exit 1
fi

echo "==> $(date -Is) Deploy complete"
pm2 list | grep -E "imran|name" || pm2 list
