# Valentino's Magic Beans — Functional POM

Playwright and TypeScript end-to-end automation for [Valentino's Magic Beans](https://valentinos-magic-beans.click/), using page-organized functions and isolated browser contexts. A separate [class-based implementation](variants/class-based/README.md) covers the same application.

## Setup

Requires Node.js 20+ and npm.

```powershell
npm ci
npx playwright install chromium
```

## Execution

| Command | Purpose |
| --- | --- |
| `npm run test:functional` | Run the functional suite |
| `npm run test:functional:ui` | Open Playwright UI mode |
| `npm run test:functional:list` | List tests |
| `npx playwright test --project=login-setup` | Prepare the account and refresh authentication |
| `npx playwright show-report playwright-report/functional` | Open the HTML report |
| `npm run typecheck` | Type-check both implementations |

## Architecture

- `tests/pages/` — page-specific locators and reusable action functions.
- `tests/smoke/` — cart, checkout, order tracking, authentication, API interception, and resource-blocking scenarios.
- `tests/setup/login.setup.ts` — account preparation, login, and browser storage state.
- `utils/` — account registration, disposable email, and credential-file utilities.
- `playwright.config.ts` — Chromium configuration and setup dependency.

## Authentication

The `chromium` project depends on `login-setup`. Setup reuses `data/.auth/loginData.json`, creates and confirms an account through mail.tm when credentials are absent, then logs in and saves `data/.auth/user.json`. Smoke tests start in separate browser contexts using that session. The standalone signup spec skips when credentials exist.

In UI mode, run the `login-setup` project manually before the Chromium tests. Rerun setup to refresh a rejected or expired session. Credentials, saved sessions, dependencies, and generated artifacts are excluded from Git.

## Results

HTML reports: `playwright-report/functional/`. Test artifacts: `test-results/functional/`. These are separate from the class suite's output directories. Traces are captured on the first retry; use `--retries=1` to enable a local retry.

**Known application issue:** signed-in order creation returns HTTP 201, but public tracking returns HTTP 404 for the same order ID and email. Both complete-order tests retain their failing tracking assertions.
