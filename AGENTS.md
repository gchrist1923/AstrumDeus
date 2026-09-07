# AstrumDeus

Project instructions for coding agents. Repo: https://github.com/gchrist1923/AstrumDeus

## Superpowers

This project uses the [Superpowers](https://github.com/obra/superpowers) plugin.

- Before building features: use **brainstorming**, then **writing-plans**
- Before implementing: prefer **test-driven-development**
- For bugs: use **systematic-debugging**
- Before claiming done: use **verification-before-completion**
- If a skill might apply, invoke it before acting

Project rules in this file override skill defaults when they conflict. Direct user instructions override both.

## Interface skills (anti AI-slop)

UI/UX skills from [jakubkrehel/skills](https://github.com/jakubkrehel/skills) live in `.cursor/skills/`.

When building or changing UI, product copy, layout, color, typography, or accessibility:

- Read and follow **better-interface** (routes the domain skills)
- Prefer **better-ui**, **better-typography**, **better-colors**, **better-layout**, **better-writing**, **better-accessibility** as needed
- For a full pass on a change, use **interface-review** when asked
- Avoid generic AI-default looks: purple gradients, cream+serif+terracotta clichés, Inter/Roboto stacks, pill spam, glow-heavy dark UI, card-everything layouts
- One composition per viewport; brand-first on branded pages; real visual anchors over decorative gradients

## Working style

- Prefer small, focused changes over broad rewrites
- Match existing project patterns when code exists
- Do not commit or push unless Grace explicitly asks
- Do not invent architecture, stack, or product scope — confirm first when unclear

## Repo hygiene

- Keep secrets out of the repo (`.env`, credentials, tokens)
- Prefer clear commit messages that explain why, not only what
