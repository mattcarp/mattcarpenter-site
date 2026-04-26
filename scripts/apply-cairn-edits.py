#!/usr/bin/env python3
"""
apply-cairn-edits.py — re-apply our manual customizations to a fresh
Claude Design bundle in rl/cairn/.

Each customization is its own function. If upstream changes the surrounding
text, the corresponding function fails loudly with a clear message — fix
the patcher, not the site.

Usage: ./apply-cairn-edits.py /path/to/rl/cairn
"""

import sys
from pathlib import Path

# ── helpers ──────────────────────────────────────────────────────────

class PatchError(Exception):
    pass

def patch(path: Path, old: str, new: str, label: str):
    """Single replacement; old must appear exactly once."""
    s = path.read_text()
    n = s.count(old)
    if n == 0:
        raise PatchError(f"[{label}] anchor not found in {path.name}")
    if n > 1:
        raise PatchError(f"[{label}] anchor matches {n} times in {path.name} — needs more context")
    path.write_text(s.replace(old, new))
    print(f"  ✓ {label}")

def insert_after(path: Path, anchor: str, addition: str, label: str, *, skip_if_present: str | None = None):
    """Insert `addition` immediately after `anchor`. If `skip_if_present` already in file, no-op."""
    s = path.read_text()
    if skip_if_present and skip_if_present in s:
        print(f"  · {label} (already present, skipping)")
        return
    if anchor not in s:
        raise PatchError(f"[{label}] anchor not found in {path.name}")
    path.write_text(s.replace(anchor, anchor + addition, 1))
    print(f"  ✓ {label}")

# ── customizations ───────────────────────────────────────────────────

def head_metadata(cairn_dir: Path):
    """Add noindex, favicon, OG tags, Twitter card to <head>."""
    idx = cairn_dir / "index.html"

    # Add noindex + favicon + OG block right after the viewport meta
    head_block = """<meta name="robots" content="noindex,nofollow" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

<!-- Open Graph / link preview metadata -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Matt Carpenter" />
<meta property="og:title" content="Cairn — Smoke / CO / Light" />
<meta property="og:description" content="A ceiling-mounted smoke and carbon-monoxide detector with a motion-activated downlight. Concept by RL · Technical specs by MC." />
<meta property="og:url" content="https://mattcarpenter.com/rl/cairn/" />
<meta property="og:image" content="https://mattcarpenter.com/rl/cairn/og-cover.png" />
<meta property="og:image:secure_url" content="https://mattcarpenter.com/rl/cairn/og-cover.png" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Cairn — concept cover" />

<!-- Twitter / iMessage / Telegram large-image card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Cairn — Smoke / CO / Light" />
<meta name="twitter:description" content="A ceiling-mounted smoke and carbon-monoxide detector with a motion-activated downlight. Concept by RL · Technical specs by MC." />
<meta name="twitter:image" content="https://mattcarpenter.com/rl/cairn/og-cover.png" />
"""
    insert_after(
        idx,
        '<meta name="viewport" content="width=device-width,initial-scale=1" />\n',
        head_block,
        "head: noindex/favicon/OG/Twitter tags",
        skip_if_present='og:title',
    )


def pro_to_smart(cairn_dir: Path):
    """Rename Pro to Smart everywhere it refers to the SKU.
    Leaves variable names like isPropagating and the word 'Project' untouched."""
    web = cairn_dir / "web.jsx"
    bom = cairn_dir / "parts" / "bom.jsx"
    sku = cairn_dir / "parts" / "sku.jsx"

    # web.jsx
    patch(web, '<a href="#smart">PRO</a>', '<a href="#smart">SMART</a>', "web: nav PRO->SMART")
    patch(web,
          'lede="A ceiling-mounted smoke and carbon-monoxide detector with a motion-activated downlight. Same shape, two brains: standard and Pro."',
          'lede="A ceiling-mounted smoke and carbon-monoxide detector with a motion-activated downlight. Same shape, two brains: standard and Smart."',
          "web: concept lede")
    patch(web, 'eyebrow="09 — Cairn Pro"', 'eyebrow="09 — Cairn Smart"', "web: section 09 eyebrow")
    patch(web,
          'lede="The Pro adds temperature, humidity, and a Matter-over-Thread radio. Spotted by a single matte amber dot below the lens."',
          'lede="The Smart adds temperature, humidity, and a Matter-over-Thread radio. Spotted by a single matte amber dot below the lens."',
          "web: section 09 lede")

    # bom.jsx
    patch(bom, "// Bill of materials — both Cairn (standard) and Cairn Pro.",
               "// Bill of materials — both Cairn (standard) and Cairn Smart.",
               "bom: header comment")
    patch(bom, "Pro only.", "Smart only.", "bom: 'Pro only.'")
    patch(bom, "MCU + Thread radio (Pro)", "MCU + Thread radio (Smart)", "bom: MCU label")

    # sku.jsx
    patch(sku, "// Cairn vs Cairn Pro — same form factor, different brain.",
               "// Cairn vs Cairn Smart — same form factor, different brain.",
               "sku: header comment")
    patch(sku, "Identical form, finishes, and install. The Pro adds a radio and two extra sensors.",
               "Identical form, finishes, and install. The Smart adds a radio and two extra sensors.",
               "sku: 'The Pro adds...'")
    patch(sku, 'name="Cairn Pro"', 'name="Cairn Smart"', "sku: card name")
    patch(sku, "Cairn Pro · anomaly mesh", "Cairn Smart · anomaly mesh", "sku: anomaly mesh title")
    patch(sku, "Cairn Pro 3A detects smoke. Local alarm fires immediately.",
               "Cairn Smart 3A detects smoke. Local alarm fires immediately.",
               "sku: detect step")
    patch(sku, "Standard Cairn still works on the mesh as a passive node — Pro units relay its alarm if a Pro is within range.",
               "Standard Cairn still works on the mesh as a passive node — Smart units relay its alarm if a Smart is within range.",
               "sku: passive node note")


