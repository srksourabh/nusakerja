#!/usr/bin/env bash
# =============================================================================
# saas-foundation — One-command installer
# =============================================================================
# Installs the saas-foundation skill into Claude Code, OpenClaw, Cursor, VS Code
# AI extensions, and other AI-agent tooling that supports Claude skills.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/srksourabh/saas-foundation/main/skills.sh | bash
#   # or clone and run locally:
#   bash skills.sh
#
# What it does:
#   1. Detects which AI tools are installed on your machine
#   2. Installs the skill into each tool's skills directory
#   3. Verifies the installation
# =============================================================================

set -euo pipefail

REPO="srksourabh/saas-foundation"
BRANCH="main"
SKILL_NAME="saas-foundation"
TEMP_DIR=$(mktemp -d)
INSTALLED=()
SKIPPED=()

# -----------------------------------------------------------------------------
# Utilities
# -----------------------------------------------------------------------------
info()  { printf "\033[1;34m[saas-foundation]\033[0m %s\n" "$1"; }
ok()    { printf "\033[1;32m  ✓\033[0m %s\n" "$1"; }
skip()  { printf "\033[1;33m  - %s\033[0m %s\n" "$1" "${2:-}"; }

cleanup() { rm -rf "$TEMP_DIR"; }
trap cleanup EXIT

# -----------------------------------------------------------------------------
# Download the skill
# -----------------------------------------------------------------------------
info "Downloading saas-foundation..."
REPO_URL="https://github.com/$REPO"
ARCHIVE_URL="$REPO_URL/archive/refs/heads/$BRANCH.zip"

if command -v curl &>/dev/null; then
  curl -fsSL "$ARCHIVE_URL" -o "$TEMP_DIR/skill.zip"
elif command -v wget &>/dev/null; then
  wget -q "$ARCHIVE_URL" -O "$TEMP_DIR/skill.zip"
else
  echo "Error: need curl or wget to download"
  exit 1
fi

# Extract the archive
if command -v unzip &>/dev/null; then
  unzip -q "$TEMP_DIR/skill.zip" -d "$TEMP_DIR"
else
  echo "Error: need unzip to extract"
  exit 1
fi

SKILL_SOURCE="$TEMP_DIR/saas-foundation-$BRANCH"

# -----------------------------------------------------------------------------
# Install function
# -----------------------------------------------------------------------------
install_skill() {
  local target_dir="$1"
  local tool_name="$2"

  if [ ! -d "$target_dir" ]; then
    skip "$tool_name" "(directory not found: $target_dir)"
    return
  fi

  # Remove previous install if it exists
  if [ -d "$target_dir/$SKILL_NAME" ]; then
    rm -rf "$target_dir/$SKILL_NAME"
  fi

  cp -r "$SKILL_SOURCE" "$target_dir/$SKILL_NAME"
  ok "$tool_name → $target_dir/$SKILL_NAME"
  INSTALLED+=("$tool_name")
}

# -----------------------------------------------------------------------------
# Detect and install
# -----------------------------------------------------------------------------
echo ""
info "Detecting installed AI tools..."

# Claude Code (primary target)
install_skill "$HOME/.claude/skills" "Claude Code"

# OpenClaw (via mounted volume or config directory)
install_skill "$HOME/.openclaw/skills" "OpenClaw"

# Cursor (uses .claude directory structure)
install_skill "$HOME/.cursor/claude/skills" "Cursor"

# Windsurf
install_skill "$HOME/.windsurf/claude/skills" "Windsurf"

# VS Code Claude extension
install_skill "$HOME/.vscode/claude/skills" "VS Code Claude"

# VS Code Insiders
install_skill "$HOME/.vscode-insiders/claude/skills" "VS Code Insiders Claude"

# Generic .claude/skills fallback (cover all agents)
for agent_dir in "$HOME/.claude-skills" "$HOME/.config/claude/skills" "$HOME/Library/Application Support/Claude/skills"; do
  install_skill "$agent_dir" "Claude ($agent_dir)"
done

# -----------------------------------------------------------------------------
# Register in OpenClaw .env if OPENCLAW_SKILLS_DIR is not set
# -----------------------------------------------------------------------------
if [ -f "$HOME/.openclaw/.env" ]; then
  if ! grep -q "OPENCLAW_SKILLS_DIR" "$HOME/.openclaw/.env" 2>/dev/null; then
    echo "OPENCLAW_SKILLS_DIR=$HOME/.openclaw/skills" >> "$HOME/.openclaw/.env"
    ok "OpenClaw .env updated with OPENCLAW_SKILLS_DIR"
  fi
fi

# -----------------------------------------------------------------------------
# Verify
# -----------------------------------------------------------------------------
echo ""
info "Verification:"

SKILL_FILE="$HOME/.claude/skills/$SKILL_NAME/SKILL.md"
if [ -f "$SKILL_FILE" ]; then
  LINES=$(wc -l < "$SKILL_FILE")
  ok "SKILL.md found ($LINES lines)"
else
  skip "SKILL.md not found at $SKILL_FILE"
fi

# Count total files installed
TOTAL_FILES=$(find "$HOME/.claude/skills/$SKILL_NAME" -type f 2>/dev/null | wc -l)
if [ "$TOTAL_FILES" -gt 0 ]; then
  ok "$TOTAL_FILES files installed"
fi

echo ""
info "Installation complete."

if [ ${#INSTALLED[@]} -eq 0 ]; then
  echo ""
  echo "  No AI tool directories were detected. You can install manually:"
  echo ""
  echo "    git clone $REPO_URL ~/.claude/skills/$SKILL_NAME"
  echo ""
  echo "  Or copy the 'saas-foundation' folder into your agent's skills directory."
  echo ""
else
  echo "  Installed into: ${INSTALLED[*]}"
  echo ""
  echo "  Next step: Open your AI tool and say: \"create a new project using saas-foundation\""
  echo ""
fi
