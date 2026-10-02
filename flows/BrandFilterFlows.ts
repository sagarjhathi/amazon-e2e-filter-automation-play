import { test , Locator, expect, Page } from "@playwright/test";
import ProductListingPage from "../pages/ProductListingPage";
import GenericUtility from "../utils/GenericUtility";


class BrandFilterFlows{

    private page:Page;

    private  productPage:ProductListingPage;

	private  genericUtility:GenericUtility;
	
	constructor(page:Page) {
        this.page=page;
        this.productPage = new ProductListingPage(page);
        this.genericUtility = new GenericUtility(page);
    }
	
	
	

	
	
	async applyFilterAndValidateBrandsFilterWithResult(filterOptionsBy: Locator, filterName: string): Promise<Map<string, string | number | boolean | null | string[]>[]> {
  console.log(`Within applyFilterAndValidateBrandsFilterWithResult method`);

  console.log(`Scrolling to the 'More' Button under brands filter section`);

  await this.genericUtility.clickMoreButtonIfPresent(this.productPage.seeMoreButtonUnderBrandFilter);

  console.log(`Clicked the 'More' Button under brands filter section`);

  let filterOptions: Locator[] = await (filterOptionsBy.all());

  if (filterOptions.length === 0) {
    console.warn(`No filter options found for locator -> ${filterOptionsBy}`);
    return [];
  }

  let filterOptionSize: number = filterOptions.length;

  let runAll: boolean = false;
  if (runAll == false) {
    filterOptionSize = 3;
  }

  let allResults: Map<string, string | number | boolean | null | string[]>[] = [];

  for (let i = 0; i <= filterOptionSize - 1; i++) {
    console.log(`Within the filterOptions loop — iteration ${i} of ${filterOptionSize}`);

    let inloopParent: Locator[] = await (filterOptionsBy.all());

    if (i > inloopParent.length - 1) {
      console.log(`Avoiding out of bounds — index ${i} exceeds live list size ${inloopParent.length}`);
      continue;
    }

    await this.genericUtility.clickMoreButtonIfPresent(this.productPage.seeMoreButtonUnderBrandFilter);

    inloopParent = await (filterOptionsBy.all());

    if (i > inloopParent.length - 1) {
      console.log(`Avoiding out of bounds — index ${i} exceeds live list size ${inloopParent.length}`);
      continue;
    }

    let str: string = (await inloopParent[i].innerText()).trim();

    if (await this.genericUtility.safeClickBooleanWithScreenShot(this.productPage.getFilterByTypeAndName(filterName, str), filterName, str) == false) {
      console.log(`Filter click failed for: ${str}`);
      continue;
    }

    console.log(`Clicked on ${str} within the filterOptions loop`);

    let productNameListingPage: Locator[] = await (this.productPage.productNameListingPageBy.all());

    let isValid: boolean = true;
    let mismatchDetails: string[] = [];

    if (productNameListingPage.length == 0) {
      isValid = false;
      mismatchDetails.push(`❌ No products found for brand '${str}' — filter may not have applied correctly`);
    } else {
      for (let k = 0; k < productNameListingPage.length; k++) {
        let title: string = await (productNameListingPage[k].innerText());

        let titleMatches: boolean = title.toLowerCase().includes(str.toLowerCase());
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