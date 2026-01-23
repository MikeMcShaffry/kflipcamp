# GitHub Copilot instructions (kflipcamp)

These instructions help Copilot generate PRs and code that fit this repo.

## Repo layout (high level)

- `www.kflipcamp.org/public_html/` is the Node.js website/service.
  - Entry point: `index.js` (Express + Socket.IO).
  - Modules: `archive.js`, `events.js`, `icecastinfo.js`, `otto.js`, `library.js`, `lastfm.js`, `patreon.js`, etc.
  - Static assets: `public/`.
  - Server config: `config.json` (local/production), example: `config.json.example`.
  - Ops automation: `scripts/` (systemd unit + cron + postinstall).
- GitHub Actions deploy: `.github/workflows/deploy.yml` (pushes changes on `main` to an EC2-hosted git remote and restarts the site).

## Command line (PowerShell)

- When providing command-line instructions for developers, **use Windows PowerShell syntax** (Windows PowerShell v5.1).
  - Prefer `;` to chain commands on one line (not `&&`).
  - Use PowerShell environment variable syntax (`$env:NAME = "value"`) when needed.
  - Avoid Bash-only syntax unless explicitly requested.
- Don’t run destructive file operations outside the repo (no Remove-Item except within temp folders you created)
- Ask before running anything long-running (servers/watchers) or anything that installs system-level deps

## Git usage
- **Never run any `git` commands** (including `git status`, `git diff`, `git commit`, `git push`, etc.) unless explicitly requested.

## Runtime + style conventions

- **Node style:** CommonJS (`require`, `module.exports`). Don’t convert files to ESM unless the change is repo-wide.
- **Frameworks:** Express for HTTP routes + Socket.IO for real-time events.
- **Ports:** default `3000` (`process.env.PORT || 3000`). Don’t hardcode a different port.
- **Logging:** prefer existing patterns (`console.log('INFO - ...')`) and keep log lines actionable.
- **Async:** prefer `async/await` over nested callbacks when touching code.
- **Compatibility:** Docker uses `node:16-alpine`; avoid introducing syntax requiring newer Node versions unless you also update Docker and deployment.

## Configuration / secrets (very important)

- `www.kflipcamp.org/public_html/config.json` contains secrets/tokens in real deployments.
  - **Never** commit real secrets.
  - Use `config.json.example` as the template when documenting new config keys.
- Don’t print secrets to logs.
- If you add a new integration (API keys, OAuth tokens, webhooks):
  - add placeholders to `config.json.example`
  - update any docs/comments referencing the config
  - make the feature gracefully disableable via `enabled: false`.

## Testing and local dev

Prefer small, incremental changes with a quick test.

Primary commands (run from `www.kflipcamp.org/public_html/`):

- Start server: `npm run start`
- Tests: `npm test` (Mocha + NYC; runs `./socket.io/test/*.js`)

When adding/altering behavior, also add/update tests when practical.

## Deployment expectations

- CI/CD: `.github/workflows/deploy.yml` deploys by pushing to a git remote on EC2, then runs a restart command.
- Server ops (on Linux host):
  - systemd service definition: `www.kflipcamp.org/public_html/scripts/kflip.service`
  - postinstall provisioning: `www.kflipcamp.org/public_html/scripts/postinstall.sh`
  - cron job for archiving: `www.kflipcamp.org/public_html/scripts/kflip_cron`

When proposing changes that affect deployment (entry point, working directory, env vars, ports, cron paths), update these scripts accordingly.

## What Copilot should do when making changes

- Keep edits scoped: change the minimum number of files needed.
- Match the existing module boundaries (don’t cram unrelated logic into `index.js`).
- Prefer adding small helper functions in the relevant module.
- Handle failures explicitly (network timeouts, missing config keys, API errors).
- Add safe defaults and backward compatibility for existing `config.json`.

## What Copilot should avoid

- Don’t add new heavy dependencies without a clear need.
- Don’t introduce breaking API changes to Socket.IO event payloads without updating the corresponding client code under `public/`.
- Don’t modify deployment workflow secrets handling (SSH keys, hostnames) unless explicitly requested.
- Don’t commit generated artifacts, logs, or local databases (anything under `data/` that isn’t meant to be versioned).
