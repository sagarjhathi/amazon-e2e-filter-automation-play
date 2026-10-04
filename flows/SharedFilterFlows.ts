import { Locator, Page, TestInfo } from "@playwright/test";
import ProductListingPage from "../pages/ProductListingPage";
import GenericUtility from "../utils/GenericUtility";
import RunConfig from "../utils/RunConfig";

class SharedFilterFlows {

	private genericUtility:GenericUtility;
	private productPage :ProductListingPage;
    private testInfo:TestInfo;

	 constructor(page:Page,testInfo:TestInfo) {
        this.testInfo=testInfo;
		this.productPage= new ProductListingPage(page);
		this.genericUtility = new GenericUtility(page,testInfo);
	}


	async applyFilterAndValidateProductsWithResult(filterOptionsBy :Locator, filterName :string) :Promise<Map<string, string | number | boolean | null | string[]>[]> {

		const testName: string = this.testInfo.title;

		console.log(`[${testName}] Within applyFilterAndValidateProductsWithResult method`);



		let filterOptions : Locator[] = await(filterOptionsBy.all());
		let results:Map<string, string | number | boolean | null | string[]>[] =[];

		if (filterOptions.length==0) {
			console.warn(`[${testName}] No filter options found for locator -> ${filterOptionsBy}`);
			return results;
		}

		console.log(`[${testName}] Within applyFilterAndValidateProductsWithResult filterOptions size is -> ${filterOptions.length}`);




		const filterOptionSize :number = RunConfig.filterOptionLimit(filterOptions.length);



		for (let filterOption = 0; filterOption <filterOptionSize; filterOption++) {

			console.log(`[${testName}] Within filterOptions loop in applyFilterAndValidateProductsWithResult`);

			let inloopParent :Locator[] = await(filterOptionsBy.all());
			if ( filterOption > inloopParent.length - 1) {
				console.log(`[${testName}] Avoiding out of bounds issue by traversing only up to the in-loop size in applyFilterAndValidateProductsWithResult`);
				return results;
			}

			let filterValue :string =  (await filterOptionsBy.nth(filterOption).innerText()).trim();


            try {
  await this.genericUtility.moveMouseLikeHuman(this.productPage.getFilterByTypeAndName(filterName, filterValue).first());
  await this.productPage.getFilterByTypeAndName(filterName, filterValue).click();
  await this.genericUtility.smoothScrollToElement(this.productPage.getAppliedFilterByTypeAndName(filterName,filterValue));
  await this.genericUtility.capture(this.testInfo);
} catch (error) {
  console.warn(`[${testName}] Filter click failed for: ${filterValue} — ${error}`);
  continue;
}




			let productNameListingPage :Locator[] = await (this.productPage.productNameListingPageBy.all());
			let productNameListingPageSize = RunConfig.productLimit(productNameListingPage.length);







			for (let productIndex = 0; productIndex <productNameListingPageSize; productIndex++) {



				productNameListingPage=await(this.productPage.productNameListingPageBy.all());

				if (productIndex >= productNameListingPage.length) {
				    break;
				}
				console.log(`[${testName}] Within productNameListingPage loop in applyFilterAndValidateProductsWithResult`);
				console.log(`[${testName}] Inside the loop and product name is ${await productNameListingPage[productIndex].innerText()}`);

				let productResult :Map<string,string | number |boolean |null |string[]> = await this.applyFilterOptionsAndFetchProductDetailsGlobal(productIndex, filterValue);
				console.log(`[${testName}] Added 'filter','title','keyFeatures', 'about', 'techDetails' into the Map -> productResult`);

				results.push(productResult);
				console.log(`[${testName}] Added 'productResult' Map into the 'results' i.e list of maps`);
				console.log(`[${testName}] ==========================================================================================================`);

			}

			await this.genericUtility.moveMouseLikeHuman();
			await (this.productPage.clearButtonBy.click());
			console.log(`[${testName}] Clearing the filter value -> ${filterValue} within productNameListingPage loop`);

			console.log(`[${testName}] ==========================================================================================================`);
			console.log(`[${testName}] ==========================================================================================================`);

		}
		console.log(`[${testName}] Returning the 'results' i.e list of Maps`);
		return results;
}




