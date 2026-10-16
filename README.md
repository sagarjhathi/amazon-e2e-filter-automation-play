# Amazon Filter Automation

End-to-end tests for the product filters on Amazon India (amazon.in), written with Playwright and TypeScript. The suite searches for "Mobile", applies filter options from the left navigation, and checks that the products shown match the filter that was applied. It runs against the live site, locally or on GitHub Actions, and publishes its reports to GitHub Pages.

**Latest reports:** https://sagarjhathi.github.io/amazon-e2e-filter-automation-play/ (links to the Playwright report and the Allure report)

> **Purpose and disclaimer.** This project exists only for education and learning, to practise end-to-end test design with Playwright and TypeScript. It is not a product or a service, it is not meant for commercial use, and it is not meant to build datasets from any website. It is unofficial and is not affiliated with, endorsed by or sponsored by Amazon; "Amazon" and "amazon.in" belong to their owners. The tests load pages from a live commercial website whose terms of use may restrict automated access, so read those terms and decide for yourself before running anything here. Nothing in this project gives any permission on Amazon's behalf. The code is provided as is, under the licence in [LICENSE](LICENSE), and you are responsible for how you use it. Use it sparingly.

## Contents

- [What is tested](#what-is-tested)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [How much is tested](#how-much-is-tested)
- [Continuous integration](#continuous-integration)
- [Reports](#reports)
- [Code quality](#code-quality)
- [Known limitations](#known-limitations)
- [License](#license)

## What is tested

There are 8 tests in `tests/AmazonAll.spec.ts`.

| Test | Filter | What is checked |
|---|---|---|
| Verifying brands filter application | Brand | Every product title on the results page contains the brand name or a known alias (for example "Moto" for Motorola). |
| verifyingStorageCapacityFilterFunctionality | Storage Capacity | The filter value appears in the product's details. |
| verifyingBatteryCapacityFilterFunctionality | Battery Capacity | Same check. |
| verifyingDiscountFilterFunctionality | Discount | Same check. |
| verifyingDisplaySizeFilterFunctionality | Screen Size | Same check. |
| verifyingDisplayTypeFilterFunctionality | Display Type | Same check. |
| verifyingMobilePhonePrimaryCameraResolutionFilterFunctionality | Primary Camera Resolution | Same check. |
| verifyingProcessorSpeedFilterFunctionality | Processor Speed | Same check. |

For the specification filters, the test applies each filter option, opens the first products in separate tabs, reads the title, key features, "about this item" text and technical details, and looks for the filter value in that text.

If a filter does not appear in the left navigation, the test is reported as **skipped** with the reason, so a run that verified nothing never shows as a pass.

## How it works

```
tests    what is verified, in a few readable lines
flows    multi-step journeys across pages and tabs; they return plain results
pages    locators and single-page actions
utils    shared helpers: run sizing, screenshots, 503 recovery, "Continue shopping" page
```

Each layer calls only the layer below it. A test calls a flow, loops over the results it returns, and asserts with `expect.soft`, so one run reports every mismatch instead of stopping at the first.

A test, in short:

1. Open amazon.in, search for "Mobile", and check that the filter exists in the left navigation.
2. For each filter option (up to a limit), apply it, check the products, then clear it.
3. For the specification filters, open each product in a new tab, read its details, and close the tab.

Because the site is live, the code expects some unreliability. It continues past Amazon's "Continue shopping" page (it does not solve any challenge), reloads on a "Service Unavailable" page, slows actions with `slowMo`, skips products that return no data, and logs the tab's URL and title when a page does not load.

## Project structure

```
.github/workflows/playwright.yml   CI pipeline: lint, type check, tests, report merge, publish
.github/pages/index.html           landing page template for the published reports
flows/                             BrandFilterFlows.ts, SharedFilterFlows.ts
pages/                             AmazonLandingPage.ts, ProductListingPage.ts
tests/AmazonAll.spec.ts            the test cases
utils/                             CaptchaHandler.ts, GenericUtility.ts, RunConfig.ts
playwright.config.ts               runner settings and reporters
eslint.config.mjs                  lint rules
tsconfig.json                      type-check settings
```

## Getting started

Requires a current Node.js LTS release (CI uses Node 22).

```bash
npm ci
npx playwright install chromium

npm test                  # run all tests
npm run test:headed       # watch the browser
npx playwright test -g "brands"   # one test, by name
npm run report            # open the last Playwright report
npm run allure:generate   # build the Allure report from allure-results/
npm run allure:open       # open the generated Allure report
npm run typecheck         # type check only
npm run lint              # lint
npm run lint:fix          # lint and fix what can be fixed automatically
```

To run with the scheduled-run sample locally: `IS_CRON=true npm test` (PowerShell: `$env:IS_CRON = "true"; npm test`).

Locally, the runner writes the Playwright HTML report to `playwright-report/` and the Allure results to `allure-results/`, and keeps a full trace of failed tests and retries.

## How much is tested

`utils/RunConfig.ts` decides how many filter options and products each run covers, based on what triggered the run.

| Mode | When | Filter options | Products each |
|---|---|---|---|
| standard | push, pull request, manual run, any local run | first 5 | first 3 |
| cron | the daily scheduled run, a manual run with "full run" ticked, or `IS_CRON=true` | all that the page shows | first 5 |

"All" means however many options the page lists in that run, so the number can differ between runs.

To change either setting for one run, set an environment variable to a number or to `all`:

| Variable | Example | Effect |
|---|---|---|
| `FILTER_OPTIONS` | `FILTER_OPTIONS=all` or `FILTER_OPTIONS=2` | How many filter options to try. |
| `PRODUCTS` | `PRODUCTS=all` or `PRODUCTS=1` | How many products to open under each filter option. |

Anything that is not `all` or a number is ignored, and the default for the mode is used. A number larger than what the page shows just means "all of them". The first log lines of a run state the mode and both settings, and each limit logs how many it resolved to.

## Continuous integration

The pipeline is defined in `.github/workflows/playwright.yml`.

| Trigger | Mode |
|---|---|
| Push to `master` | standard |
| Pull request into `master` | standard |
| Daily at 20:00 UTC (01:30 IST) | cron |
| Manual run from the Actions tab | standard, or cron if "full run" is ticked |

A newer push or pull-request run cancels the older one on the same branch. The scheduled run and manual runs are never cancelled.

**Jobs**

1. **typecheck** runs the linter and the type check once, so a mistake fails fast instead of failing in every shard.
2. **test** runs the suite as 4 parallel shards, each on its own runner, with 2 workers and up to 2 retries per shard. Each shard uploads a Playwright blob report and its Allure results as short-lived artifacts.
3. **merge reports** combines the 4 shards into one Playwright HTML report and one Allure report, then publishes both to GitHub Pages.

**How tests are split across shards.** Playwright decides this. Each shard lists the tests in the order they appear in `tests/AmazonAll.spec.ts`, cuts the list into equal chunks, and runs its chunk (`--shard=N/4`). With 8 tests, each shard runs 2. This works because `fullyParallel: true` is set in `playwright.config.ts`, which makes each test, not each file, a unit that can be assigned. The split is by test count, not duration, and adding or reordering tests changes which shard runs what. Check any shard with `npx playwright test --shard=2/4 --list`.

**Workers and shards.** Workers are parallel test processes inside one machine. Shards are separate machines. Sharding cuts the total time, at the cost of repeating checkout, install and browser setup in every shard.

**What CI records.** Traces were the largest artifact (several GB per run), so CI records none. A failed test keeps its video and a failure screenshot, and the log shows each step.

**Publishing.** Pushes to `master`, the scheduled run and manual runs publish the reports to the `gh-pages` branch as one fresh commit each time, so the branch holds only the latest reports and never grows. Pull requests build the reports but do not publish them. GitHub Pages serves the branch from its root.

```
index.html     landing page with a link to each report
playwright/    merged Playwright report (latest run)
allure/        merged Allure report (latest run)
```

## Reports

Open the [landing page](https://sagarjhathi.github.io/amazon-e2e-filter-automation-play/) and pick a report.

- **Playwright report.** Every test with its steps, screenshots and failure videos. Use the tabs at the top to filter by state. **The default "All" tab does not include skipped tests; open the "Skipped" tab to see them.**
- **Allure report.** An overview, a list of suites and results, and trend graphs. Allure keeps the history of previous runs: each publish carries the previous report's history forward, so the trend graphs grow over time. Runs of different sizes (standard and cron) appear on the same graph.
- **Workflow artifacts.** The merged Playwright report is also attached to each workflow run for 3 days.

## Code quality

- **ESLint** (`typescript-eslint`) and **TypeScript** run in the first CI job and locally with `npm run lint` and `npm run typecheck`.
- `.gitattributes` keeps line endings consistent across Windows and Linux.
- **TypeScript 7 note.** typescript-eslint cannot use TypeScript 7 yet, so `package.json` follows Microsoft's side-by-side setup: `typescript` is an alias for the TypeScript 6 compatibility package (used by ESLint), and `@typescript/native` provides TypeScript 7, which is what `tsc` runs.

## Known limitations

- **The target is not always available to automation.** Amazon sometimes returns a "rush hour" page or a "Continue shopping" page, especially after many quick requests or from datacenter addresses such as CI runners. When that happens the filters are not on the page, so the tests are skipped. A CI report can therefore show every test as skipped; that reflects what the site served, not a defect in a filter. Running the suite locally from a normal connection gives real results.
- **The specification check is literal.** It looks for the filter text itself in the product text, so range filters such as `Up to 2,999 mAh` are reported as mismatches. A numeric comparison is planned.
- **Locators depend on Amazon's markup,** which can change at any time.
- **Results depend on live data,** so the sampled products differ from run to run, and coverage is a sample in both modes.
- **Terms of use.** The tests access a live commercial site automatically. Amazon's terms, including the Conditions of Use linked in the amazon.in footer, may restrict automated access and data collection. Read them before running this, run it sparingly, and do not run it in a loop or to collect data.

## License

Released under the [ISC License](LICENSE).
