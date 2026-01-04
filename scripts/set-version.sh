#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: set-version.sh <version>" >&2
  exit 1
fi

VERSION="$1"

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "ERROR: python3 or python not found" >&2
  exit 1
fi

"$PY" - <<PY
import json
path="manifest.json"
m=json.load(open(path))
m["version"]="$VERSION"
open(path,"w").write(json.dumps(m, indent=2) + "\n")
PY

