# Automated tests (kflipcamp)
```
npm run test:live
$env:KFLIP_BASE_URL = "https://www.kflipcamp.org"
```powershell

These are opt-in and should only run when you explicitly provide a base URL.

## Live / post-deploy tests

```
npm test
```powershell

From `www.kflipcamp.org/public_html/`:

## Running tests

- `test/live/` – post-deployment smoke tests against a live server (optional; requires `KFLIP_BASE_URL`).
- `test/integration/` – Express + Socket.IO integration tests (in-memory server).
- `test/unit/` – fast, deterministic unit tests (no network).

Test layers:

This project uses **Mocha** + **NYC**.


