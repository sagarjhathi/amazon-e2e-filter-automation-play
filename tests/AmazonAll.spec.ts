import { Locator, test, expect } from "@playwright/test";
import ProductListingPage from '../pages/ProductListingPage';
import AmazonLandingPage from "../pages/AmazonLandingPage";
import CaptchaHandler from "../utils/CaptchaHandler";
import GenericUtility from "../utils/GenericUtility"
import BrandFilterFlows from "../flows/BrandFilterFlows"
import SharedFilterFlows from "../flows/SharedFilterFlows";


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



test('verifyingStorageCapacityFilterFunctionality ', async ({ page }, testInfo) =>{
		
   await page.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});
		
		
  let landingPage = new AmazonLandingPage(page);
  let capHandler = new CaptchaHandler(page);
  let productPage = new ProductListingPage(page);
  let genericUtility = new GenericUtility(page,testInfo);
	let sharedFilterFlows = new SharedFilterFlows(page,testInfo);
  const testName: string = testInfo.title;

	
		await landingPage.openingLandingPage();
		await capHandler.handleCaptcha(page);
		await landingPage.givingInputWithinSearchBar('Mobile');
		await genericUtility.moveMouseLikeHuman();
		await landingPage.clickingOnSubmitSearchButton();
		await genericUtility.refreshIfServiceUnavailable();
		
		
		await genericUtility.moveMouseLikeHuman();
		if (!(await productPage.filterCheckUnderList("Storage Capacity"))) {
			console.warn(`[${testName}] Filter option 'Storage Capacity' does not exist in the list. Skipping the test.`);
			return ;
		}


		let results:Map<string,string | number |boolean |null |string[]>[] =await sharedFilterFlows.applyFilterAndValidateProductsWithResult(productPage.listStorageCapacityOptionsBy,"storagecapacity");
		console.log(`[${testName}] Retrieved ${results.length} results from applyFilterAndValidateProductsWithResult.`);
		

		for (const product of results) {
			let filter:string = genericUtility.safeLower(product.get("filter"));
    	let title:string = genericUtility.safeLower(product.get("title"));
      let keyFeatures:string = genericUtility.safeLower(product.get("keyFeatures"));
      let about :string= genericUtility.safeLower(product.get("about"));
    	let techDetails:string = genericUtility.safeLower(product.get("techDetails"));

    	    let isMatch:boolean = title.includes(filter)
    	                   || keyFeatures.includes(filter)
    	                   || about.includes(filter)
    	                   || techDetails.includes(filter);

			if (!isMatch) {

				console.error(`[${testName}] Mismatch found for filter '${filter}' on product '${title}'`);
				console.debug(`[${testName}] Key Features: ${keyFeatures}`);
				console.debug(`[${testName}] About: ${about}`);
				console.debug(`[${testName}] Tech Details: ${techDetails}`);


				const failureMessage: string =
					` filter '${filter}' not found in product details.\n` +
					`-------------------------------------------------------------\n` +
					` Title: ${title}\n` +
					` Key Features: ${keyFeatures}\n` +
					` About: ${about}\n` +
					` Tech Details: ${techDetails}\n` +
					`-------------------------------------------------------------`;

				 expect.soft(false, failureMessage).toBeTruthy();
			} else {
				console.log(`[${testName}] Filter '${filter}' matched in at least one section of product details.`);
			}
		}


	});



test('verifyingBatteryCapacityFilterFunctionality ', async ({ page }, testInfo) =>{

		 await page.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});
		
		
  let landingPage = new AmazonLandingPage(page);
  let capHandler = new CaptchaHandler(page);
  let productPage = new ProductListingPage(page);
  let genericUtility = new GenericUtility(page,testInfo);
	let sharedFilterFlows = new SharedFilterFlows(page,testInfo);
  const testName: string = testInfo.title;

	
		await landingPage.openingLandingPage();
		await capHandler.handleCaptcha(page);
		await landingPage.givingInputWithinSearchBar('Mobile');
		await genericUtility.moveMouseLikeHuman();
		await landingPage.clickingOnSubmitSearchButton();
		await genericUtility.refreshIfServiceUnavailable();

	
    await genericUtility.moveMouseLikeHuman();
		if (!(await productPage.filterCheckUnderList("Battery Capacity"))) {
			console.warn(`[${testName}] Filter option 'Battery Capacity' does not exist in the list. Skipping the test.`);
			return ;
		}

		let results:Map<string,string | number |boolean |null |string[]>[] =await sharedFilterFlows.applyFilterAndValidateProductsWithResult(productPage.listBatteryCapacityOptionsBy,"batterycapacity");




		if(results.length==0) {
			 expect(results.length>0);
		}
		

    		console.log(`[${testName}] Retrieved ${results.length} results from applyFilterAndValidateProductsWithResult.`);
		

		for (const product of results) {
			let filter:string = genericUtility.safeLower(product.get("filter"));
    	let title:string = genericUtility.safeLower(product.get("title"));
      let keyFeatures:string = genericUtility.safeLower(product.get("keyFeatures"));
      let about :string= genericUtility.safeLower(product.get("about"));
    	let techDetails:string = genericUtility.safeLower(product.get("techDetails"));

    	    let isMatch:boolean = title.includes(filter)
    	                   || keyFeatures.includes(filter)
    	                   || about.includes(filter)
    	                   || techDetails.includes(filter);

			if (!isMatch) {

				console.error(`[${testName}] Mismatch found for filter '${filter}' on product '${title}'`);
				console.debug(`[${testName}] Key Features: ${keyFeatures}`);
				console.debug(`[${testName}] About: ${about}`);
				console.debug(`[${testName}] Tech Details: ${techDetails}`);


				const failureMessage: string =
					` filter '${filter}' not found in product details.\n` +
					`-------------------------------------------------------------\n` +
					` Title: ${title}\n` +
					` Key Features: ${keyFeatures}\n` +
					` About: ${about}\n` +
					` Tech Details: ${techDetails}\n` +
					`-------------------------------------------------------------`;

				 expect.soft(false, failureMessage).toBeTruthy();
			} else {
				console.log(`[${testName}] Filter '${filter}' matched in at least one section of product details.`);
			}
		}

});