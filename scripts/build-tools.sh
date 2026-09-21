#!/usr/bin/env bash
#
# build-tools.sh — generate data/tools.generated.json from the Kali metapackages.
#
# Run this ON A KALI OR DEBIAN SYSTEM that has the kali-tools-* metapackages
# available to apt. It reads the package name and description straight from
# `apt-cache show` for every package the metapackages pull in, and writes a
# generated tool list the app merges with the hand-written seed (seed wins).
#
# It does NOT install anything and does NOT need root — it only queries apt's
# metadata cache. Usage:
#
#   ./scripts/build-tools.sh
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_FILE="${ROOT_DIR}/data/tools.generated.json"

# The metapackages we harvest. Each maps to one of the app's categories.
declare -A META_TO_CATEGORY=(
  [kali-tools-information-gathering]="Information Gathering"
  [kali-tools-vulnerability]="Vulnerability Analysis"
  [kali-tools-web]="Web Apps"
  [kali-tools-passwords]="Password Attacks"
  [kali-tools-wireless]="Wireless"
  [kali-tools-exploitation]="Exploitation"
  [kali-tools-sniffing-spoofing]="Sniffing & Spoofing"
  [kali-tools-post-exploitation]="Post Exploitation"
  [kali-tools-forensics]="Forensics"
  [kali-tools-reporting]="Reporting"
)

if ! command -v apt-cache >/dev/null 2>&1; then
  echo "apt-cache not found. Run this on a Kali or Debian system." >&2
  exit 1
fi

# slugify: lowercase, drop a leading version-ish prefix, keep [a-z0-9-].
slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

# JSON-escape a string for safe embedding.
json_escape() {
  python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().rstrip("\n")))'
}

tmp="$(mktemp)"
echo "[" > "$tmp"
first=1

for meta in "${!META_TO_CATEGORY[@]}"; do
  category="${META_TO_CATEGORY[$meta]}"

  # List the packages this metapackage depends on. Skip quietly if it is not
  # available on this system.
  deps="$(apt-cache depends "$meta" 2>/dev/null | awk '/Depends:/ {print $2}' || true)"
  [ -z "$deps" ] && { echo "  (skip $meta — not available)" >&2; continue; }

  echo "  harvesting $meta -> $category" >&2

  while IFS= read -r pkg; do
    [ -z "$pkg" ] && continue

    name="$pkg"
    # First non-empty Description line from apt-cache show.
    desc="$(apt-cache show "$pkg" 2>/dev/null \
      | awk '/^Description(-[a-z]+)?:/ {sub(/^Description(-[a-z]+)?: /,""); print; exit}')"
    [ -z "$desc" ] && desc="Kali package ${pkg}."

    slug="$(slugify "$pkg")"
    [ -z "$slug" ] && continue

    short_json="$(printf '%s' "$desc" | cut -c1-160 | json_escape)"
    long_json="$(printf '%s' "$desc" | json_escape)"
    name_json="$(printf '%s' "$name" | json_escape)"
    slug_json="$(printf '%s' "$slug" | json_escape)"
    apt_json="$(printf '%s' "$pkg" | json_escape)"
    cat_json="$(printf '%s' "$category" | json_escape)"

    [ $first -eq 0 ] && echo "," >> "$tmp"
    first=0

    cat >> "$tmp" <<ENTRY
  {
    "slug": ${slug_json},
    "name": ${name_json},
    "category": ${cat_json},
    "short": ${short_json},
    "long": ${long_json},
    "apt": ${apt_json},
    "tags": [],
    "commands": []
  }
ENTRY
  done <<< "$deps"
done

echo "" >> "$tmp"
echo "]" >> "$tmp"

# Validate before overwriting the real file.
if python3 -c "import json,sys; json.load(open('$tmp'))" 2>/dev/null; then
  mv "$tmp" "$OUT_FILE"
  count="$(python3 -c "import json; print(len(json.load(open('$OUT_FILE'))))")"
  echo "Wrote $count tools to $OUT_FILE" >&2
else
  echo "Generated JSON failed to validate; leaving previous file untouched." >&2
  rm -f "$tmp"
  exit 1
fi
