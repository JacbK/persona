#!/usr/bin/env bash

set -uo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIN_NODE_MAJOR=20
MIN_NODE_MINOR=18

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
DIM='\033[2m'
NC='\033[0m'
BOLD='\033[1m'
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"

cd "$PROJECT_DIR"

print_banner() {
  if [ -t 1 ]; then clear; fi
  printf "%b\n" "${CYAN}"
  printf '%s\n' '    ____'
  printf '%s\n' '   / __ \___  ______________  ____  ____ _'
  printf '%s\n' '  / /_/ / _ \/ ___/ ___/ __ \/ __ \/ __ `/'
  printf '%s\n' ' / ____/  __/ /  (__  ) /_/ / / / / /_/ /'
  printf '%s\n' '/_/    \___/_/  /____/\____/_/ /_/\__,_/'
  printf "%b\n\n" "${NC}"
  printf "%b\n" "${BOLD}A starter kit for a portfolio that feels like you${NC}"
  printf "%b\n\n" "${DIM}Configure locally, then build with your preferred coding agent.${NC}"
}

check_requirements() {
  printf "%b\n\n" "${BOLD}Checking requirements...${NC}"

  if ! command -v node >/dev/null 2>&1; then
    printf "  %b Node.js is not installed\n" "$CROSS"
    printf "  Install Node.js %s.%s or newer: https://nodejs.org/\n" "$MIN_NODE_MAJOR" "$MIN_NODE_MINOR"
    return 1
  fi

  local node_version node_major node_minor
  node_version="$(node --version | sed 's/^v//')"
  node_major="${node_version%%.*}"
  node_minor="$(printf '%s' "$node_version" | cut -d. -f2)"
  if [ "$node_major" -lt "$MIN_NODE_MAJOR" ] || {
    [ "$node_major" -eq "$MIN_NODE_MAJOR" ] && [ "$node_minor" -lt "$MIN_NODE_MINOR" ];
  }; then
    printf "  %b Node.js v%s is too old\n" "$CROSS" "$node_version"
    printf "  Persona needs Node.js %s.%s or newer.\n" "$MIN_NODE_MAJOR" "$MIN_NODE_MINOR"
    return 1
  fi
  printf "  %b Node.js v%s\n" "$CHECK" "$node_version"

  if ! command -v npm >/dev/null 2>&1; then
    printf "  %b npm is not installed\n" "$CROSS"
    return 1
  fi
  printf "  %b npm v%s\n" "$CHECK" "$(npm --version)"
}

if [ "${1:-}" = "--check" ]; then
  check_requirements
  printf "%b\n" "${CHECK} Setup preflight passed"
  exit 0
fi

print_banner
check_requirements || exit 1

printf "\n%b\n\n" "${BOLD}Step 1: Your repository${NC}"
REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"
if printf '%s' "$REMOTE_URL" | grep -Eqi 'github\.com[:/]((JacbK)|(jacobkieser))/persona(\.git)?$'; then
  printf "  %b This copy still points to the Persona template.\n\n" "$YELLOW"
  printf '%s\n' '  1) Create my portfolio repository with GitHub CLI'
  printf '%s\n' '  2) Keep this remote for now'
  read -r -p '  Select [2]: ' repo_choice
  repo_choice="${repo_choice:-2}"

  if [ "$repo_choice" = "1" ]; then
    if ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
      printf "  %b GitHub CLI must be installed and signed in first: https://cli.github.com/\n" "$YELLOW"
      exit 1
    fi

    read -r -p '  Repository name [my-portfolio]: ' repo_name
    repo_name="${repo_name:-my-portfolio}"
    github_owner="$(gh api user --jq .login)"
    if ! gh repo create "$github_owner/$repo_name" --public; then
      printf "  %b Could not create the repository. Nothing was changed locally.\n" "$CROSS"
      exit 1
    fi

    git remote rename origin persona-template
    git remote add origin "https://github.com/$github_owner/$repo_name.git"
    git push -u origin HEAD:main
    printf "  %b Created github.com/%s/%s\n" "$CHECK" "$github_owner" "$repo_name"
  else
    printf "  %b Before publishing, rename the template remote and add your own origin.\n" "$DIM"
  fi
else
  printf "  %b Repository is ready\n" "$CHECK"
fi

printf "\n%b\n\n" "${BOLD}Step 2: Dependencies${NC}"
if [ ! -d node_modules ] || ! npm ls --depth=0 >/dev/null 2>&1; then
  npm install || exit 1
