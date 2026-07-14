#!/usr/bin/env bash
#
# Stop hook : à la fin de chaque réponse, si du code du projet a été modifié
# sans que la documentation ait été mise à jour, demande à Claude de créer/
# mettre à jour la documentation (domaine ou métier) via le skill
# "documentation-projet".
#
# Détection des changements (le point clé) :
#   On regarde À LA FOIS les changements committés sur la branche ET les
#   changements non committés (working tree). C'est nécessaire car le workflow
#   commit+push AVANT la fin de réponse laisse un working tree propre : se
#   limiter à `git status` (ancienne version) ratait donc tout le travail déjà
#   committé, et le hook ne se déclenchait jamais.
#
# Protections anti-boucle :
#   1. stop_hook_active : quand Claude continue déjà à cause de ce hook, on
#      autorise l'arrêt (exit 0).
#   2. Heuristique « doc présente » : on ne rappelle QUE si du code a changé
#      alors que docs/ n'a PAS été touché. Dès que la doc est écrite (working
#      tree ou commit), docs/ apparaît dans les changements et le hook cesse
#      de relancer — y compris entre deux tours.
#   3. On ignore toujours les changements dans docs/ et .claude/.

set -uo pipefail

input=$(cat)

# jq indisponible -> on ne bloque jamais la fin de réponse.
command -v jq >/dev/null 2>&1 || exit 0

stop_active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false')
if [ "$stop_active" = "true" ]; then
  exit 0
fi

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$project_dir" 2>/dev/null || exit 0

# Pas un dépôt git -> rien à comparer.
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# --- Détermination de la base de comparaison des changements committés --------
# On essaie, dans l'ordre : la branche par défaut du remote, main/master, puis
# en dernier recours le commit précédent. Si rien ne convient (premier commit),
# on se rabat sur le seul working tree.
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
  range="HEAD~1...HEAD"   # repli : au moins le dernier commit
fi

# --- Collecte des fichiers modifiés (committés + working tree) ----------------
committed=""
[ -n "$range" ] && committed=$(git diff --name-only "$range" 2>/dev/null || true)
# Format porcelain : 2 caractères de statut + 1 espace + chemin -> on retire les 3.
worktree=$(git status --porcelain 2>/dev/null | sed 's/^...//' || true)

all=$(printf '%s\n%s\n' "$committed" "$worktree" | sed '/^$/d' | sort -u)

# Code source touché (hors documentation et config Claude) ?
src=$(printf '%s\n' "$all" | grep -vE '^(docs/|\.claude/)' | sed '/^$/d' || true)
# Documentation touchée ?
docs=$(printf '%s\n' "$all" | grep -E '^docs/' | sed '/^$/d' || true)

# On ne rappelle que si du code a changé SANS mise à jour de la doc.
if [ -z "$src" ] || [ -n "$docs" ]; then
  exit 0
fi

reason=$(cat <<'EOF'
Des fichiers du projet ont été modifiés (y compris déjà committés) sans mise à
jour de la documentation. Avant de terminer, utilise le skill
"documentation-projet" (outil Skill) pour créer ou mettre à jour la
documentation concernée sur le(s) sujet(s) réellement traité(s) :
- doc "domaine" (technique) dans docs/domaine/,
- doc "métier" (fonctionnelle) dans docs/metier/,
- et l'index docs/README.md (arborescence à jour).
Respecte l'arborescence par sous-dossiers thématiques et la limite de 500 lignes
par fichier (découpe si besoin). Si la documentation du sujet n'existe pas
encore, crée-la. Si un domaine récurrent le justifie, crée aussi un skill dédié
sous .claude/skills/ pour améliorer la compréhension du projet. Ne documente que
ce qui a changé ; si aucune mise à jour n'est pertinente, tu peux t'arrêter.
EOF
)

jq -n --arg reason "$reason" '{decision: "block", reason: $reason}'
exit 0
