# scripts/

## update-cairn.sh

Drop a fresh Claude Design bundle into `/rl/cairn/` and re-apply our
manual customizations.

```sh
# default: find newest Safety*Hub*.zip in ~/Downloads, apply, prompt to push
./scripts/update-cairn.sh

# pick a specific zip
./scripts/update-cairn.sh ~/Downloads/Safety_Hub_v3.zip

# stage but don't push (you commit yourself)
./scripts/update-cairn.sh --no-push
```

The script preserves `og-cover.png` (we render that ourselves; it's not
in the bundle), then calls `apply-cairn-edits.py` to layer our edits
back on top of the fresh source.

## apply-cairn-edits.py

The brain. Applies every manual customization we made to the Claude
Design bundle:

- `head_metadata` — noindex, favicon links, OG tags, Twitter card
- `pro_to_smart` — rename "Pro" SKU to "Smart" everywhere
- `credit_line` — "Concept by RL · Technical specs by MC" under the
  Concept lede (extends `<Section>` with a `credit` prop)
- `fireworks_easter_egg` — italic line above the colophon

Each customization is a function. If upstream changes the surrounding
text and an anchor stops matching, the script fails loudly with a
clear message — fix the relevant function, don't paper over it.

## When upstream ships a new bundle

1. Drop the zip in `~/Downloads` (or anywhere — pass the path)
2. `./scripts/update-cairn.sh`
3. If a customization fails: open `apply-cairn-edits.py`, find the
   function that broke, update its anchor strings to match the new
   bundle's text. Re-run.
4. Approve the commit prompt.

## When *we* change something manually

If you make a manual edit to `rl/cairn/` that should survive future
bundle updates, add a new function to `apply-cairn-edits.py` that
re-applies it. That keeps the script as the single source of truth
for "what we've changed vs. upstream."
