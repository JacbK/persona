---
name: research
description: Gather information about users from materials, profile config, GitHub, and web search to inform portfolio content and design decisions.
---

# Skill: Research

Gather information about the user to inform portfolio content and design.

---

## Sources (in priority order)

### 1. Materials Folder
Check `/materials` first:
- `materials/documents/` - Resume, cover letter, bio text
- `materials/images/` - Headshot, project screenshots

### 2. Profile Config
Read `profile.yaml` for:
- Name, contact info, social links
- Design preferences (sliders, archetype, inspirations)
- Content preferences (tone, focus, length)
- Personal notes (most valuable - user's own words)

### 3. GitHub
If username provided or discoverable:
- Pinned repositories
- README files for major projects
- Languages and contribution patterns
- Stars, forks (real metrics)

### 4. Web Search
Search for:
- "[name] software engineer [location]"
- "[name] github"
- "[name] projects"
- Company mentions, blog posts, talks

### 5. LinkedIn
**Warning**: Often blocked (error 999). If blocked:
- Skip entirely, don't retry
- Use web search for "[name] linkedin [company]" instead
- Check company About pages, press releases

---

## Research Depth

Based on `ai.research_depth` in profile.yaml:

| Level | Approach |
|-------|----------|
| 1-3 | GitHub only, 1-2 search queries |
| 4-6 | GitHub + web search + personal site (5-10 queries) |
| 7-8 | Deep search, find hidden gems (15-20 queries) |
| 9-10 | Exhaustive, find everything published (30+ queries) |

---

## What to Extract

### Factual (verify these)
- Current/past roles and companies
- Project names and tech stacks
- Education
- Public metrics (GitHub stars, npm downloads)

### Contextual (ask if unclear)
- Impact and outcomes of work
- Specific responsibilities
- Scale (users, transactions, team size)
- Why they made certain choices

---

## Asking Clarifying Questions

Use the `AskUserQuestion` tool for:

**Experience gaps**:
- "What did you work on at [Company]?"
- "What was the impact of [Project]?"

**Project details**:
- "What problem were you solving with [Project]?"
- "How many people use it?"

**Direction**:
- "What kind of role are you targeting?"
- "What do you want to emphasize?"

### Question Guidelines
- Ask 3-5 questions at a time in logical groups
- Be specific, not generic ("What did you do at Uber?" not "Tell me about yourself")
- Don't ask about things clearly documented (dates, public GitHub stats)

---

## Output

After research, you should know:
- Who this person is and what they do
- 3-5 key projects or achievements to highlight
- Their career trajectory and goals
- Their voice/tone from notes or writing samples
- What makes them unique (the hook)

**If you can't answer these, ask more questions before proceeding.**
