# mattcarpenter-site

Source for [mattcarpenter.com](https://mattcarpenter.com).

A single static page. No build step, no framework, no JS dependencies. Just `index.html`.

## Deploy

GitHub Pages, served from `main`. The `CNAME` file pins the custom domain.

Push to `main` → Pages rebuilds → live in ~30–90s.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## PR checks

Pull requests run [`.github/workflows/pr-checks.yml`](.github/workflows/pr-checks.yml) (also manually via **Actions → PR checks → Run workflow**):

- **Build** — `briefings/index.html` must exist with a `<!-- ENTRIES -->` marker; the repo root must serve over HTTP.
- **Broken links** — [lychee](https://github.com/lycheeverse/lychee): internal/root-relative links are strict; external URLs are checked with retries and common flaky hosts excluded (non-blocking).
- **Playwright** — smoke tests in `tests/` for `/briefings/` and `/briefings-preview/`.
- **axe** — critical accessibility violations only on `/briefings/` (all findings are logged).

Local e2e (after `npm ci` and `npx playwright install chromium`):

```sh
npm run test:e2e
```

## Layout

- `index.html` — the whole site
- `CNAME` — custom domain (`mattcarpenter.com`)
- `.gitignore`
- `README.md`
