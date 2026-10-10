# Amazon Filter Automation

End-to-end tests for the product filters on Amazon India (amazon.in), written with Playwright and TypeScript.

The suite searches for "Mobile", applies each filter option in the left navigation (brand, storage, battery, display, camera, processor speed and others), and then checks that the products shown match the filter that was applied. It runs against the live site, locally or on GitHub Actions.

> **Purpose and disclaimer.** This project exists only for education and learning, to practise end-to-end test design with Playwright and TypeScript. It is not a product or a service, it is not meant for commercial use, and it is not meant to build datasets from any website. It is unofficial and is not affiliated with, endorsed by or sponsored by Amazon; "Amazon" and "amazon.in" belong to their owners. The tests load pages from a live commercial website whose terms of use may restrict automated access, so read those terms and decide for yourself before running anything here. Nothing in this project gives any permission on Amazon's behalf. The code is provided as is, under the licence in [LICENSE](LICENSE), and you are responsible for how you use it. Use it sparingly.

## What is tested

There are 8 tests in `tests/AmazonAll.spec.ts`.

- **Brand filter.** For each brand option, the test applies the brand and checks that every product title on the results page contains the brand name or a known alias (for example "Moto" for Motorola).
- **Specification filters** (storage, battery, discount, screen size, display type, primary camera resolution, processor speed). For each filter option, the test opens the first products in separate tabs, reads the title, key features, "about this item" and technical details, and checks them against the filter value.

## How it works

```
tests    what is verified, in a few readable lines
flows    multi-step journeys across pages and tabs; they return plain results
pages    locators and single-page actions
utils    shared helpers: run sizing, screenshots, 503 recovery, "Continue shopping" page
```

Each layer calls only the layer below it. Tests call a flow, loop over the results it returns, and assert with `expect.soft`, so one run reports every mismatch.

A test, in short:
1. Open amazon.in, search for "Mobile", and check that the filter exists in the left navigation.
2. For each filter option (up to a limit), apply it, check the products, then clear it.
3. For the specification filters, open each product in a new tab, read its details, and close the tab.

Because the site is live, the code expects some unreliability. It continues past Amazon's "Continue shopping" page (it does not solve any challenge), reloads on a "Service Unavailable" page, slows actions with `slowMo`, skips products that return no data, and logs the tab's URL and title when a page does not load.

## Project structure

```
.github/workflows/playwright.yml   CI pipeline
flows/                             BrandFilterFlows.ts, SharedFilterFlows.ts
pages/                             AmazonLandingPage.ts, ProductListingPage.ts
tests/AmazonAll.spec.ts            the test cases
utils/                             CaptchaHandler.ts, GenericUtility.ts, RunConfig.ts
playwright.config.ts               runner settings
```

## How much is tested

`utils/RunConfig.ts` decides how many filter options and products each run covers.

| Mode | When | Filter options | Products each |
|---|---|---|---|
| standard | push, pull request, manual run, any local run | first 5 | first 3 |
| cron | the weekly scheduled run, or `IS_CRON=true` | first 3 | first 5 |

The environment variables `FILTER_OPTIONS_COUNT`, `PRODUCTS_COUNT`, `RUN_ALL_FILTER_OPTIONS` and `RUN_ALL_PRODUCTS` override these. A cap never exceeds what the page shows. The log states which mode was chosen and each limit that was applied.

## Getting started

Needs a current Node.js LTS release.

```bash
npm ci
npx playwright install chromium

npx playwright test                 # all tests
npx playwright test -g "brands"     # one test, by name
npx playwright test --headed        # watch the browser
npx playwright show-report          # open the last report
npx tsc -p tsconfig.json            # type check only
```

To run with the weekly-run sample locally: `IS_CRON=true npx playwright test` (PowerShell: `$env:IS_CRON = "true"; npx playwright test`).

## Continuous integration

`.github/workflows/playwright.yml` runs on pushes and pull requests to `master`, weekly (Sundays 21:00 UTC), and manually.

1. **typecheck** runs `tsc` once.
2. **test** runs as 4 parallel shards (Playwright splits the tests between them), with 2 workers each and 2 retries. Each shard uploads a blob report.
3. **merge-reports** combines the blob reports into one HTML report, kept for 3 days.

CI records no trace, because traces made the reports very large. A failed test keeps its video and a failure screenshot. Locally, failures also keep a full trace. Allure results are written to `allure-results` but are not published.

## Known limitations

- **The target is not always available to automation.** Amazon sometimes returns a "rush hour" page or a "Continue shopping" page, especially after many quick requests or from datacenter addresses such as CI runners. A run can fail or skip for reasons that have nothing to do with a filter bug.
- **The specification check is literal.** It looks for the filter text itself in the product text, so range filters such as `Up to 2,999 mAh` are reported as mismatches. A numeric comparison is planned.
- **A missing filter ends a test as a pass.** If a filter does not appear in the left navigation, the test logs a warning and returns. Check the logs when a run is suspiciously fast.
- **Locators depend on Amazon's markup,** which can change at any time.
- **Results depend on live data,** so the sampled products differ from run to run, and coverage is a sample in both modes.
- **Terms of use.** The tests access a live commercial site automatically. Amazon's terms, including the Conditions of Use linked in the amazon.in footer, may restrict automated access and data collection. Read them before running this, run it sparingly, and do not run it in a loop or to collect data.
