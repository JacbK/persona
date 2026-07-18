---
name: deploy
description: Publish a completed Persona portfolio safely through Vercel or GitHub Pages.
---

# Deploy a Persona portfolio

Use this only after the portfolio is complete. Never publish the untouched Persona starter page.

## Preflight

1. Run `git remote -v`. Do not publish to `JacbK/Persona`.
2. Run `npm run check` and fix every failure.
3. Check mobile layout, links, images, metadata, favicon, and social preview.
4. Search for placeholders and private material:

```bash
rg -n "TODO|Lorem ipsum|Your Name" src public
git status --short
```

5. Confirm that `profile.yaml`, resumes, and uploaded materials are safe to make public.

## Ask before publishing

Offer:

- Vercel — recommended for Next.js.
- GitHub Pages — free static hosting.
- Not now.

Publishing changes external state, so wait for the user's choice.

## Vercel

The simplest path is Vercel's Git integration:

1. Push the portfolio to the user's own GitHub repository.
2. Import that repository at `https://vercel.com/new`.
3. Keep the detected Next.js settings.
4. Deploy and verify the live URL.

For CLI deployment, use the user's installed and authenticated Vercel CLI. Do not request, print, or store a token in project files.

```bash
vercel
vercel --prod
```

The included `.github/workflows/deploy-vercel.yml` is manual. It requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` repository secrets.

## GitHub Pages

GitHub Pages needs a static export. Persona's manual workflow handles this in a disposable CI checkout:

1. Push to the user's own GitHub repository.
2. In repository Settings → Pages, choose GitHub Actions.
3. Run **Deploy portfolio to GitHub Pages** from the Actions tab.
4. Verify the Pages URL, including images and internal links.

The workflow removes the local-only config UI and APIs only from its temporary build workspace. Do not delete working source files just to deploy.

## Other hosts

Use the host's current official Next.js adapter or documentation. Do not guess output directories; Next.js server and static-export deployments use different outputs.

## Safety rules

- Never deploy while `origin` points to the Persona template repository.
- Never put access tokens in `profile.yaml`, source files, shell history, or agent configuration committed to Git.
- Do not edit global agent or MCP settings as part of deployment.
- Keep deployment workflows manual until the user deliberately enables automatic production deploys.
- After publishing, test the real URL on desktop and mobile.
