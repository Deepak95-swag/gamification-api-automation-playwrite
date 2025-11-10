# RewardRally API Playwright Tests

This small Playwright (TypeScript) project contains an API test that creates a project via the RewardRally staging API.

Files created:
- `tests/createProject.spec.ts` — the API test. It will be skipped unless you provide a BEARER token.
- `playwright.config.ts` — Playwright config.
- `tsconfig.json` — TypeScript config.
- `package.json` — project manifest (devDependency on @playwright/test).

How to run (PowerShell):

1) Install dependencies (first time):

```powershell
Set-Location -Path "D:\RewardRally_APITesting"
npm install
```

2) Run the test with your token (PowerShell):

```powershell
# Set your token in environment for current shell
$env:BEARER_TOKEN = "<YOUR_BEARER_TOKEN>"
# Run the specific test file
npx playwright test tests/createProject.spec.ts --reporter=list
```

Or set the env and run in one line:

```powershell
$env:BEARER_TOKEN = "<YOUR_BEARER_TOKEN>"; npx playwright test tests/createProject.spec.ts --reporter=list
```

Notes:
- The test is written to skip when `BEARER_TOKEN` is not set so you can install deps and run the suite without failing.
- When you give me the next endpoint(s), I can add more tests to implement the flow (create, then follow-up calls, assertions, etc.).
