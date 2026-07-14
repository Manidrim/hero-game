#!/usr/bin/env bash
#
# SessionStart hook : installe les dépendances de dev (ESLint, Vitest) si elles
# manquent. Le dépôt est cloné à neuf sur Claude Code web, sans node_modules
# (ignoré par git) ; sans cette étape, le lint et les tests — et donc le gate
# qualité verify-quality.sh — ne seraient pas exécutables.

set -uo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$project_dir" 2>/dev/null || exit 0

[ -f package.json ] || exit 0
command -v npm >/dev/null 2>&1 || exit 0

if [ ! -d node_modules ] || [ ! -x node_modules/.bin/vitest ]; then
  npm install >/dev/null 2>&1 || true
fi

exit 0
