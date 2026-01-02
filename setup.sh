#!/bin/bash

# Persona: Setup Script
# Streamlined onboarding for AI-powered portfolio generation

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
DIM='\033[2m'
NC='\033[0m'
BOLD='\033[1m'

# Symbols
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
ARROW="${CYAN}→${NC}"

clear

echo -e "${CYAN}"
cat << "EOF"
    ____
   / __ \___  ______________  ____  ____ _
  / /_/ / _ \/ ___/ ___/ __ \/ __ \/ __ `/
 / ____/  __/ /  (__  ) /_/ / / / / /_/ /
/_/    \___/_/  /____/\____/_/ /_/\__,_/

EOF
echo -e "${NC}"

echo -e "${BOLD}Drop-in portfolio kit for AI coding agents${NC}"
echo -e "${DIM}Works with Claude Code, Codex, Gemini CLI, Aider & more${NC}"
echo ""

cd "$PROJECT_DIR"

# ============================================
# Pre-flight checks
# ============================================

echo -e "${BOLD}Checking requirements...${NC}"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | sed 's/v//')
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "  $CHECK Node.js v$NODE_VERSION"
    else
        echo -e "  ${YELLOW}⚠${NC} Node.js v$NODE_VERSION ${DIM}(v18+ recommended)${NC}"
    fi
else
    echo -e "  $CROSS Node.js not found"
    echo ""
    echo -e "  ${YELLOW}Install Node.js first:${NC}"
    echo -e "    https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v 2>/dev/null)
    echo -e "  $CHECK npm v$NPM_VERSION"
else
    echo -e "  $CROSS npm not found"
    exit 1
fi

# Check for AI CLI
CLI_FOUND=""
for cli in claude codex gemini aider; do
    if command -v $cli &> /dev/null; then
        CLI_FOUND="$cli"
        break
    fi
done

if [ -n "$CLI_FOUND" ]; then
    echo -e "  $CHECK AI CLI: $CLI_FOUND"
else
    echo -e "  ${YELLOW}○${NC} No AI CLI detected ${DIM}(will install or configure later)${NC}"
fi

echo ""

# ============================================
# Step 1: Git Setup (ensure user owns the repo)
# ============================================

echo -e "${BOLD}Step 1: Repository Setup${NC}"
echo ""

# Check if git remote points to template repo
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if echo "$REMOTE_URL" | grep -qi "JacbK/persona\|jacobkieser/persona"; then
    echo -e "  ${YELLOW}⚠ Git remote points to the template repo${NC}"
    echo -e "  ${DIM}You need your own repository to deploy${NC}"
    echo ""
    echo -e "  ${BOLD}Options:${NC}"
    echo -e "    1) Create a new GitHub repo for me ${DIM}(requires gh CLI)${NC}"
    echo -e "    2) I'll set up my own repo later"
    echo ""
    read -p "  Select [2]: " repo_choice
    repo_choice=${repo_choice:-2}

    if [ "$repo_choice" = "1" ]; then
        if command -v gh &> /dev/null; then
            echo ""
            read -p "  Repository name [my-portfolio]: " repo_name
            repo_name=${repo_name:-my-portfolio}

            echo -e "  Creating repository..."
            if gh repo create "$repo_name" --public --source=. --remote=origin 2>/dev/null; then
                echo -e "  $CHECK Created github.com/$(gh api user -q .login)/$repo_name"
            else
                # If repo exists or creation failed, try to set remote
                echo -e "  ${YELLOW}Creating repo failed. You may need to create it manually.${NC}"
            fi
        else
            echo -e "  ${YELLOW}GitHub CLI not installed. Install with: brew install gh${NC}"
            echo -e "  ${DIM}You can set up your repo later before deploying${NC}"
        fi
    else
        echo -e "  ${DIM}Remember to create your own repo before deploying${NC}"
        echo -e "  ${DIM}Run: gh repo create my-portfolio --public --source=. --push${NC}"
    fi
    echo ""
else
    echo -e "  $CHECK Git repository configured"
fi

# Delete template README if it exists and still has Persona content
if [ -f "README.md" ] && grep -q "Persona" README.md 2>/dev/null; then
    echo ""
    echo -e "  ${YELLOW}Found template README.md${NC}"
    echo -e "  ${DIM}This README is about Persona, not your portfolio${NC}"
    echo ""
    read -p "  Delete template README? [Y/n]: " delete_readme
    delete_readme=${delete_readme:-Y}
    if [[ "$delete_readme" =~ ^[Yy]$ ]]; then
        rm README.md
        echo -e "  $CHECK Deleted template README"
    else
        echo -e "  ${DIM}Keeping README (you can edit it later)${NC}"
    fi
fi

echo ""

# ============================================
# Step 2: Dependencies
# ============================================

echo -e "${BOLD}Step 2: Dependencies${NC}"
echo ""

if [ ! -d "node_modules" ]; then
    echo -e "  Installing packages..."
    if npm install --silent 2>/dev/null; then
        echo -e "  $CHECK Dependencies installed"
    else
        echo -e "  ${YELLOW}Installing with verbose output...${NC}"
        npm install
    fi
else
    echo -e "  $CHECK Dependencies already installed"
fi

echo ""

# ============================================
# Step 3: Configuration
# ============================================

echo -e "${BOLD}Step 3: Configuration${NC}"
echo ""

if [ -f "profile.yaml" ]; then
    # Profile exists - offer to reconfigure or continue
    echo -e "  $CHECK Found existing profile.yaml"
    echo ""
    echo -e "  ${BOLD}What would you like to do?${NC}"
    echo -e "    1) Continue with existing config → Build portfolio"
    echo -e "    2) Edit config → Open config UI to make changes"
    echo ""
    read -p "  Select [1]: " config_choice
    config_choice=${config_choice:-1}

    if [ "$config_choice" = "2" ]; then
        NEED_CONFIG=true
    else
        NEED_CONFIG=false
        echo ""
        echo -e "  ${DIM}Tip: Run ./setup.sh again anytime to edit your config${NC}"
    fi
else
    # Check for downloaded profile.yaml in common locations
    FOUND_PROFILE=""
    for location in ~/Downloads/profile.yaml ~/profile.yaml; do
        if [ -f "$location" ]; then
            FOUND_PROFILE="$location"
            break
        fi
    done

    if [ -n "$FOUND_PROFILE" ]; then
        echo -e "  ${YELLOW}○${NC} Found profile.yaml at: ${CYAN}$FOUND_PROFILE${NC}"
        echo ""
        echo -e "  ${DIM}Would you like to use this config?${NC}"
        echo -e "    1) Yes, copy it to this project"
        echo -e "    2) No, create a new config"
        echo ""
        read -p "  Select [1]: " use_found
        use_found=${use_found:-1}

        if [ "$use_found" = "1" ]; then
            cp "$FOUND_PROFILE" ./profile.yaml
            echo -e "  $CHECK Copied profile.yaml to project"
            NEED_CONFIG=false
        else
            NEED_CONFIG=true
        fi
    else
        NEED_CONFIG=true
    fi
fi

if [ "$NEED_CONFIG" = true ]; then
    echo ""
    echo -e "  Opening configuration UI..."
    echo ""
    echo -e "  ${CYAN}┌───────────────────────────────────────────────┐${NC}"
    echo -e "  ${CYAN}│${NC}  Your browser will open automatically         ${CYAN}│${NC}"
    echo -e "  ${CYAN}│${NC}  ${DIM}Or visit:${NC} ${BOLD}http://localhost:3000/config${NC}     ${CYAN}│${NC}"
    echo -e "  ${CYAN}│${NC}                                               ${CYAN}│${NC}"
    echo -e "  ${CYAN}│${NC}  1. Fill in your name ${DIM}(required)${NC}            ${CYAN}│${NC}"
    echo -e "  ${CYAN}│${NC}  2. Pick design inspirations ${DIM}(optional)${NC}     ${CYAN}│${NC}"
    echo -e "  ${CYAN}│${NC}  3. Click ${GREEN}Save to Project${NC}                  ${CYAN}│${NC}"
    echo -e "  ${CYAN}│${NC}                                               ${CYAN}│${NC}"
    echo -e "  ${CYAN}│${NC}  ${DIM}The script will continue automatically${NC}     ${CYAN}│${NC}"
    echo -e "  ${CYAN}└───────────────────────────────────────────────┘${NC}"
    echo ""

    # Start dev server in background
    npm run dev &>/dev/null &
    DEV_PID=$!

    # Give server time to start
    sleep 2

    # Open browser
    if command -v open &> /dev/null; then
        open "http://localhost:3000/config"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:3000/config"
    else
        echo -e "  ${ARROW} Open in browser: ${CYAN}http://localhost:3000/config${NC}"
    fi

    # Wait for config save (using sentinel file for reliable detection)
    echo -e "  Waiting for you to save your config..."
    echo -e "  ${DIM}(Press Ctrl+C to cancel)${NC}"
    echo ""

    # Remove any stale sentinel file
    rm -f .config-saved

    WAIT_COUNT=0
    while true; do
        # Check for sentinel file written by save-config API
        if [ -f ".config-saved" ]; then
            rm -f .config-saved  # Clean up sentinel
            echo -e "  $CHECK Config saved!"
            break
        fi

        sleep 1
        WAIT_COUNT=$((WAIT_COUNT + 1))

        # Show periodic reminder
        if [ $((WAIT_COUNT % 30)) -eq 0 ]; then
            echo -e "  ${DIM}Still waiting... Click 'Save to Project' when ready${NC}"
        fi
    done

    # Kill the dev server
    kill $DEV_PID 2>/dev/null
    wait $DEV_PID 2>/dev/null

    echo ""
fi

# Verify profile exists
if [ ! -f "profile.yaml" ]; then
    echo -e "  $CROSS No profile.yaml found"
    echo -e "  Run ${CYAN}./setup.sh${NC} again to configure"
    exit 1
fi

echo ""

# ============================================
# Step 4: AI Tool Setup
# ============================================

echo -e "${BOLD}Step 4: AI Assistant${NC}"
echo ""

# Read CLI preference from profile.yaml or prompt user to select
CLI_TOOL=""
if [ -f "profile.yaml" ]; then
    CLI_FROM_FILE=$(grep "^cli:" profile.yaml | sed 's/cli: *"\([^"]*\)".*/\1/' | tr -d ' ')
    if [ -n "$CLI_FROM_FILE" ]; then
        CLI_TOOL="$CLI_FROM_FILE"
    fi
fi

# If no CLI preference found, prompt user to select
if [ -z "$CLI_TOOL" ]; then
    echo -e "  ${BOLD}Which AI coding assistant will you use?${NC}"
    echo ""
    echo -e "    1) Claude Code ${DIM}(Anthropic)${NC}"
    echo -e "    2) Gemini CLI ${DIM}(Google)${NC}"
    echo -e "    3) Codex ${DIM}(OpenAI)${NC}"
    echo -e "    4) Aider"
    echo -e "    5) Cursor"
    echo -e "    6) Other"
    echo ""

    # Detect installed CLIs to show recommendation
    DETECTED=""
    if command -v claude &> /dev/null; then
        DETECTED="claude-code"
    elif command -v gemini &> /dev/null; then
        DETECTED="gemini"
    elif command -v codex &> /dev/null; then
        DETECTED="codex"
    elif command -v aider &> /dev/null; then
        DETECTED="aider"
    fi

    if [ -n "$DETECTED" ]; then
        echo -e "  ${DIM}Detected: $DETECTED${NC}"
    fi

    read -p "  Select [1]: " cli_choice
    cli_choice=${cli_choice:-1}

    case "$cli_choice" in
        1) CLI_TOOL="claude-code" ;;
        2) CLI_TOOL="gemini" ;;
        3) CLI_TOOL="codex" ;;
        4) CLI_TOOL="aider" ;;
        5) CLI_TOOL="cursor" ;;
        6) CLI_TOOL="other" ;;
        *) CLI_TOOL="claude-code" ;;
    esac

    echo ""
fi

echo -e "  Selected: ${CYAN}$CLI_TOOL${NC}"
echo ""

# Check if CLI is installed
CLI_INSTALLED=false
case "$CLI_TOOL" in
    "claude-code")
        if command -v claude &> /dev/null; then
            CLI_INSTALLED=true
        fi
        ;;
    "codex")
        if command -v codex &> /dev/null; then
            CLI_INSTALLED=true
        fi
        ;;
    "gemini")
        if command -v gemini &> /dev/null; then
            CLI_INSTALLED=true
        fi
        ;;
    "aider")
        if command -v aider &> /dev/null; then
            CLI_INSTALLED=true
        fi
        ;;
    "cursor")
        CLI_INSTALLED=true  # Cursor opens manually
        ;;
    *)
        CLI_INSTALLED=true  # Custom - user handles it
        ;;
esac

if [ "$CLI_INSTALLED" = false ]; then
    echo -e "  ${YELLOW}⚠ $CLI_TOOL is not installed${NC}"
    echo ""
    case "$CLI_TOOL" in
        "claude-code")
            echo -e "  Install with: ${CYAN}npm install -g @anthropic-ai/claude-code${NC}"
            ;;
        "codex")
            echo -e "  Install with: ${CYAN}npm install -g @openai/codex${NC}"
            ;;
        "gemini")
            echo -e "  Install with: ${CYAN}npm install -g @google/gemini-cli${NC}"
            ;;
        "aider")
            echo -e "  Install with: ${CYAN}pip install aider-chat${NC}"
            ;;
    esac
    echo ""
    read -p "  Press Enter after installing, or Ctrl+C to exit..."
    echo ""
fi

# MCP setup for supported CLIs (Claude Code, Codex, Gemini CLI)
setup_mcp() {
    local cli="$1"

    echo ""
    echo -e "  ${DIM}Optional: Enable AI-driven deployment${NC}"
    echo -e "  ${DIM}This lets your AI assistant deploy directly to hosting platforms${NC}"
    echo ""
    echo -e "  ${BOLD}Which deployment integrations do you want?${NC}"
    echo -e "    1) GitHub only"
    echo -e "    2) Vercel only"
    echo -e "    3) Both GitHub and Vercel"
    echo -e "    4) Skip (set up later)"
    echo ""
    read -p "  Select [4]: " deploy_choice
    deploy_choice=${deploy_choice:-4}

    WANT_GITHUB=false
    WANT_VERCEL=false

    case "$deploy_choice" in
        1) WANT_GITHUB=true ;;
        2) WANT_VERCEL=true ;;
        3) WANT_GITHUB=true; WANT_VERCEL=true ;;
        4)
            echo -e "  ${DIM}Skipping deployment integration${NC}"
            return
            ;;
        *)
            echo -e "  ${DIM}Skipping deployment integration${NC}"
            return
            ;;
    esac

    echo ""

    # Get GitHub token if requested
    GITHUB_TOKEN=""
    if [ "$WANT_GITHUB" = true ]; then
        if command -v gh &> /dev/null; then
            GITHUB_TOKEN=$(gh auth token 2>/dev/null || echo "")
            if [ -n "$GITHUB_TOKEN" ]; then
                echo -e "  $CHECK Found GitHub token from gh CLI"
            else
                echo -e "  ${DIM}GitHub CLI found but not authenticated${NC}"
                echo -e "  ${CYAN}Get a token at:${NC} https://github.com/settings/tokens/new"
                echo -e "  ${DIM}Required scopes: repo, read:user${NC}"
                echo ""
                read -p "  GitHub token: " GITHUB_TOKEN
            fi
        else
            echo -e "  ${YELLOW}○${NC} GitHub CLI (gh) not installed"
            echo ""
            echo -e "  ${DIM}The gh CLI makes GitHub integration easier.${NC}"
            echo -e "  ${DIM}Options:${NC}"
            echo -e "    1) Install gh CLI ${DIM}(recommended)${NC}"
            echo -e "    2) Enter a personal access token manually"
            echo -e "    3) Skip GitHub integration"
            echo ""
            read -p "  Select [1]: " gh_choice
            gh_choice=${gh_choice:-1}

            case "$gh_choice" in
                1)
                    echo ""
                    echo -e "  Installing GitHub CLI..."
                    if [[ "$OSTYPE" == "darwin"* ]]; then
                        if command -v brew &> /dev/null; then
                            brew install gh && echo -e "  $CHECK GitHub CLI installed"
                        else
                            echo -e "  ${YELLOW}Homebrew not found. Install gh manually:${NC}"
                            echo -e "    https://cli.github.com/manual/installation"
                        fi
                    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                        if command -v apt-get &> /dev/null; then
                            sudo apt-get update && sudo apt-get install -y gh && echo -e "  $CHECK GitHub CLI installed"
                        elif command -v dnf &> /dev/null; then
                            sudo dnf install -y gh && echo -e "  $CHECK GitHub CLI installed"
                        else
                            echo -e "  ${YELLOW}Install gh manually:${NC} https://cli.github.com/manual/installation"
                        fi
                    else
                        echo -e "  ${YELLOW}Install gh manually:${NC} https://cli.github.com/manual/installation"
                    fi

                    # If gh was installed, authenticate
                    if command -v gh &> /dev/null; then
                        echo ""
                        echo -e "  ${CYAN}Authenticating with GitHub...${NC}"
                        gh auth login
                        GITHUB_TOKEN=$(gh auth token 2>/dev/null || echo "")
                        if [ -n "$GITHUB_TOKEN" ]; then
                            echo -e "  $CHECK GitHub authenticated"
                        fi
                    fi
                    ;;
                2)
                    echo ""
                    echo -e "  ${CYAN}Get a token at:${NC} https://github.com/settings/tokens/new"
                    echo -e "  ${DIM}Required scopes: repo, read:user${NC}"
                    echo ""
                    read -p "  GitHub token: " GITHUB_TOKEN
                    ;;
                3)
                    echo -e "  ${DIM}Skipping GitHub integration${NC}"
                    ;;
            esac
        fi
    fi

    # Get Vercel token if requested
    VERCEL_TOKEN=""
    if [ "$WANT_VERCEL" = true ]; then
        echo ""

        # Check if Vercel CLI is installed
        if command -v vercel &> /dev/null; then
            echo -e "  $CHECK Vercel CLI installed"
        else
            echo -e "  ${YELLOW}○${NC} Vercel CLI not installed"
            echo ""
            echo -e "  ${DIM}The Vercel CLI is optional but useful for manual deploys.${NC}"
            echo -e "  ${DIM}Options:${NC}"
            echo -e "    1) Install Vercel CLI"
            echo -e "    2) Continue without CLI ${DIM}(AI can still deploy via API)${NC}"
            echo ""
            read -p "  Select [2]: " vercel_cli_choice
            vercel_cli_choice=${vercel_cli_choice:-2}

            if [ "$vercel_cli_choice" = "1" ]; then
                echo ""
                echo -e "  Installing Vercel CLI..."
                if npm install -g vercel 2>/dev/null; then
                    echo -e "  $CHECK Vercel CLI installed"
                else
                    echo -e "  ${YELLOW}Failed to install. Try: npm install -g vercel${NC}"
                fi
            fi
        fi

        echo ""
        echo -e "  ${CYAN}Get a Vercel token at:${NC} https://vercel.com/account/tokens"
        echo ""
        read -p "  Vercel token: " VERCEL_TOKEN
    fi

    # Configure based on CLI
    case "$cli" in
        "claude-code")
            if [ -n "$GITHUB_TOKEN" ]; then
                if claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_TOKEN" -- npx -y @modelcontextprotocol/server-github 2>/dev/null; then
                    echo -e "  $CHECK GitHub MCP configured"
                fi
            fi
            if [ -n "$VERCEL_TOKEN" ]; then
                if claude mcp add vercel -e VERCEL_API_TOKEN="$VERCEL_TOKEN" -- npx -y vercel-mcp-server 2>/dev/null; then
                    echo -e "  $CHECK Vercel MCP configured"
                fi
            fi
            ;;
        "codex")
            if [ -n "$GITHUB_TOKEN" ]; then
                if codex mcp add github -- npx -y @modelcontextprotocol/server-github 2>/dev/null; then
                    # Set env var in config
                    echo -e "  $CHECK GitHub MCP configured"
                    echo -e "  ${DIM}Note: Set GITHUB_PERSONAL_ACCESS_TOKEN in your shell${NC}"
                fi
            fi
            if [ -n "$VERCEL_TOKEN" ]; then
                if codex mcp add vercel -- npx -y vercel-mcp-server 2>/dev/null; then
                    echo -e "  $CHECK Vercel MCP configured"
                    echo -e "  ${DIM}Note: Set VERCEL_API_TOKEN in your shell${NC}"
                fi
            fi
            ;;
        "gemini")
            # Gemini uses ~/.gemini/settings.json
            GEMINI_SETTINGS="$HOME/.gemini/settings.json"
            mkdir -p "$HOME/.gemini"

            # Build MCP config
            MCP_CONFIG="{\"mcpServers\":{"
            SERVERS=""

            if [ -n "$GITHUB_TOKEN" ]; then
                SERVERS="\"github\":{\"command\":\"npx\",\"args\":[\"-y\",\"@modelcontextprotocol/server-github\"],\"env\":{\"GITHUB_PERSONAL_ACCESS_TOKEN\":\"$GITHUB_TOKEN\"}}"
            fi

            if [ -n "$VERCEL_TOKEN" ]; then
                if [ -n "$SERVERS" ]; then
                    SERVERS="$SERVERS,"
                fi
                SERVERS="$SERVERS\"vercel\":{\"command\":\"npx\",\"args\":[\"-y\",\"vercel-mcp-server\"],\"env\":{\"VERCEL_API_TOKEN\":\"$VERCEL_TOKEN\"}}"
            fi

            if [ -n "$SERVERS" ]; then
                MCP_CONFIG="$MCP_CONFIG$SERVERS}}"

                if [ -f "$GEMINI_SETTINGS" ]; then
                    # Merge with existing settings if jq available
                    if command -v jq &> /dev/null; then
                        jq -s '.[0] * .[1]' "$GEMINI_SETTINGS" <(echo "$MCP_CONFIG") > "${GEMINI_SETTINGS}.tmp" && mv "${GEMINI_SETTINGS}.tmp" "$GEMINI_SETTINGS"
                    else
                        echo "$MCP_CONFIG" > "$GEMINI_SETTINGS"
                    fi
                else
                    echo "$MCP_CONFIG" > "$GEMINI_SETTINGS"
                fi
                echo -e "  $CHECK MCP servers configured in ~/.gemini/settings.json"
            fi
            ;;
    esac
}

# CLI-specific setup
case "$CLI_TOOL" in
    "claude-code")
        # Auto-configure Claude settings (inline)
        if [ ! -f "$HOME/.claude/settings.json" ] || ! grep -q "autoApproveTools" "$HOME/.claude/settings.json" 2>/dev/null; then
            echo -e "  Configuring auto-approval..."
            mkdir -p "$HOME/.claude"
            SETTINGS_FILE="$HOME/.claude/settings.json"
            if [ -f "$SETTINGS_FILE" ]; then
                if command -v jq &> /dev/null; then
                    jq '. + {"autoApproveTools": ["web_fetch", "web_search"]}' "$SETTINGS_FILE" > "${SETTINGS_FILE}.tmp" && mv "${SETTINGS_FILE}.tmp" "$SETTINGS_FILE"
                fi
            else
                echo '{"autoApproveTools": ["web_fetch", "web_search"]}' > "$SETTINGS_FILE"
            fi
            echo -e "  $CHECK Web search and fetch enabled"
        fi

        # Check for existing MCP servers
        EXISTING_MCPS=$(claude mcp list 2>/dev/null || echo "")
        if echo "$EXISTING_MCPS" | grep -qi "vercel" && echo "$EXISTING_MCPS" | grep -qi "github"; then
            echo -e "  $CHECK MCP servers configured (GitHub + Vercel)"
        else
            setup_mcp "claude-code"
        fi
        echo ""
        ;;
    "codex")
        # Check for existing MCP servers
        EXISTING_MCPS=$(codex mcp list 2>/dev/null || echo "")
        if echo "$EXISTING_MCPS" | grep -qi "vercel" && echo "$EXISTING_MCPS" | grep -qi "github"; then
            echo -e "  $CHECK MCP servers configured (GitHub + Vercel)"
        else
            setup_mcp "codex"
        fi
        echo ""
        ;;
    "gemini")
        # Check for existing MCP config
        if [ -f "$HOME/.gemini/settings.json" ] && grep -q "mcpServers" "$HOME/.gemini/settings.json" 2>/dev/null; then
            echo -e "  $CHECK MCP servers configured"
        else
            setup_mcp "gemini"
        fi
        echo ""
        ;;
    "aider")
        # Aider doesn't have native MCP client support
        # It's a coding assistant, not an agent with tool use
        echo -e "  ${DIM}Aider uses shell commands for deployment (no MCP needed)${NC}"
        echo ""
        ;;
esac

# ============================================
# Step 5: Launch
# ============================================

echo -e "${BOLD}Ready to Build!${NC}"
echo ""
echo -e "  ${GREEN}The AI will:${NC}"
echo -e "    $ARROW Research you online (GitHub, web)"
echo -e "    $ARROW Create a unique design based on your preferences"
echo -e "    $ARROW Build your portfolio from scratch"
echo -e "    $ARROW Iterate until it meets quality standards"
echo ""

# Launch the appropriate CLI
cd "$PROJECT_DIR"

case "$CLI_TOOL" in
    "claude-code")
        echo -e "${CYAN}Starting Claude Code...${NC}"
        echo ""
        echo -e "  ${DIM}When Claude starts, say:${NC}"
        echo -e "  ${GREEN}\"Read .agent/instructions.md and build my portfolio\"${NC}"
        echo ""
        read -p "Press Enter to launch Claude..."
        exec claude
        ;;

    "codex")
        echo -e "${CYAN}Starting Codex...${NC}"
        echo ""
        echo -e "  ${DIM}When Codex starts, say:${NC}"
        echo -e "  ${GREEN}\"Read .agent/instructions.md and build my portfolio\"${NC}"
        echo ""
        read -p "Press Enter to launch Codex..."
        exec codex
        ;;

    "gemini")
        echo -e "${CYAN}Starting Google Gemini CLI...${NC}"
        echo ""
        echo -e "  ${DIM}When Gemini starts, say:${NC}"
        echo -e "  ${GREEN}\"Read .agent/instructions.md and build my portfolio\"${NC}"
        echo ""
        read -p "Press Enter to launch Gemini..."
        exec gemini
        ;;

    "aider")
        echo -e "${CYAN}Starting Aider...${NC}"
        echo ""
        read -p "Press Enter to launch Aider..."
        exec aider --read .agent/instructions.md
        ;;

    "cursor")
        echo -e "${CYAN}Opening Cursor AI...${NC}"
        echo ""
        echo -e "  ${DIM}Cursor requires manual interaction:${NC}"
        echo -e "    1. Open this project in Cursor"
        echo -e "    2. Read ${CYAN}.agent/instructions.md${NC}"
        echo -e "    3. Say: ${GREEN}'Build my portfolio following these instructions'${NC}"
        echo ""
        if command -v cursor &> /dev/null; then
            cursor "$PROJECT_DIR"
        else
            echo -e "  ${YELLOW}Cursor not in PATH. Open the project manually.${NC}"
        fi
        ;;

    "other"|*)
        echo -e "${YELLOW}Custom CLI selected${NC}"
        echo ""
        echo -e "  ${DIM}To use your AI tool:${NC}"
        echo -e "    1. Launch your preferred AI coding assistant"
        echo -e "    2. Open this project: ${CYAN}$PROJECT_DIR${NC}"
        echo -e "    3. Say: ${GREEN}'Read .agent/instructions.md and build my portfolio'${NC}"
        echo ""
        ;;
esac
