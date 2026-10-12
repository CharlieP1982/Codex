#!/usr/bin/env bash
set -euo pipefail
umask 077

if [ "$(uname -s)" != "Darwin" ]; then
  echo "This installer runs on your Mac, not in the cloud workspace."
  exit 1
fi
mac_version="$(sw_vers -productVersion)"
if [ "${mac_version%%.*}" -lt 13 ]; then
  echo "The menu-bar app needs macOS 13 (Ventura) or later. The web app still works on older Macs."
  exit 1
fi
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "Install Node.js LTS from https://nodejs.org, reopen Terminal, and try again."
  exit 1
fi
if ! xcrun --find swiftc >/dev/null 2>&1; then
  echo "One-time Apple build tools setup is needed. Run: xcode-select --install"
  echo "Finish that installation, then run npm run mac:install again."
  exit 1
fi
if pgrep -x LeadershipOS >/dev/null; then
  echo "Quit LeadershipOS from its menu-bar menu before reinstalling. Your data will be kept."
  exit 1
fi
source_database="${1:-}"
if [ -n "$source_database" ] && [ ! -f "$source_database" ]; then
  echo "The database to import was not found: $source_database"
  exit 1
fi
project_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_root"
node_path="$(command -v node)"
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) { console.error("Install Node.js LTS version 22 or later."); process.exit(1); }'
if [ ! -d node_modules ]; then npm ci; fi
if [ ! -f .env ]; then cp .env.example .env; fi
npm run db:setup
npm run build

staging="$(mktemp -d "${TMPDIR:-/tmp}/leadershipos-build.XXXXXX")"
trap 'rm -rf "$staging"' EXIT
bundle="$staging/LeadershipOS.app"
mkdir -p "$bundle/Contents/MacOS" "$bundle/Contents/Resources"
cp macos/Info.plist "$bundle/Contents/Info.plist"
xcrun swiftc -parse-as-library -swift-version 5 -O -target "$(uname -m)-apple-macosx13.0" \
  -framework AppKit -framework ServiceManagement \
  macos/LeadershipOS.swift -o "$bundle/Contents/MacOS/LeadershipOS"
printf '%s\n' "$node_path" > "$bundle/Contents/Resources/node-path.txt"
node scripts/package-mac-web.mjs "$bundle/Contents/Resources/web"
codesign --force --sign - "$bundle"
codesign --verify --strict "$bundle"

support="$HOME/Library/Application Support/LeadershipOS"
if [ -n "$source_database" ]; then
  DATABASE_URL="file:$source_database" node scripts/mac-data.mjs "$support/leadership.db"
else
  node scripts/mac-data.mjs "$support/leadership.db"
fi
mkdir -p "$HOME/Applications"
target="$HOME/Applications/LeadershipOS.app"
if [ -e "$target" ]; then
  backup="$HOME/Applications/LeadershipOS.app.backup-$(date +%Y%m%d-%H%M%S)"
  if [ -e "$backup" ]; then echo "A backup with this timestamp already exists. Try again in a moment."; exit 1; fi
  mv "$target" "$backup"
  if ! mv "$bundle" "$target"; then mv "$backup" "$target"; exit 1; fi
else
  mv "$bundle" "$target"
fi
open "$target"
echo "Installed LeadershipOS in your Applications folder."
echo "Look for the target icon beside the clock. Choose Open at login to start it automatically."
echo "Keep Node.js installed. You no longer need a running Terminal window."
