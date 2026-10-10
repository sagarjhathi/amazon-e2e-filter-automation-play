import { Locator, Page, TestInfo } from "@playwright/test";
import ProductListingPage from "../pages/ProductListingPage";
import GenericUtility from "../utils/GenericUtility";
import RunConfig from "../utils/RunConfig";


class BrandFilterFlows{

    private page:Page;

    private  productPage:ProductListingPage;

	  private  genericUtility:GenericUtility;
	

	// Titles often use a shortened form of the brand name (e.g. "Moto g06" for Motorola).
	private static readonly BRAND_ALIASES: Record<string, string[]> = {
		motorola: ["moto"],
		apple: ["iphone"],
	};

	private titleMatchesBrand(title: string, brand: string): boolean {
		const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, "");
		const normalizedTitle = normalize(title);

		if (normalizedTitle.includes(normalize(brand))) {
			return true;
		}

		const aliases: string[] = BrandFilterFlows.BRAND_ALIASES[brand.toLowerCase()] ?? [];
		return aliases.some((alias) => normalizedTitle.includes(normalize(alias)));
	}

	constructor(page:Page,testInfo:TestInfo) {
        this.page=page;
        this.productPage = new ProductListingPage(page);
        this.genericUtility = new GenericUtility(page,testInfo);
    }
	
	
	

	
	
	async applyFilterAndValidateBrandsFilterWithResult(filterOptionsBy: Locator, filterName: string): Promise<Map<string, string | number | boolean | null | string[]>[]> {
  console.log(`Within applyFilterAndValidateBrandsFilterWithResult method`);


  const filterOptions: Locator[] = await (filterOptionsBy.all());

  if (filterOptions.length === 0) {
    console.warn(`No filter options found for locator -> ${filterOptionsBy}`);
    return [];
  }

  const filterOptionSize: number = RunConfig.filterOptionLimit(filterOptions.length);

  const allResults: Map<string, string | number | boolean | null | string[]>[] = [];

  for (let i = 0; i < filterOptionSize; i++) {
    console.log(`Within the filterOptions loop — iteration ${i} of ${filterOptionSize}`);
    
    // After a clear/reload the brand list can take a moment to come back, so wait for it before counting
    try {
      await filterOptionsBy.first().waitFor({ state: 'visible', timeout: 10_000 });
    } catch (error) {
      console.warn(`Brand options did not reappear within 10s before iteration ${i}`);
    }

    // The list can come back collapsed, so expand it (no-op if already expanded) before counting
    await this.genericUtility.clickMoreButtonIfPresent(this.productPage.seeMoreButtonUnderBrandFilter);

    const liveCount: number = await filterOptionsBy.count();

    if (i >= liveCount) {
      console.log(`Avoiding out of bounds — index ${i} exceeds live list size ${liveCount}`);
      return allResults;
    }

    const str: string = (await filterOptionsBy.nth(i).innerText()).trim();


try {
  await this.productPage.getFilterByTypeAndName(filterName, str).click();
} catch (error) {
  console.warn(`Filter click failed for: ${str} — ${error}`);
  continue;
}


    console.log(`Clicked on ${str} within the filterOptions loop`);

    // Wait for the results to refresh with the brand applied before reading titles
    try {
      await this.productPage.getAppliedFilterByTypeAndName(filterName, str).first().waitFor({ state: 'visible', timeout: 10_000 });
      await this.productPage.productNameListingPageBy.first().waitFor({ state: 'visible', timeout: 10_000 });
    } catch (error) {
      console.warn(`Results did not refresh within 10s after applying '${str}'`);
    }

    const productNameListingPage: Locator[] = await (this.productPage.productNameListingPageBy.all());

    let isValid: boolean = true;
    const mismatchDetails: string[] = [];

    if (productNameListingPage.length == 0) {
      isValid = false;
      mismatchDetails.push(`❌ No products found for brand '${str}' — filter may not have applied correctly`);
    } else {
      for (let k = 0; k < productNameListingPage.length; k++) {
    
        const title: string = await (productNameListingPage[k].innerText());

        const titleMatches: boolean = this.titleMatchesBrand(title, str);
        console.log(`Product index ${k} for brand '${str}' — title: '${title}', matches: ${titleMatches}`);

        if (!titleMatches) {
          isValid = false;
          mismatchDetails.push(`❌ Index: ${k}, Brand: ${str}, Title: '${title}'`);
          console.warn(`Brand mismatch — index ${k}, brand '${str}', title: '${title}'`);
        }
      }
    }

    const result: Map<string, string | number | boolean | null | string[]> = new Map<string, string | number | boolean | null | string[]>();
    result.set("brand", str);
    result.set("isValid", isValid);
    result.set("mismatches", mismatchDetails);
    console.log(`Result for brand '${str}': isValid=${isValid}, mismatches=${mismatchDetails.length}`);

    allResults.push(result);
    console.log(`allResults now has ${allResults.length} brand(s) recorded`);

    try {
      if (await (this.productPage.clearButtonBy.isVisible())) {
        await (this.productPage.clearButtonBy.click());
        console.log(`Clicked clear button for the filter -> ${str}`);
      }
    } catch (error) {
      await this.page.reload();
      console.log(`Cannot click clear button hence navigating back to fresh page for filter -> ${str}`);
    }

    if (i % 10 == 0 && i != 0) {
      await this.page.reload();
      console.log(`Refreshing the page after 10 products to avoid storage issues for filter -> ${str}`);
    }
  }
  console.log(`Returning the allResults List of Maps containing the data`);

  return allResults;
}

}export default BrandFilterFlows;