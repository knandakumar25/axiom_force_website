# Axiom Force website

This React and Vite site serves Axiom Force and Axiom Force: Drift Circuit. The
localized homepage links to both game pages. Drift Circuit describes the Unity
prototype plan and the eight candidate circuits.

## Local development

1. Keep the original Axiom Force checkout next to this repository. Its local
   `.env` configures Express, PostgreSQL and the Clerk development issuer.
2. Copy `.env.example` to `.env` here and set the **publishable** Clerk development
   key that matches the original API. The Clerk secret stays in the original
   repository's ignored `.env`. Docker excludes local env files from this build.
3. Run `./start.ps1`. Use `-GameRoot` to point to a different original checkout.
   It waits for the database and API, then starts the site at
   [http://localhost:5173](http://localhost:5173).

Nginx proxies `/api/` to the original Express API through the
`axiom-force-shared-website` network. The racing backend remains a separate local
development service. Use `docker compose stop website` here to stop the site
alone. Use `docker compose down` in this checkout before tearing down the
original Compose network.

## Boundaries

- `src/App.jsx` keeps localized player routes, Clerk wildcard routes, bare `/onboarding`
  and `/auth/browser-confirm`; it owns route titles and navigation focus.
- `components/Navbar.jsx` and `Footer.jsx` own navigation. Closed mobile content is hidden
  from keyboard focus. Escape and language-driven menu closure restore toggle focus.
- `components/Showcase.jsx` holds campaign/operative presentation identifiers and shared content
  components. Verify changes against `LevelCatalog`, `OperativeRoster` and the game registry.
- `showcase.css` supplies neutral surfaces, readable text, logical spacing, shared forms/cards,
  focus outlines, responsive layouts and reduced-motion behavior. Title imagery remains separate
  from explanatory copy. Existing onboarding and Clerk panels share the form baseline.
- `translations/ui_translations.json` contains all 17 showcase and onboarding translations.
  Every locale must preserve key sets and interpolation placeholders. Language changes retain
  the current query/hash and keep bare auth/onboarding routes bare.
- `components/AccountAccess.jsx` resolves loading, signed-out, linked, onboarding-required,
  expired and unavailable states. It acquires fresh Clerk proof per protected account call.
  `AuthContext` discards old API memory when the Clerk identity changes anywhere in the site.
- `api/tokens.js` retains API credentials only in memory. Install and clear invalidate earlier
  work. `api/client.js` coalesces refresh within one generation and rejects stale writes/retries.
- `pages/BrowserAuth.jsx` alone submits explicit game approval. Visiting account settings,
  changing language, loading a profile or signing in never approves a pending request.
- `public/images/showcase` contains unmodified copies of seven existing SpriteCook images;
  source paths, hashes and asset references are in root `spritecook-assets.json`.

## Verification

Build and start with `./start.ps1`, then run `docker compose run --rm playwright`
for the public portal, locale, same-origin API and client refresh checks.
See [browser instructions](playwright/README.md) for isolated Clerk and account
verification. The original checkout owns the game and Express unit suites.

The application has no access/refresh credential persistence. Clerk's own existing session
handling remains responsible for public sign-in. Password API settings retain their mailed-code
rules; they do not configure Clerk's authentication factors.
