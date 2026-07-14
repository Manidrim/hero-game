#!/usr/bin/env bash
#
# Stop hook : le clean code est prioritaire (voir CLAUDE.md). On refuse de
# terminer la réponse si du code JS (ou l'outillage) a changé et que le lint
# ESLint OU les tests Vitest échouent. Claude est alors invité à corriger avant
# de finir.
#
# Anti-boucle : si Claude continue déjà à cause d'un stop hook
# (stop_hook_active), on autorise l'arrêt (exit 0).

set -uo pipefail

input=$(cat)

# jq indisponible -> on ne bloque jamais la fin de réponse.
command -v jq >/dev/null 2>&1 || exit 0

stop_active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false')
[ "$stop_active" = "true" ] && exit 0

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$project_dir" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# --- Détecte si du code JS ou l'outillage a changé (committé + working tree) ---
head_sha=$(git rev-parse --verify --quiet HEAD 2>/dev/null || true)
base=""
for cand in \
  "$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null || true)" \
  origin/main origin/master main master; do
  [ -n "$cand" ] || continue
  if git rev-parse --verify --quiet "${cand}^{commit}" >/dev/null 2>&1; then
    base="$cand"
    break
  fi
done

range=""
if [ -n "$base" ] && \
   [ "$(git rev-parse --verify --quiet "${base}^{commit}")" != "$head_sha" ]; then
  range="${base}...HEAD"
elif git rev-parse --verify --quiet HEAD~1 >/dev/null 2>&1; then
  range="HEAD~1...HEAD"
fi

committed=""
[ -n "$range" ] && committed=$(git diff --name-only "$range" 2>/dev/null || true)
worktree=$(git status --porcelain 2>/dev/null | sed 's/^...//' || true)
all=$(printf '%s\n%s\n' "$committed" "$worktree" | sed '/^$/d' | sort -u)

# Rien à vérifier si aucun .js ni fichier d'outillage n'a changé.
changed=$(printf '%s\n' "$all" \
  | grep -vE '^node_modules/' \
  | grep -E '(\.js$|^package(-lock)?\.json$|^eslint\.config\.js$)' || true)
[ -z "$changed" ] && exit 0

# Outils requis absents (session sans install) -> on ne bloque pas faute de
# pouvoir vérifier ; le SessionStart hook ensure-deps.sh les installe normalement.
[ -x node_modules/.bin/eslint ] || exit 0
[ -x node_modules/.bin/vitest ] || exit 0

# --- Lint + tests -------------------------------------------------------------
lint_fail=0
test_fail=0
lint_out=""
test_out=""
lint_out=$(npm run lint 2>&1) || lint_fail=1
test_out=$(npm run test:run 2>&1) || test_fail=1

[ "$lint_fail" -eq 0 ] && [ "$test_fail" -eq 0 ] && exit 0

jq -n \
  --arg lint "$lint_out" --arg test "$test_out" \
  --argjson lf "$lint_fail" --argjson tf "$test_fail" '
  {decision: "block",
   reason: ("Le clean code est prioritaire (voir CLAUDE.md) : le lint et les tests doivent être verts avant de terminer.\n\n"
     + (if $lf == 1 then "### ESLint a échoué\n```\n" + $lint + "\n```\n\n" else "" end)
     + (if $tf == 1 then "### Vitest a échoué\n```\n" + $test + "\n```\n\n" else "" end)
     + "Corrige ces problèmes, puis relance `npm run lint` et `npm run test:run`.")}'
exit 0
