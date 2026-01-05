---
name: deploy
description: Help users deploy their portfolio to production. Covers Vercel, Netlify, Cloudflare Pages, GitHub Pages, Docker, and MCP integration for AI-driven deployment.
---

# Skill: Deployment

Help users deploy their portfolio to production.

---

## Quick Deploy

Ask your AI assistant:
> "Deploy my portfolio to Vercel"

The assistant can run CLI commands (`vercel`, `netlify`, `gh`) to deploy for you.

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] `npm run build` succeeds with no errors
- [ ] All images moved to `/public` and paths updated
- [ ] Environment variables documented (if any)
- [ ] Links are valid (GitHub, LinkedIn, project URLs)
- [ ] No placeholder content ("Lorem ipsum", "TODO", etc.)
- [ ] Responsive design works on mobile
- [ ] Favicon and meta tags set

---

## Deployment Options

### 1. Vercel (Recommended)

**Why**: Zero-config for Next.js, free tier, automatic HTTPS, preview deployments.

**Steps**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time - will prompt for setup)
vercel

# Deploy to production
vercel --prod
```

**Or via GitHub**:
1. Push to GitHub
2. Go to vercel.com
3. Import repository
4. Vercel auto-detects Next.js settings
5. Click Deploy

**Custom Domain**:
```bash
# Add domain in Vercel dashboard, then:
vercel domains add yourdomain.com
```

---

### 2. Netlify

**Steps**:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build first
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

**Or via GitHub**:
1. Push to GitHub
2. Go to netlify.com
3. "New site from Git"
4. Build command: `npm run build`
5. Publish directory: `.next`

---

### 3. Cloudflare Pages

**Steps**:
1. Push to GitHub
2. Go to Cloudflare Pages dashboard
3. Connect repository
4. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output: `.next`

---

### 4. GitHub Pages (Static Export)

**Note**: Requires static export, no server features.

**CRITICAL PRE-FLIGHT**:
1. **Check Remote**: Run `git remote -v`. If it points to `JacbK/persona` (the template), **REMOVE IT**.
2. **Clean API**: Static export fails if `/api` routes exist. Run `rm -rf src/app/api src/app/config`.

**Steps**:

1. **Prepare Repo**:
```bash
# 1. Remove template remote (if exists)
git remote remove origin

# 2. Create NEW repository (replace 'my-portfolio' with your name)
gh repo create my-portfolio --public --source=. --push
```

2. **Configure `next.config.ts`**:
```typescript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // REQUIRED: match your repo name if not a user site
  basePath: '/my-portfolio', 
};
```

3. **Build & Push**:
```bash
# Clean incompatible files
rm -rf src/app/api src/app/config

# Build locally to verify
npm run build

# Push
git add .
git commit -m "chore: prepare for static deployment"
git push -u origin main
```

4. **Enable Pages**:
   - Settings → Pages → Source: GitHub Actions

---

### 5. Self-Hosted (Docker)

**Dockerfile**:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**Run**:
```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

---

## Environment Variables

If using environment variables:

1. **Local**: Create `.env.local`
2. **Vercel**: Add in Project Settings → Environment Variables
3. **Netlify**: Add in Site Settings → Environment
4. **Docker**: Pass with `-e` or use `.env` file

---

## Custom Domain Setup

### General Steps
1. Add domain in hosting provider
2. Update DNS records:
   - A record: Points to hosting IP
   - CNAME: Points to hosting subdomain
3. Wait for DNS propagation (up to 48h, usually minutes)
4. SSL certificate auto-provisions

### Common Providers
- **Vercel**: Automatic SSL, add domain in dashboard
- **Netlify**: Automatic SSL, add domain in dashboard
- **Cloudflare**: Automatic SSL + CDN

---

## Post-Deployment

After deploying:

1. **Test the live site**
   - Check all pages load
   - Test on mobile
   - Verify images load
   - Click all links

2. **Set up analytics** (optional)
   - Vercel Analytics (built-in)
   - Plausible (privacy-focused)
   - Google Analytics

3. **Submit to search engines** (optional)
   - Google Search Console
   - Bing Webmaster Tools

---

## Troubleshooting

### Build Fails
- Check `npm run build` locally first
- Review error messages for missing dependencies
- Ensure all imports are valid

### Images Not Loading
- Move to `/public` folder
- Use absolute paths: `/images/photo.jpg`
- Check case sensitivity (Linux is case-sensitive)

### 404 on Routes
- For static export: ensure `generateStaticParams` for dynamic routes
- Check `next.config.ts` for `trailingSlash` setting

### Slow Performance
- Run Lighthouse audit
- Optimize images (use `next/image`)
- Check for large bundle sizes

---

## CI/CD with GitHub Actions

Pre-configured workflows in `.github/workflows/`:

### Vercel (deploy-vercel.yml)
Auto-deploy on push to main. Setup:
1. Import repo at vercel.com
2. Run `vercel link` locally to get IDs
3. Add GitHub secrets:
   - `VERCEL_TOKEN` (from vercel.com/account/tokens)
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

### GitHub Pages (deploy-pages.yml)
Static export to GitHub Pages. Setup:
1. Enable in repo Settings → Pages → Source: GitHub Actions
2. Ensure `next.config.ts` has `output: 'export'`

---

## MCP Integration

MCP (Model Context Protocol) enables AI-driven deployment. Supported by Claude Code, Codex, and Gemini CLI.

**Setup:** Run `./bin/setup.sh` and select "Yes" when asked about deployment integration.

### Manual Setup by CLI

#### Claude Code
```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN="your-token" -- npx -y @modelcontextprotocol/server-github
claude mcp add vercel -e VERCEL_API_TOKEN="your-token" -- npx -y vercel-mcp-server
```

#### Codex
```bash
codex mcp add github -- npx -y @modelcontextprotocol/server-github
codex mcp add vercel -- npx -y vercel-mcp-server
```
Then set environment variables: `GITHUB_PERSONAL_ACCESS_TOKEN`, `VERCEL_API_TOKEN`

#### Gemini CLI
Add to `~/.gemini/settings.json`:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token" }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "vercel-mcp-server"],
      "env": { "VERCEL_API_TOKEN": "your-token" }
    }
  }
}
```

### Get Tokens

- **GitHub:** https://github.com/settings/tokens (scopes: `repo`, `read:user`)
- **Vercel:** https://vercel.com/account/tokens

### Usage

Once configured, just ask your AI assistant:
- "Deploy my portfolio to Vercel"
- "Create a GitHub repo and deploy to GitHub Pages"

---

## Shell Commands (All CLIs)

Any AI assistant can deploy using standard CLI tools (no MCP required).

### GitHub Pages via `gh` CLI

**First, ensure you have your own repo** (not the template):
```bash
# Check current remote
git remote -v

# If it points to the template repo, remove it and create your own:
git remote remove origin
gh repo create my-portfolio --public --source=. --push
```

**Then enable GitHub Pages**:
```bash
# Enable GitHub Pages with Actions
gh api repos/{owner}/{repo}/pages -X POST -f build_type=workflow
```

Requires:
1. `gh` CLI installed and authenticated (`gh auth login`)
2. Your own GitHub repository (not the template)
3. Static export in `next.config.ts`:
   ```typescript
   output: 'export',
   images: { unoptimized: true }
   ```

### Vercel via CLI

```bash
npm i -g vercel
vercel --prod
```

### Netlify via CLI

```bash
npm i -g netlify-cli
netlify deploy --prod
```
