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

## Layout

- `index.html` — the whole site
- `CNAME` — custom domain (`mattcarpenter.com`)
- `.gitignore`
- `README.md`
