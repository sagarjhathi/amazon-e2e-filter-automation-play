/**
 * Decides how much of each flow to run, based on what triggered the run.
 *
 *  - cron     : scheduled run (GitHub Actions `schedule`, or IS_CRON=true)  -> wider sample: 3 filter options, 5 products each
 *  - standard : push / pull request / local run                              -> small, fast sample
 *
 * Any value can be overridden per run with an environment variable (see ENV_KEYS below),
 * which is the replacement for the old properties-file keys.
 */

type RunMode = 'cron' | 'standard';

interface RunSettings {
  runAllFilterOptions: boolean;
  filterOptionsCount: number;
  runAllProducts: boolean;
  productsCount: number;
}

const DEFAULTS: Record<RunMode, RunSettings> = {
  standard: { runAllFilterOptions: false, filterOptionsCount: 5, runAllProducts: false, productsCount: 3 },
  cron:     { runAllFilterOptions: false, filterOptionsCount: 3, runAllProducts: false, productsCount: 5 },
};

const ENV_KEYS = {
  runAllFilterOptions: 'RUN_ALL_FILTER_OPTIONS',
  filterOptionsCount: 'FILTER_OPTIONS_COUNT',
  runAllProducts: 'RUN_ALL_PRODUCTS',
  productsCount: 'PRODUCTS_COUNT',
} as const;

function readBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  return raw === undefined || raw === '' ? fallback : raw.toLowerCase() === 'true';
}

function readInt(name: string, fallback: number): number {
  const parsed = parseInt(process.env[name] ?? '', 10);
  return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
}

class RunConfig {

  static readonly mode: RunMode =
    process.env.IS_CRON?.toLowerCase() === 'true' || process.env.GITHUB_EVENT_NAME === 'schedule'
      ? 'cron'
      : 'standard';

  private static readonly settings: RunSettings = {
    runAllFilterOptions: readBool(ENV_KEYS.runAllFilterOptions, DEFAULTS[RunConfig.mode].runAllFilterOptions),
    filterOptionsCount: readInt(ENV_KEYS.filterOptionsCount, DEFAULTS[RunConfig.mode].filterOptionsCount),
    runAllProducts: readBool(ENV_KEYS.runAllProducts, DEFAULTS[RunConfig.mode].runAllProducts),
    productsCount: readInt(ENV_KEYS.productsCount, DEFAULTS[RunConfig.mode].productsCount),
  };

  private static modeLogged: boolean = false;

  /** Logs how the mode was chosen and the effective settings, once per run. */
  private static logModeOnce(): void {
    if (RunConfig.modeLogged) {
      return;
    }
    RunConfig.modeLogged = true;
    console.log(
      `[RunConfig] Run mode -> ${RunConfig.mode} ` +
      `(GITHUB_EVENT_NAME=${process.env.GITHUB_EVENT_NAME ?? 'not set'}, IS_CRON=${process.env.IS_CRON ?? 'not set'})`
    );
    console.log(`[RunConfig] Effective settings -> ${JSON.stringify(RunConfig.settings)}`);
  }

  /** How many filter options (brands, storage sizes, ...) to walk through, given how many exist. */
  static filterOptionLimit(available: number): number {
    RunConfig.logModeOnce();
    const { runAllFilterOptions, filterOptionsCount } = RunConfig.settings;
    const limit: number = runAllFilterOptions ? available : Math.min(filterOptionsCount, available);
    console.log(
      `[RunConfig] Filter options -> ${available} available, ` +
      (runAllFilterOptions ? 'running all' : `capped at ${filterOptionsCount}`) +
      `, will run ${limit}`
    );
    return limit;
  }

  /** How many products to open under one applied filter, given how many are listed. */
  static productLimit(available: number): number {
    RunConfig.logModeOnce();
    const { runAllProducts, productsCount } = RunConfig.settings;
    const limit: number = runAllProducts ? available : Math.min(productsCount, available);
    console.log(
      `[RunConfig] Products -> ${available} listed, ` +
      (runAllProducts ? 'running all' : `capped at ${productsCount}`) +
      `, will open ${limit}`
    );
    return limit;
  }

  static describe(): string {
    return `mode=${RunConfig.mode}, ${JSON.stringify(RunConfig.settings)}`;
  }
}

export default RunConfig;
