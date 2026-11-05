# Valentino's Magic Beans — Class-based POM

Playwright and TypeScript end-to-end automation using page classes, separate selector dictionaries, and isolated browser contexts. Runs independently of the [functional POM implementation](../../README.md).

## Setup

Requires Node.js 20+ and npm. Run commands from the repository root.

```powershell
npm ci
npx playwright install chromium
```

## Execution

| Command | Purpose |
| --- | --- |
| `npm run test:classes` | Run the class-based suite |
| `npm run test:classes:ui` | Open Playwright UI mode |
| `npm run test:classes:list` | List tests |
| `npm run typecheck` | Type-check both implementations |
| `npx playwright test --config variants/class-based/playwright.config.ts --project=class-auth-setup` | Refresh authentication |
| `npx playwright show-report playwright-report/class-based` | Open the HTML report |

## Commit checks

Husky runs `npm run typecheck` for both POM implementations before each commit and blocks the commit if either check fails. Browser tests run separately.

## Architecture

- `pages/` — page actions, value retrieval, and locators; includes the reusable `Header` component.
- `selectors/` — element identifiers and locator configuration, separate from actions.
- `smoke/` — scenarios and retrying assertions; no assertions reside in page classes.
- `setup/` — authentication and the class-specific session path.
- `../../data/*.data.ts` — shared sample form values and product data.
- `../../utils/` — shared email and credential-file utilities.

## Authentication

The `class-chromium` project depends on `class-auth-setup`. Setup uses `TEST_EMAIL` and `TEST_PASSWORD` together, or credentials from `data/.auth/loginData.json`. When neither is available, setup registers and confirms an account through `SignUpPage` and mail.tm, then saves its credentials using the shared auth-file utility. It logs in through `LoginPage` and saves `data/.auth/class-based-user.json`. No functional page helpers or functional setup are required. Environment variables are read from the process; `.env` files are not loaded automatically.

In UI mode, run `class-auth-setup` manually before the smoke tests. Refresh setup when the saved session expires or is rejected. Credentials, sessions, dependencies, and generated artifacts are excluded from Git.

## Coverage

Cart validation, guest checkout and tracking, signed-in checkout with named steps, authenticated account checks, product API interception, image blocking, and email-confirmed signup. Guest checkout and signup explicitly start signed out. The signup spec skips when credentials are available; account creation occurs during setup only when required.

## Results

HTML reports: `playwright-report/class-based/`. Test artifacts: `test-results/class-based/`. Failed tests retain traces and screenshots.

**Known application issue:** signed-in order creation returns HTTP 201, but public tracking returns HTTP 404 for the same order ID and email. The signed-in workflow retains its failing tracking assertion. The last full run reported **8 passed, 1 skipped, 1 failed**, including authentication setup; signup skipped because credentials existed. That run preceded restoring price conversion to match the functional implementation.
