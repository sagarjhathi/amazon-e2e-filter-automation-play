import { Locator, test, expect } from "@playwright/test";
import ProductListingPage from '../pages/ProductListingPage';
import AmazonLandingPage from "../pages/AmazonLandingPage";
import CaptchaHandler from "../utils/CaptchaHandler";
import GenericUtility from "../utils/GenericUtility"
import BrandFilterFlows from "../flows/BrandFilterFlows"

test('Verifying brands filter application', async ({ page }, testInfo) => {

  await page.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});

  let landingPage = new AmazonLandingPage(page);
  let capHandler = new CaptchaHandler(page);
  let productPage = new ProductListingPage(page);
  let genericUtility = new GenericUtility(page,testInfo);
  let brandFilterFlows = new BrandFilterFlows(page,testInfo);

  const testName: string = testInfo.title;
  
  await landingPage.openingLandingPage();
  await capHandler.handleCaptcha(page);
  await genericUtility.refreshIfServiceUnavailable();
  await landingPage.givingInputWithinSearchBar('Mobile');
  await landingPage.clickingOnSubmitSearchButton();
  
 

  if (!(await productPage.filterCheckUnderList("brands"))) {
    console.warn(`[${testName}] Filter option 'brands' does not exist in the list. Skipping the test.`);
    return;
  }

  let filterOptions: Locator[] = (await productPage.listBrandsOptionsByNew.all());
  console.log(`The filteroptions count is ${filterOptions.length}`);
  let allResults: Map<string, string | number | boolean | string[] | null>[];

  if (filterOptions.length == 0) {
    allResults = await brandFilterFlows.applyFilterAndValidateBrandsFilterWithResult(productPage.listBrandsOptionsByOld, "brandsold");
  } else {
    allResults = await brandFilterFlows.applyFilterAndValidateBrandsFilterWithResult(productPage.listBrandsOptionsByNew, "brands");
  }

  for (const result of allResults) {
    let isValid: boolean = result.get('isValid') as boolean;
    let brand: string = result.get("brand") as string;
    let mismatches: string[] = result.get("mismatches") as string[];

    if (!isValid) {
      console.error(`[${testName}] Brand validation failed for '${brand}'. ${mismatches.length} mismatches found.`);
      for (let detail of mismatches) {
        console.error(`[${testName}] Mismatch for '${brand}': ${detail}`);
        expect.soft(false, detail).toBeTruthy();
      }
    } else {
      console.log(`[${testName}] All product titles matched for brand: '${brand}'`);
    }
  }
});