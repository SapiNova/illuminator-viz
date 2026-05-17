# Illuminator

Static site for [Illuminator](https://illuminator.dev).

## Documentation

Documentation source lives in `docs-src/` (shared layout in `docs-src/_includes/`, page content in `docs-src/pages/`). Build output is written to `docs/`.

```bash
npm run build:docs
```

Preview locally with any static server from the repo root (e.g. `python -m http.server`).

## Deploy (GitHub Pages)

Pushes to `main` or `master` run [.github/workflows/pages.yml](.github/workflows/pages.yml): build docs, then deploy the whole site.

### One-time GitHub setup

1. Open the repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Push this repo (including `.github/workflows/pages.yml`) to `main` or `master`.
4. After the workflow finishes, the site is live. Check **Actions** for the deploy run and **Settings → Pages** for the URL.

Custom domain `illuminator.dev` is configured via `CNAME` in the repo root; no extra DNS steps if that was already working.
