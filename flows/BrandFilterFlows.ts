import { test , Locator, expect, Page, TestInfo } from "@playwright/test";
import ProductListingPage from "../pages/ProductListingPage";
import GenericUtility from "../utils/GenericUtility";


class BrandFilterFlows{

    private page:Page;

    private  productPage:ProductListingPage;

	  private  genericUtility:GenericUtility;
	

    private testInfo:TestInfo;
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
        this.testInfo=testInfo;
        this.productPage = new ProductListingPage(page);
        this.genericUtility = new GenericUtility(page,testInfo);
    }
	
	
	

	
	
	async applyFilterAndValidateBrandsFilterWithResult(filterOptionsBy: Locator, filterName: string): Promise<Map<string, string | number | boolean | null | string[]>[]> {
  console.log(`Within applyFilterAndValidateBrandsFilterWithResult method`);


  let filterOptions: Locator[] = await (filterOptionsBy.all());

  if (filterOptions.length === 0) {
    console.warn(`No filter options found for locator -> ${filterOptionsBy}`);
    return [];
  }

  let filterOptionSize: number = filterOptions.length;

  let runAll: boolean = false;
  if (runAll == false) {
    filterOptionSize = 10;
  }

  let allResults: Map<string, string | number | boolean | null | string[]>[] = [];

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
   //   continue;
    }

    let str: string = (await filterOptionsBy.nth(i).innerText()).trim();


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

    let productNameListingPage: Locator[] = await (this.productPage.productNameListingPageBy.all());

    let isValid: boolean = true;
    let mismatchDetails: string[] = [];

    if (productNameListingPage.length == 0) {
      isValid = false;
      mismatchDetails.push(`❌ No products found for brand '${str}' — filter may not have applied correctly`);
    } else {
      for (let k = 0; k < productNameListingPage.length; k++) {
    
        let title: string = await (productNameListingPage[k].innerText());

        let titleMatches: boolean = this.titleMatchesBrand(title, str);
        console.log(`Product index ${k} for brand '${str}' — title: '${title}', matches: ${titleMatches}`);

        if (!titleMatches) {
          isValid = false;
          mismatchDetails.push(`❌ Index: ${k}, Brand: ${str}, Title: '${title}'`);
          console.warn(`Brand mismatch — index ${k}, brand '${str}', title: '${title}'`);
        }
      }
    }

    let result: Map<string, string | number | boolean | null | string[]> = new Map<string, string | number | boolean | null | string[]>();
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