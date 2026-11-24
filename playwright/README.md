# Playwright verification

Start the shared site with `./start.ps1` from the website repository root. Then
run `docker compose run --rm --build playwright`. The default suite checks the
homepage, both games, localized deep links, browser storage, accessibility,
same-origin API health and the Axios refresh client.

## Account flows

Use a Clerk development instance. The suite uses disposable Clerk test users
and a disposable PostgreSQL database. In a dedicated terminal at the original
Axiom Force checkout, run:

```powershell
docker compose exec -T backend node scripts/e2e-server.js
```

From the website checkout, supply the original development secret as a
process-local environment variable via your existing secret setup. The
publishable key comes from this checkout's ignored `.env`. Run:

```powershell
docker compose run --rm -e CLERK_SECRET_KEY -e BASE_URL=http://localhost:5173 playwright npx playwright test browser-auth.spec.cjs account-security.spec.cjs --workers=1
```

Chromium maps `localhost` to the site on the Docker network for Clerk cookies.
The test redirects browser API calls to the isolated service on port 8002.
The default smoke tests independently verify the real Nginx proxy on port 5173.
Tests delete the disposable Clerk users they create.

For a live Windows game check, publish the isolated API from the original
checkout with `docker compose run --rm --no-deps -p 127.0.0.1:18002:8002 backend node scripts/e2e-proxy.js`.
Start a disposable game process with `AXIOM_API_BASE_URL=http://127.0.0.1:18002/api`.
Set `LIVE_GAME_SESSION_ID` to the public UUID from the approval link and add
`-e LIVE_GAME_SESSION_ID` to the Playwright command. The runner approves that
request with its disposable account. The game redeems the request and can
create and read a save slot through its HTTP save client. Keep the game process's
user data separate from the regular player profile.

Stop the temporary loopback proxy when finished. Stop the isolated server with
Ctrl+C or by POSTing `/__test__/stop` from the backend container. The server
then drops its test database.
