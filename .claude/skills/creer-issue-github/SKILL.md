---
name: creer-issue-github
description: >-
  Crée une issue GitHub sur le dépôt hero-game via le serveur MCP GitHub.
  À utiliser quand l'utilisateur demande de créer/ouvrir une issue, un ticket,
  un bug report ou une demande de fonctionnalité sur GitHub.
---

# Créer une issue GitHub

Dépôt : `manidrim/hero-game`. Utilise les outils MCP `mcp__github__*`.

## Workflow

1. **Vérifier les doublons** : `mcp__github__search_issues`
   (`query: "repo:manidrim/hero-game is:issue <mots-clés>"`). Si une issue
   proche existe, la signaler à l'utilisateur avant d'en créer une.
2. **Rédiger** le titre (court, impératif) et le corps selon le gabarit.
3. **Créer** : `mcp__github__issue_write` (`method: "create"`,
   `owner: "manidrim"`, `repo: "hero-game"`, `title`, `body`, `labels`).
4. **Confirmer** en renvoyant l'URL de l'issue créée.

## Gabarit du corps (Markdown, français)

```markdown
## Contexte
Pourquoi : le besoin ou le problème observé.

## Objectif / attendu
Ce qui doit être fait ou le comportement attendu.

## Détails
- Point / critère d'acceptation 1
- Point / critère d'acceptation 2
```

Pour un **bug**, remplace par : `## Symptôme`, `## Reproduction`
(étapes numérotées), `## Comportement attendu`.

## Règles

- Titre et corps **en français**, concis, sans remplissage.
- Ne demande à l'utilisateur que ce qui manque vraiment ; sinon déduis du
  contexte de la conversation.
- Labels usuels si pertinents : `bug`, `enhancement`, `documentation`.
- Ne crée l'issue qu'après validation implicite ou explicite de l'utilisateur.
