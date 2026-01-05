# Persona

**Build your portfolio website with AI.**

Persona is a drop-in kit for AI coding assistants that helps you create a unique, professional portfolio site. No templates—the AI researches who you are and builds something custom.

<img width="2366" height="1196" alt="Persona Setup UI" src="https://github.com/user-attachments/assets/e25a8419-4892-488d-9795-c7d25ee85728" />

## Supported AI Assistants

| Assistant | Auto-Discovery | File |
|-----------|---------------|------|
| [Claude Code](https://claude.ai/code) | ✓ | `CLAUDE.md` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | ✓ | `GEMINI.md` |
| [Codex](https://openai.com/codex) | ✓ | `AGENTS.md` |
| [Cursor](https://cursor.sh) | ✓ | `.cursorrules` |
| [Antigravity](https://antigravity.google) | ✓ | `.antigravity/rules.md` |
| [Windsurf](https://windsurf.com) | Manual | — |
| Others (Aider, etc.) | Manual | — |

## Quick Start

```bash
git clone https://github.com/JacbK/persona.git
cd persona
./setup.sh
```

The setup script walks you through:

1. **Repository** — Creates your own GitHub repo
2. **Dependencies** — Installs packages
3. **Configuration** — Opens a UI to set your preferences
4. **AI Assistant** — Selects and configures your coding AI
5. **Launch** — AI starts building your portfolio

## Requirements

- Node.js 18+
- An AI coding assistant (see supported list above)

## How It Works

1. **You configure** — Run `./setup.sh` to set your name, links, sections, and design preferences
2. **You upload** (optional) — Drop your resume, headshot, or project screenshots in `/materials`
3. **AI researches** — The agent reads your config, materials, GitHub, and searches the web
4. **AI designs** — Creates a unique visual direction and presents it for approval
5. **AI builds** — Writes React/Tailwind code from scratch
6. **You deploy** — One command to go live on Vercel, Netlify, or GitHub Pages

The result isn't a filled-in template—it's a custom site that reflects who you actually are.

## Recommended Models

For best results, use the most capable model available:

| CLI | Recommended Model |
|-----|------------------|
| Claude Code | Opus 4.5 |
| Gemini CLI | Gemini 3 Pro |
| Codex | GPT-5.2-Codex |
| Cursor | Claude Opus 4.5 |
| Antigravity | Gemini 3 Pro |

## After Setup

Talk to your AI assistant naturally:

- *"Add my new project X"*
- *"Update my work experience"*
- *"Make the hero section more bold"*
- *"Deploy to Vercel"*

Run `./setup.sh` again anytime to edit your config.

## Deploy

Ask your AI, or run directly:

```bash
vercel --prod      # Vercel (recommended)
netlify deploy     # Netlify
```

GitHub Actions workflows are pre-configured in `.github/workflows/`.

## Project Structure

```
persona/
├── .agent/                    # AI instructions (Agent Skills standard)
│   ├── persona/SKILL.md       # Main instructions
│   └── skills/                # Specialized skills
├── CLAUDE.md                  # Claude Code auto-discovery
├── GEMINI.md                  # Gemini CLI auto-discovery
├── AGENTS.md                  # Codex auto-discovery
├── .cursorrules               # Cursor auto-discovery
├── .antigravity/rules.md      # Antigravity auto-discovery
├── materials/                 # Your resume, images, etc.
├── profile.yaml               # Your configuration (created by setup)
└── src/                       # Next.js app (AI builds here)
```

## License

MIT
