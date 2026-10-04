# Amazon Filter Automation

End-to-end tests for the product filters on Amazon India (amazon.in), written with Playwright and TypeScript.

The suite searches for "Mobile", applies each filter option in the left navigation (brand, storage, battery, display, camera, processor speed and others), and then checks that the products shown really match the filter that was applied. It runs against the live site, locally or on GitHub Actions.


## Table of contents

1. [What this project verifies](#what-this-project-verifies)
2. [What makes this project different](#what-makes-this-project-different)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [How the layers fit together](#how-the-layers-fit-together)
6. [How a test runs, step by step](#how-a-test-runs-step-by-step)
7. [Controlling how much is tested](#controlling-how-much-is-tested)
8. [Dealing with a site that pushes back](#dealing-with-a-site-that-pushes-back)
9. [Reporting and debugging](#reporting-and-debugging)
10. [Continuous integration](#continuous-integration)
11. [Getting started](#getting-started)
12. [Configuration reference](#configuration-reference)
13. [Adding a new filter test](#adding-a-new-filter-test)
14. [Known limitations](#known-limitations)

## What this project verifies

Amazon's search results page lets a shopper narrow results with filters. A filter that does not actually filter is a real defect, and it is easy to miss by hand because there are many filters and many options per filter. This suite checks the behaviour automatically.

There are two kinds of checks, both in `tests/AmazonAll.spec.ts`.

**Brand filter.** For each brand option, the test applies the brand and checks that every product title on the results page contains the brand name (or a known alias, for example "Moto" for Motorola, or "iPhone" for Apple).

**Specification filters.** For each of the following filters, the test applies each option, opens the first products in separate tabs, reads the product details, and checks that the chosen filter value appears somewhere in the product's title, key features, "about this item" section or technical details:

- Storage Capacity
- Battery Capacity
- Discount
- Screen (Display) Size
- Display Type
- Mobile Phone Primary Camera Resolution
- Processor Speed

## What makes this project different

Many personal automation projects test an application the author controls, with stable data and no resistance. This one tests a large third-party site that actively tries to detect and slow down automation, and the design reflects that.

**It is built for an unfriendly target.** Amazon returns captcha pages, "Service Unavailable" pages, and different page layouts for the same search. The code detects these situations and reacts to them instead of failing blindly. See [Dealing with a site that pushes back](#dealing-with-a-site-that-pushes-back).

**Run size depends on what triggered the run.** A push or a pull request runs a small sample for fast feedback. The weekly scheduled run uses a wider sample: 3 filter options and 5 products each. The same code does both, driven by environment variables, with a startup log that states which mode was chosen and why. See [Controlling how much is tested](#controlling-how-much-is-tested).

**It has a flow layer between pages and tests.** Beyond the usual page objects, a `flows` folder holds the multi-step journeys that span several pages and tabs (apply a filter, open products, collect results, clear the filter). Tests stay short and read like a description of intent.

**It separates collecting results from asserting them.** The flows gather what they observed into a list of results and return it. The test then asserts on that list with soft assertions, so one run reports every mismatch instead of stopping at the first.

**It handles two versions of the same page.** Amazon serves different markup for the brand filter depending on the session. The test checks which version it received and uses the matching locators.

**Product details are read in a separate tab, with page objects rebuilt for it.** Each product opens in a new browser tab, and the flow creates a second set of page objects and utilities bound to that tab, because locators belong to the page they were created from. The tab is closed after the details are read, whether or not the read succeeded.

**Matching is deliberately tolerant where the data is messy.** Product titles do not always repeat the brand name exactly, so brand matching normalises text and supports aliases. Failures therefore point at real filter problems and not at naming quirks.

**It is designed to be debugged after the fact.** Failed tests keep their video and trace (locally every run records video), screenshots are saved at risky steps, and messages are logged with the test name. When a page is not what the test expected, the log says what the tab's URL and title were.

**The design follows an earlier Java and Selenium framework.** The page object and flow structure, and the properties-style control of run size, were carried over and reworked using Playwright idioms (auto-waiting locators, soft assertions, projects, tags).

## Tech stack

| Area | Choice |
|---|---|
| Test runner | Playwright Test |
| Language | TypeScript (strict mode) |
| Browser | Chromium |
| Reporting | Playwright HTML report (merged from per-shard blob reports in CI), traces, video |
| CI | GitHub Actions |
| Runtime | Node.js (CI uses version 22) |

## Project structure

```
.
|-- .github/workflows/playwright.yml   CI pipeline (type check, 4 shards, report merge)
|-- docs/ci-and-sharding.md            Internal reference: sharding, test selection, runners, settings
|-- docs/github-pages-reports.md       Design note: publishing per-shard reports to GitHub Pages (proposed)
|-- flows/
|   |-- BrandFilterFlows.ts            Brand filter journey and brand validation
|   `-- SharedFilterFlows.ts           Generic filter journey for the specification filters
|-- pages/
|   |-- AmazonLandingPage.ts           Home page and search box
|   `-- ProductListingPage.ts          Results page: filters, product cards, product details
|-- tests/
|   |-- AmazonAll.spec.ts              The actual test cases
|   `-- example.spec.ts                Playwright sample test (not part of this project)
|-- utils/
|   |-- CaptchaHandler.ts              Detects and clears captcha pages
|   |-- GenericUtility.ts              Shared helpers (waits, screenshots, 503 refresh)
|   `-- RunConfig.ts                   Decides how much each run covers
|-- playwright.config.ts               Runner configuration
|-- tsconfig.json                      TypeScript settings for the editor and type check
`-- package.json
```

## How the layers fit together

```
tests            what is being verified, in a few readable lines
  |
flows            multi-step journeys across pages and tabs, return plain results
  |
pages            locators and single-page actions
  |
utils            cross-cutting helpers: captcha, 503 recovery, screenshots, run sizing
```

Each layer only calls the layer below it.

- **Pages** hold locators and small actions. They contain no assertions.
- **Flows** combine page actions into a journey and return data. The brand flow returns one result per brand (brand name, whether it was valid, and the list of mismatches). The shared flow returns one result per product (the filter value and the scraped title, key features, about text and technical details).
- **Tests** call a flow, loop over the returned results, and assert with `expect.soft`.
- **Utils** contain behaviour that is not specific to one page.

## How a test runs, step by step

1. Open `https://www.amazon.in` and clear a captcha page if one appears.
2. Type "Mobile" into the search box and submit. If Amazon answers with a "Service Unavailable" page, reload.
3. Check that the filter exists in the left navigation. If it does not, the test logs a warning and ends without checking anything.
4. Read the filter's options. For brands, the flow first expands the "See more" list.
5. For each option (up to the limit set by the run mode):
   - Wait for the option list to be present, expand it again if the page collapsed it.
   - Apply the option.
   - Brand test: read all product titles and compare each with the brand.
   - Specification tests: open each product (up to the limit) in a new tab, wait for the product title, read the four detail sections, then close the tab.
   - Clear the filter.
6. Return the collected results to the test, which reports every mismatch through soft assertions.

## Controlling how much is tested

`utils/RunConfig.ts` decides how many filter options and products each run covers. It looks at the environment and picks one of two modes.

| Mode | When it is chosen | Filter options | Products per option |
|---|---|---|---|
| standard | Push, pull request, manual run, or any local run | First 5 | First 3 |
| cron | `GITHUB_EVENT_NAME=schedule`, or `IS_CRON=true` | First 3 | First 5 |

Each value can be overridden with an environment variable.

| Variable | Meaning |
|---|---|
| `IS_CRON` | `true` forces cron mode |
| `RUN_ALL_FILTER_OPTIONS` | `true` or `false` |
| `FILTER_OPTIONS_COUNT` | Cap on filter options when not running all |
| `RUN_ALL_PRODUCTS` | `true` or `false` |
| `PRODUCTS_COUNT` | Cap on products when not running all |

The cap never exceeds what the page actually shows. A page with three products and a cap of five opens three.

At the start of a run the log states the mode and the reason, and each limit calculation is logged:

```
[RunConfig] Run mode -> standard (GITHUB_EVENT_NAME=not set, IS_CRON=not set)
[RunConfig] Effective settings -> {"runAllFilterOptions":false,"filterOptionsCount":5,...}
[RunConfig] Filter options -> 20 available, capped at 5, will run 5
[RunConfig] Products -> 16 listed, capped at 5, will open 5
```

## Dealing with a site that pushes back

| Problem | What the project does |
|---|---|
| Captcha page ("Continue shopping") | `CaptchaHandler` detects it from the page text, the URL or the button, then clicks through with retries and backoff. |
| "Service Unavailable" / "It's rush hour" page | `refreshIfServiceUnavailable` checks the page content and title and reloads. |
| Automation fingerprint | The `navigator.webdriver` flag is overridden, and Chromium is launched with `--disable-blink-features=AutomationControlled`. |
| Rapid, repetitive requests | `slowMo` slows every action, which spreads requests out over time. |
| Two layouts for one page | The brand test uses the new-layout locators first and falls back to the old layout when none are found. |
| The option list collapsing after a clear or reload | The flow waits for the list and expands "See more" again before choosing the next option. |
| Brand names that do not appear in titles | Matching normalises case and punctuation and supports an alias map, for example `motorola -> moto` and `apple -> iphone`. |

None of this guarantees a clean run. See [Known limitations](#known-limitations).

## Reporting and debugging

- **HTML report.** `npx playwright show-report`.
- **Trace.** In CI a trace is recorded only when a failing test is retried for the first time (no screenshot filmstrip), because traces were by far the largest part of the artifacts. Locally the full trace is kept for failures and retries. Open one with `npx playwright show-trace <path-to-trace.zip>`, or from the failed test in the HTML report.
- **Video.** Recorded for every test.
- **Screenshots.** Captured at risky steps, and of a product tab that failed to load.
- **Logs.** Every message is prefixed with the test name. When a product page does not load, the warning includes the tab's URL and title, which tells you whether you got a product page, a captcha, or an error page.
- **Soft assertions.** A failing check does not stop the run. All mismatches are reported together, each with the filter value and the product details that were compared.

## Continuous integration

`.github/workflows/playwright.yml` defines the pipeline.

| Trigger | Behaviour |
|---|---|
| Push to `master` | standard mode |
| Pull request into `master` | standard mode |
| Weekly, Sundays at 21:00 UTC (Monday 02:30 IST) | cron mode (3 filter options, 5 products each) |
| Manual run | standard mode, or cron mode when the `full_run` box is ticked |

The pipeline has three stages:

1. **typecheck** runs `tsc` once. A type error stops the run before any browser starts.
2. **test** runs as four parallel jobs (shards). Playwright splits the tests between them, so each shard runs about a quarter of the suite on its own machine. Every shard installs Chromium, runs its share, and uploads one blob report, which carries its traces, screenshots and videos. A failing shard does not cancel the others.
3. **merge-reports** combines the four blob reports into the single HTML report, uploaded as the `playwright-report` artifact.

In CI each shard uses 2 workers by default (override with `PW_WORKERS`) and retries failing tests twice. The log shows live progress through the `list` reporter. For how tests are assigned to shards, how to choose which tests run on which machine, and every setting that affects run time, see [docs/ci-and-sharding.md](docs/ci-and-sharding.md).

## Getting started

### Prerequisites

- A current Node.js LTS release and npm.
- Git.

### Install

```bash
npm ci
npx playwright install chromium
```

### Run

```bash
# all tests
npx playwright test

# one test, by name
npx playwright test -g "brands"

# watch the browser
npx playwright test --headed

# interactive UI mode
npx playwright test --ui

# open the last report
npx playwright show-report

# type check only
npx tsc -p tsconfig.json
```

### Run in full-coverage mode locally

PowerShell:

```powershell
$env:IS_CRON = "true"; npx playwright test
```

Bash:

```bash
IS_CRON=true npx playwright test
```

### Run a larger sample without full coverage

```bash
FILTER_OPTIONS_COUNT=10 PRODUCTS_COUNT=8 npx playwright test
```

## Configuration reference

Settings in `playwright.config.ts`:

| Setting | Value | Why |
|---|---|---|
| `timeout` | 900 seconds | A test walks through many filters and opens many tabs, and `slowMo` adds a delay to every action. |
| `actionTimeout` | 15 seconds | A missing element fails with an error that names the locator instead of waiting for the whole test timeout. |
| `navigationTimeout` | 30 seconds | A stuck page load fails clearly. |
| `slowMo` | 1200 ms | Slows every action so the traffic looks less automated. |
| `fullyParallel` | true | Tests may run in parallel locally. |
| `retries` | 2 in CI, 0 locally | Absorbs transient failures in CI only. |
| `workers` | 2 per shard in CI (`PW_WORKERS`) | Matches the 2-CPU hosted runner; more workers would slow each test down and send more traffic from one address. |
| `trace` | CI: on the first retry, no screenshot filmstrip; local: on failure and retries | Debugging evidence without recording every pass. Traces were the largest artifact, several GB per run. |
| `video` | `retain-on-failure` in CI, `on` locally | Recording every test in CI made the blob reports large enough to fill the merge runner's disk. In CI only failed tests keep their video. |
| `headless` | true | Needed on CI. Use `--headed` to watch locally. |

## Adding a new filter test

1. Add a locator for the filter's options in `pages/ProductListingPage.ts` (for example `listFooOptionsBy`), and add a case for the new filter name in `getFilterByTypeAndName` and `getAppliedFilterByTypeAndName`.
2. Copy an existing specification test in `tests/AmazonAll.spec.ts`. Change the filter name passed to `filterCheckUnderList`, the locator passed to the flow, and the filter key string.
3. Run the test on its own with `npx playwright test -g "<name>"` and read the log lines that start with `[RunConfig]` to confirm it is covering what you expect.

The seven specification tests are nearly identical today. Turning them into one data-driven loop is a good next improvement.

## Known limitations

- **The target resists automation.** Amazon sometimes returns a "rush hour" page or a captcha, especially after many quick requests or from datacenter addresses such as CI runners. A run can fail or skip for reasons that have nothing to do with a filter bug.
- **Missing filters end a test as a pass.** If a filter does not appear in the left navigation, the test logs a warning and returns, and the report shows it as passed. Check the logs when a run is suspiciously fast.
- **Locators depend on Amazon's markup.** Many locators use class names and text. Amazon can change them at any time, and the suite will need updating.
- **Results depend on live data.** The products, filters and options change from run to run, so the sampled items differ each time.
- **Coverage is a sample in both modes.** Standard mode checks the first 5 filter options and 3 products, cron mode the first 3 and 5. Nothing runs every option unless the limits are raised with the environment variables.
- **Use the live site sparingly.** Respect Amazon's terms of use, and do not run the suite in a loop.
