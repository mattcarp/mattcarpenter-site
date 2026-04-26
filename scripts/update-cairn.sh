#!/usr/bin/env bash
# update-cairn.sh — drop a fresh Claude Design bundle into rl/cairn/
#
# Usage:
#   ./scripts/update-cairn.sh                    # auto-find newest Safety*Hub*.zip in ~/Downloads
#   ./scripts/update-cairn.sh /path/to/zip       # use a specific zip
#   ./scripts/update-cairn.sh --no-push          # apply but don't push (just stage + diff)
#
# What it does:
#   1. Finds and extracts the bundle to a temp dir
#   2. Sanity-checks expected files exist
#   3. Replaces rl/cairn/ contents (preserves og-cover.png)
#   4. Re-applies our customizations: noindex, favicon, OG tags, Pro->Smart, credit line, easter egg
#   5. Shows a git diff and prompts before committing/pushing

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CAIRN_DIR="$REPO/rl/cairn"
DOWNLOADS="$HOME/Downloads"

# --- args ---
PUSH=1
ZIP=""
for arg in "$@"; do
  case "$arg" in
    --no-push) PUSH=0 ;;
    -h|--help)
      sed -n '2,12p' "$0"; exit 0 ;;
    *) ZIP="$arg" ;;
  esac
done

# --- find zip ---
if [ -z "$ZIP" ]; then
  ZIP="$(ls -t "$DOWNLOADS"/Safety*Hub*.zip 2>/dev/null | head -1 || true)"
  if [ -z "$ZIP" ]; then
    echo "❌ No Safety*Hub*.zip in $DOWNLOADS — pass one explicitly."
    exit 1
  fi
  echo "→ Auto-detected: $ZIP"
fi
[ -f "$ZIP" ] || { echo "❌ Not a file: $ZIP"; exit 1; }

# --- extract ---
TMP="$(mktemp -d)"
trap "rm -rf '$TMP'" EXIT
echo "→ Extracting to $TMP"
unzip -q "$ZIP" -d "$TMP"

# Some bundles wrap everything in a top folder, others don't.
if [ -d "$TMP/safety-hub-name-tbd" ]; then
  SRC="$TMP/safety-hub-name-tbd"
elif [ -d "$TMP/safety-hub-name-tbd/project" ]; then
  SRC="$TMP/safety-hub-name-tbd/project"
elif [ -f "$TMP/Cairn-web.html" ]; then
  SRC="$TMP"
else
  # one-level nested?
  SRC="$(find "$TMP" -maxdepth 2 -name 'Cairn-web.html' -print -quit | xargs -I{} dirname {} || true)"
  [ -n "$SRC" ] || { echo "❌ Cairn-web.html not found in zip"; exit 1; }
fi
echo "→ Source dir: $SRC"

# --- sanity check ---
EXPECTED=(
  "Cairn-web.html"
  "web.jsx"
  "parts/cover.jsx"
  "parts/dial.jsx"
  "parts/bom.jsx"
  "parts/sku.jsx"
)
MISSING=0
for f in "${EXPECTED[@]}"; do
  if [ ! -f "$SRC/$f" ]; then
    echo "  ⚠️  missing: $f"
    MISSING=1
  fi
done
[ "$MISSING" = "0" ] || { echo "❌ Bundle is missing expected files. Aborting."; exit 1; }
echo "✓ Bundle has expected files"

# --- preserve OG image ---
OG_BACKUP=""
if [ -f "$CAIRN_DIR/og-cover.png" ]; then
  OG_BACKUP="$(mktemp)"
  cp "$CAIRN_DIR/og-cover.png" "$OG_BACKUP"
  echo "→ Saved og-cover.png aside"
fi

# --- replace contents ---
echo "→ Replacing $CAIRN_DIR"
rm -rf "$CAIRN_DIR"
mkdir -p "$CAIRN_DIR/parts"
cp "$SRC/Cairn-web.html" "$CAIRN_DIR/index.html"
cp "$SRC/web.jsx" "$CAIRN_DIR/web.jsx"
cp "$SRC"/parts/*.jsx "$CAIRN_DIR/parts/"

# Restore OG image
if [ -n "$OG_BACKUP" ]; then
  cp "$OG_BACKUP" "$CAIRN_DIR/og-cover.png"
  rm "$OG_BACKUP"
  echo "→ Restored og-cover.png"
fi

# --- apply our customizations via Python ---
echo "→ Re-applying customizations"
python3 "$REPO/scripts/apply-cairn-edits.py" "$CAIRN_DIR" || {
  echo "❌ Customization step failed. Site is in a half-applied state."
  echo "   Inspect $CAIRN_DIR and either fix manually or git restore."
  exit 1
}

# --- diff & confirm ---
cd "$REPO"
echo ""
echo "→ Changes:"
git add rl/cairn/
git diff --cached --stat rl/cairn/
echo ""

if [ "$PUSH" = "0" ]; then
  echo "✓ Done (--no-push). Review with: git diff --cached rl/cairn/"
  exit 0
fi

read -r -p "Commit and push? [y/N] " ans
case "$ans" in
  y|Y|yes|YES)
    git commit -m "Update Cairn from Claude Design bundle

Auto-applied via scripts/update-cairn.sh
Source zip: $(basename "$ZIP")"
    git push origin main
    echo "✓ Pushed. Pages will rebuild in ~30-90s."
    ;;
  *)
    echo "✓ Staged but not pushed. Review with: git diff --cached"
    ;;
esac
