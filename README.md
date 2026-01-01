# Persona

"I want to build a personal website using AI."

A project I built over winter break. AI has gotten great at building frontends, but to be honest, they often look very similar and are based on training by said AI company. Persona is a drop in "Kit", "Care Package", or anything else you want to call it for your CLI, that supports the setup, building, and deployment of your personal website.

<img width="2366" height="1196" alt="image" src="https://github.com/user-attachments/assets/e25a8419-4892-488d-9795-c7d25ee85728" />


## Quick Start

```bash
git clone https://github.com/JacbK/persona.git
# Or click use template in the top right of this Github page (RECOMMENDED)
cd persona
./setup.sh
```

That's it. The setup script walks you through everything:

1. **Repository** — Creates your own GitHub repo
2. **Dependencies** — Installs packages
3. **Configuration** — Opens a UI to set your preferences
4. **AI Assistant** — Configures your coding AI
5. **Launch** — AI starts building your portfolio

## Requirements

- Node.js 18+
- An AI coding assistant: [Claude Code](https://claude.ai/code), [Cursor](https://cursor.sh), [Codex](https://openai.com/codex), [Gemini CLI](https://github.com/google-gemini/gemini-cli), or [Aider](https://aider.chat)

## How It Works

1. **You configure** — Name, links, which sections you want, design preferences
2. **You upload** (optional) — Resume, headshot, project screenshots
3. **AI researches** — Pulls from your GitHub, LinkedIn, materials
4. **AI designs** — Creates a unique direction based on your taste using custom design skills
5. **AI builds** — Writes the actual code from scratch
6. **You deploy** — One command to go live

The result isn't a filled-in template, its a custom site based on your selections that doesn't look like AI model training datasets.

## Add Your Materials (Optional)

Drop files in `/materials` before running setup or upload them during setup:

```
materials/
├── documents/
│   └── resume.pdf       # AI extracts your experience
└── images/
    └── headshot.jpg     # Used in your portfolio
```

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

## License

MIT
