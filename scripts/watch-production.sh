#!/usr/bin/env bash
# Poll origin/Production and deploy when a new commit appears.
# Works for private repos (uses git credentials). Fallback when
# GitHub Actions cannot run a self-hosted job on this host.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-Production}"
INTERVAL_SEC="${DEPLOY_POLL_SECONDS:-60}"

export PATH="/usr/local/bin:/usr/bin:/bin:${HOME}/.local/bin:${PATH:-}"

echo "Watching $BRANCH every ${INTERVAL_SEC}s in $ROOT"

while true; do
  cd "$ROOT"
  if git fetch origin "$BRANCH" >/dev/null 2>&1; then
    remote="$(git rev-parse "origin/$BRANCH" 2>/dev/null || true)"
    local_sha="$(git rev-parse HEAD 2>/dev/null || true)"

    if [[ -n "$remote" && -n "$local_sha" && "$remote" != "$local_sha" ]]; then
      echo "$(date -Is) New commit on $BRANCH: $local_sha -> $remote"
      if "$ROOT/scripts/deploy-production.sh"; then
        echo "$(date -Is) Deploy OK"
      else
        echo "$(date -Is) Deploy FAILED" >&2
      fi
    fi
  else
    echo "$(date -Is) git fetch failed; will retry" >&2
  fi
  sleep "$INTERVAL_SEC"
done