	async applyFilterOptionsAndFetchProductDetailsGlobal(

		    productIndex :number,
		    filterValue :string,


		 ) :Promise<Map<string,string |number |boolean |null |string[]>>{


	const testName: string = this.testInfo.title;



 let productResult: Map<string,string |number |boolean |null |string[]> = new Map<string,string |number |boolean |null |string[]>();
 productResult.set("filter", filterValue);
 let page2 :Page | undefined;
try {

	let productElement :Locator = this.productPage.getProductByIndex(productIndex);
	await this.genericUtility.smoothScrollToElement(productElement);
	console.log(`[${testName}] Getting product by index in productNameListingPage loop`);

    page2 = await this.genericUtility.openAndGetNewTab(() => productElement.click());

	await this.genericUtility.moveMouseLikeHuman(productElement);


} catch (error) {
	console.warn(`[${testName}] Failed to open product index ${productIndex} for filter value -> ${filterValue} — ${error}`);
}

console.log(`[${testName}] Clicked on the product name, new tab should open`);

// No new tab means the click failed above, so there is nothing to scrape or close.
if (!page2) {
	console.warn(`[${testName}] No product tab opened for index ${productIndex} filter '${filterValue}'; skipping detail scrape`);
	return productResult;
}

// Locators are bound to the page they were created with, so the product tab needs its own page objects.
const detailPage = new ProductListingPage(page2);
const detailUtility = new GenericUtility(page2, this.testInfo);

let productPageLoaded :boolean = false;
try {
	await detailPage.productNameIndividualPage.waitFor({ state: 'visible', timeout: 10_000 });
	productPageLoaded = true;
	await detailUtility.moveMouseLikeHuman();
} catch (error) {
	console.warn(`[${testName}] Product detail page did not load for index ${productIndex} filter '${filterValue}' (tab url: ${page2.url()}, title: '${await page2.title()}'); skipping detail scrape to avoid redundant retries/timeouts`);
	await detailUtility.capture(this.testInfo, "detail-page-not-loaded", filterValue, String(productIndex));
}

let name :string ="";
try {
if (productPageLoaded) {
name = await detailUtility.fetchTextWithRetries(detailPage.productNameIndividualPage);
let keyFeatures :string= await detailUtility.fetchTextWithRetries(detailPage.productKeyFeatureBlock);
let about :string = await detailUtility.fetchTextWithRetries(detailPage.aboutThisItemBulletPoint);
let techDetails :string = await detailUtility.fetchTextWithRetries(detailPage.technicalDetailsBlockIndividualPage);

await this.genericUtility.addFieldIfPresent("title",name ,filterValue,productIndex,productResult);
await this.genericUtility.addFieldIfPresent("keyFeatures",keyFeatures ,filterValue,productIndex,productResult);
await this.genericUtility.addFieldIfPresent("about",about ,filterValue,productIndex,productResult);
await this.genericUtility.addFieldIfPresent("techDetails",techDetails ,filterValue,productIndex,productResult);
console.log(`[${testName}] Extracting 'name', 'keyFeatures', 'about', 'techDetails' within productNameListingPage loop`);
}

}catch(error) {
	console.warn(`[${testName}] Something went wrong while switching or extracting the details — ${error}`);

}


try {
	if (productPageLoaded) {
	
	if(! await (detailPage.seeMoreProductDetailsButtonIndividualPageBy).isVisible()){
		await detailUtility.smoothScrollToElement(detailPage.seeMoreProductDetailsButtonIndividualPageBy);
		await detailPage.seeMoreProductDetailsButtonIndividualPageBy.click();
     }
	 else {
		 if(await detailPage.showMoreOnlyIndividualPage.isVisible()) {
         await	detailUtility.smoothScrollToElement(detailPage.reportAnIssue);
	      }
       }
	}

} catch (error) {

	    if(await detailPage.showMoreOnlyIndividualPage.isVisible()) {
         await	detailUtility.smoothScrollToElement(detailPage.reportAnIssue);
	    }

	await detailUtility.capture(this.testInfo);
	console.warn(`[${testName}] Within catch block, cannot click 'see more details' hence taking a screenshot of the available button on the UI — ${error}`);
	console.log(`[${testName}] Within catch block for clicking 'see more details' within productNameListingPage loop`);

}finally {

    await page2.close();
	console.log(`[${testName}] Closed the product tab and going back to the product listing`);

}


 return  productResult;


 }


}export default SharedFilterFlows;