fi
printf "  %b Dependencies are ready\n" "$CHECK"

NEED_CONFIG=true
if [ -f profile.yaml ]; then
  printf "\n%b\n" "${CHECK} Found profile.yaml"
  read -r -p '  Keep it? [Y/n]: ' keep_config
  case "${keep_config:-y}" in
    n|N) NEED_CONFIG=true ;;
    *) NEED_CONFIG=false ;;
  esac
fi

DEV_PID=""
cleanup_server() {
  if [ -n "$DEV_PID" ]; then
    kill "$DEV_PID" >/dev/null 2>&1 || true
    wait "$DEV_PID" >/dev/null 2>&1 || true
  fi
}

if [ "$NEED_CONFIG" = true ]; then
  printf "\n%b\n" "${BOLD}Step 3: Tell Persona about you${NC}"
  rm -f .config-saved
  npm run dev >/dev/null 2>&1 &
  DEV_PID=$!
  trap cleanup_server EXIT INT TERM

  ready=false
  for _ in $(seq 1 30); do
    if node -e "fetch('http://127.0.0.1:3000/config').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"; then
      ready=true
      break
    fi
    sleep 1
  done
  if [ "$ready" != true ]; then
    printf "  %b The local setup page did not start. Run npm run dev to see the error.\n" "$CROSS"
    exit 1
  fi

  printf "  Open %bhttp://127.0.0.1:3000/config%b\n" "$CYAN" "$NC"
  if command -v open >/dev/null 2>&1; then
    open http://127.0.0.1:3000/config
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open http://127.0.0.1:3000/config
  fi

  printf "  Waiting for you to save profile.yaml...\n"
  while [ ! -f .config-saved ]; do sleep 1; done
  rm -f .config-saved
  cleanup_server
  DEV_PID=""
  trap - EXIT INT TERM
  printf "  %b Profile saved\n" "$CHECK"
fi

if [ ! -f profile.yaml ]; then
  printf "  %b profile.yaml was not created. Run ./setup.sh again.\n" "$CROSS"
  exit 1
fi

printf "\n%b\n\n" "${BOLD}Step 4: Choose your coding agent${NC}"
printf '%s\n' '  1) Claude Code'
printf '%s\n' '  2) Gemini CLI'
printf '%s\n' '  3) Codex'
printf '%s\n' '  4) Cursor'
printf '%s\n' '  5) Windsurf'
printf '%s\n' '  6) Antigravity'
printf '%s\n' '  7) Other'
read -r -p '  Select: ' cli_choice

case "$cli_choice" in
  1) cli_name='Claude Code'; cli_command='claude'; instruction_file='CLAUDE.md' ;;
  2) cli_name='Gemini CLI'; cli_command='gemini'; instruction_file='GEMINI.md' ;;
  3) cli_name='Codex'; cli_command='codex'; instruction_file='AGENTS.md' ;;
  4) cli_name='Cursor'; cli_command='cursor'; instruction_file='.cursorrules' ;;
  5) cli_name='Windsurf'; cli_command='windsurf'; instruction_file='.agent/persona/SKILL.md' ;;
  6) cli_name='Antigravity'; cli_command='antigravity'; instruction_file='.antigravity/rules.md' ;;
  7) cli_name='your coding agent'; cli_command=''; instruction_file='.agent/persona/SKILL.md' ;;
  *) printf "  %b Choose a number from 1 to 7.\n" "$CROSS"; exit 1 ;;
esac

printf "\n  %b Persona does not change global settings or collect access tokens.\n" "$CHECK"
printf "  %b Instructions: %s\n" "$CHECK" "$instruction_file"
printf "  Ask %s to: %bBuild my portfolio%b\n" "$cli_name" "$GREEN" "$NC"

if [ -z "$cli_command" ]; then
  exit 0
fi

if ! command -v "$cli_command" >/dev/null 2>&1; then
  printf "\n  %b %s is not installed or is not available in PATH.\n" "$YELLOW" "$cli_name"
  printf "  Install it from its official site, then run ./setup.sh again.\n"
  exit 1
fi

read -r -p "  Press Enter to open $cli_name..."
if [ "$cli_command" = 'cursor' ] || [ "$cli_command" = 'windsurf' ] || [ "$cli_command" = 'antigravity' ]; then
  "$cli_command" "$PROJECT_DIR"
else
  exec "$cli_command"
fi