def credit_line(cairn_dir: Path):
    """Add the credit line and its supporting Section prop in web.jsx."""
    web = cairn_dir / "web.jsx"

    # 1. Section component signature
    patch(web,
          "function Section({ id, eyebrow, title, lede, children }) {",
          "function Section({ id, eyebrow, title, lede, credit, children }) {",
          "credit: Section signature")

    # 2. Section render block — add credit slot after the lede
    old_render = """        <h2>{title}</h2>
        {lede && <p>{lede}</p>}
      </div>"""
    new_render = """        <h2>{title}</h2>
        {lede && <p>{lede}</p>}
        {credit && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.16em',
            color: 'var(--ink-3)',
            textTransform: 'uppercase',
            marginTop: '14px',
          }}>
            {credit}
          </div>
        )}
      </div>"""
    patch(web, old_render, new_render, "credit: Section render with credit prop")

    # 3. Pass the credit prop on the Concept section.
    # NOTE: this anchor depends on pro_to_smart having run first (lede ends with 'Smart.').
    patch(web,
          'lede="A ceiling-mounted smoke and carbon-monoxide detector with a motion-activated downlight. Same shape, two brains: standard and Smart.">',
          'lede="A ceiling-mounted smoke and carbon-monoxide detector with a motion-activated downlight. Same shape, two brains: standard and Smart."\n        credit="Concept by RL · Technical specs by MC">',
          "credit: pass to Concept section")


def fireworks_easter_egg(cairn_dir: Path):
    """Insert the easter egg line above the colophon in the footer."""
    web = cairn_dir / "web.jsx"
    old = """      <footer className="foot">
        CAIRN · INDUSTRIAL DESIGN · R.0 · 2026.04
      </footer>"""
    new = """      <footer className="foot">
        <div style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '15px',
          letterSpacing: 0,
          textTransform: 'none',
          color: 'var(--ink-2)',
          marginBottom: '18px',
          paddingBottom: '18px',
          borderBottom: '1px solid var(--rule-soft)',
          maxWidth: 'none',
          whiteSpace: 'nowrap',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.4,
        }}>
          And if you've read this far — tell me how the fireworks were last night.
        </div>
        CAIRN · INDUSTRIAL DESIGN · R.0 · 2026.04
      </footer>"""
    patch(web, old, new, "footer: fireworks easter egg")


# ── main ─────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    cairn_dir = Path(sys.argv[1]).resolve()
    if not cairn_dir.is_dir():
        print(f"❌ Not a directory: {cairn_dir}")
        sys.exit(1)

    customizations = [
        head_metadata,
        pro_to_smart,       # must run before credit_line (anchor depends on it)
        credit_line,
        fireworks_easter_egg,
    ]

    failed = []
    for fn in customizations:
        print(f"\n[{fn.__name__}]")
        try:
            fn(cairn_dir)
        except PatchError as e:
            print(f"  ✗ {e}")
            failed.append(fn.__name__)

    print()
    if failed:
        print(f"❌ {len(failed)} customization(s) failed: {', '.join(failed)}")
        print("   Fix scripts/apply-cairn-edits.py to match the new bundle.")
        sys.exit(1)
    print("✓ All customizations applied")


if __name__ == "__main__":
    main()
