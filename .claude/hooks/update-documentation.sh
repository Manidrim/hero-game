#!/usr/bin/env bash
#
# Stop hook : à la fin de chaque réponse, si du code du projet a été modifié,
# demande à Claude de créer/mettre à jour la documentation (domaine ou métier)
# via le skill "documentation-projet".
#
# Protections anti-boucle :
#   1. stop_hook_active : quand Claude continue déjà à cause de ce hook, on
#      autorise l'arrêt (exit 0).
#   2. On ignore les changements dans docs/ et .claude/ : une fois que seule la
#      doc a bougé, le hook ne se redéclenche pas.

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

# Changements sur des fichiers source, hors documentation et config Claude.
# Format porcelain : 2 caractères de statut + 1 espace + chemin.
changes=$(git status --porcelain 2>/dev/null | grep -vE '^...(docs/|\.claude/)' || true)
if [ -z "$changes" ]; then
  exit 0
fi

reason=$(cat <<'EOF'
Des fichiers du projet ont été modifiés durant cette réponse. Avant de terminer,
utilise le skill "documentation-projet" (outil Skill) pour créer ou mettre à
jour la documentation concernée sur le(s) sujet(s) réellement traité(s) :
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
