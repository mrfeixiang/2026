#!/usr/bin/env bash
# One-command local dev server. Works with zero API keys.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt

[ -f .env ] || cp .env.example .env
echo "▶ InkScape AI on http://127.0.0.1:8000  (Ctrl-C to stop)"
exec uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
