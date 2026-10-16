/**
 * Decides how much each test covers: how many filter options to try, and how many products to open under each.
 *
 * Each setting is either a number (a cap) or 'all' (however many the page shows).
 * The defaults depend on what started the run:
 *
 *                      filter options   products
 *   standard           5                3          push, pull request, manual run, local run
 *   cron               all              5          scheduled run, or IS_CRON=true
 *
 * Override either setting for one run with an environment variable, using a number or "all":
 *
 *   FILTER_OPTIONS=all       PRODUCTS=2
 */

type Limit = number | 'all';

const DEFAULTS = {
  standard: { filterOptions: 5, products: 3 },
  cron: { filterOptions: 'all', products: 5 },
} satisfies Record<string, Record<string, Limit>>;

const mode: keyof typeof DEFAULTS =
  process.env.IS_CRON?.toLowerCase() === 'true' || process.env.GITHUB_EVENT_NAME === 'schedule' ? 'cron' : 'standard';

/** The environment variable if it holds "all" or a number, otherwise the default for this mode. */
function readLimit(envName: string, fallback: Limit): Limit {
  const raw = (process.env[envName] ?? '').trim().toLowerCase();
  if (raw === 'all') {
    return 'all';
  }
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
}

const filterOptions: Limit = readLimit('FILTER_OPTIONS', DEFAULTS[mode].filterOptions);
const products: Limit = readLimit('PRODUCTS', DEFAULTS[mode].products);

let logged = false;

/** How many of `available` to use under `setting`, and a log line that says why. */
function resolve(what: string, available: number, setting: Limit): number {
  if (!logged) {
    logged = true;
    console.log(
      `[RunConfig] Mode -> ${mode} (GITHUB_EVENT_NAME=${process.env.GITHUB_EVENT_NAME ?? 'not set'}, IS_CRON=${process.env.IS_CRON ?? 'not set'}); ` +
      `filter options = ${filterOptions}, products = ${products}`
    );
  }
  const limit = setting === 'all' ? available : Math.min(setting, available);
  console.log(`[RunConfig] ${what} -> ${available} available, setting is ${setting}, using ${limit}`);
  return limit;
}

class RunConfig {
  /** How many filter options (brands, storage sizes, ...) to walk through, given how many exist. */
  static filterOptionLimit(available: number): number {
    return resolve('Filter options', available, filterOptions);
  }

  /** How many products to open under one applied filter, given how many are listed. */
  static productLimit(available: number): number {
    return resolve('Products', available, products);
  }
}

export default RunConfig;
