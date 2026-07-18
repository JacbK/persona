# Persona

**Build a portfolio that feels like you—not a template with your name pasted in.**

Persona is a starter kit for AI coding agents. You share your goals, work, and visual taste in a local setup page. Your agent uses that context to research, propose a design, build the site, and help you publish it.

<img width="2366" height="1196" alt="Persona's local setup page" src="https://github.com/user-attachments/assets/e25a8419-4892-488d-9795-c7d25ee85728" />

## Start here

1. [Create a repository from this template](https://github.com/new?template_name=persona&template_owner=JacbK).
2. Clone your new repository.
3. Run:

```bash
./setup.sh
```

Persona opens a local setup page, saves your answers to `profile.yaml`, and then opens the coding agent you choose.

Requirements: Node.js 20.18 or newer, npm, Git, and a coding agent.

## What Persona does

- Learns who you are from your profile and optional materials.
- Researches only when you and your agent choose to.
- Proposes a visual direction before changing the site.
- Builds a custom Next.js portfolio instead of filling a fixed template.
- Checks the result before helping you publish it.

## Supported coding agents

Persona includes auto-discovered instructions for Claude Code, Gemini CLI, Codex, Cursor, and Antigravity. Devin and other agents can read `.agent/persona/SKILL.md` directly.

Persona does not install agents, edit global agent settings, or ask for access tokens. Install and sign in to your chosen agent through its official instructions.

## Your data stays local

The setup page runs at `127.0.0.1` and is disabled in production builds. Your profile and uploaded materials are written into your repository. Persona does not send them anywhere by itself.

Anything committed or pushed to a public repository becomes public. Review `profile.yaml` and `materials/` before publishing.

## Useful commands

```bash
npm run dev          # Open the local site
npm run check        # Lint, type-check, test, check setup, and build
npm run build        # Make a production build
./setup.sh            # Create or edit your profile
```

## Publishing

Vercel is the simplest option: import your repository in Vercel and deploy it as a Next.js project.

The included GitHub Actions deployments are manual on purpose, so a fresh template does not fail or publish unexpectedly. See `.agent/skills/deploy/SKILL.md` for Vercel and GitHub Pages steps.

## Project structure

```text
persona/
├── .agent/           # Shared workflow and design guidance
├── materials/        # Optional resume, images, and project material
├── src/app/          # Next.js site and local setup page
├── src/lib/          # Config, upload, and safety helpers
├── AGENTS.md         # Codex instructions
├── CLAUDE.md         # Claude Code instructions
├── GEMINI.md         # Gemini CLI instructions
├── profile.yaml      # Created locally by setup
└── setup.sh          # Local onboarding
```

## Contributing

Run `npm install` once, then `npm run check` before opening a pull request.

## License

[MIT](LICENSE)
