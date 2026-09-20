# Agent instructions

## About this repo

Public site and related assets for **Puca** (folding / modular electric motorcycle brand site). Includes web app pages, Cloudflare Workers config (`wrangler.jsonc`), hardware/software docs under the tree, and nested project folders such as `private-ai-gateway` and `ev-range-extender`.

## Agent roles

- **Claude Code (local on Predator):** interactive implementation, refactors, and verification on the machine.
- **Grok Bot / Cursor cloud agents:** async research, PR and issue watches, routines, and branch/PR work when Nathan is away.

Do not fight over the same change set. If another agent already has an open PR or branch for the task, continue that thread instead of starting a parallel one.

## Shared conventions

- Prefer small, reviewable PRs with a clear summary and how to verify.
- Never commit secrets, tokens, or real `.env` values. If a secret is required, document the variable name only.
- Match existing style in the repo; do not reformat unrelated files.
- Prefer the default branch `main`.
- Leave enough context in the PR/issue for the other agent to pick up cold.

## Handoffs

Use GitHub as the handoff channel:

1. Open or update an issue describing the goal, constraints, and done criteria.
2. Reference that issue from the branch/PR.
3. In the PR body, note what was done, what remains, and how to verify.
4. Tag unfinished work clearly so Claude Code or Grok Bot can continue without guessing.

## Editing these files

`AGENTS.md` is canonical. `CLAUDE.md` only points here so Claude Code loads the same rules. Keep them in sync by editing `AGENTS.md` first.