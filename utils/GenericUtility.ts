import { Page ,Locator, TestInfo} from '@playwright/test';
import ProductListingPage from '../pages/ProductListingPage';


class GenericUtility{


  private page:Page;
  private testInfo:TestInfo;
  private productListingPage: ProductListingPage;

 constructor(page: Page, testInfo: TestInfo) {
  this.page = page;
  this.testInfo = testInfo;
  this.productListingPage = new ProductListingPage(page);
}


    


  
async refreshIfServiceUnavailable() {

	   let  pageSource:string = (await this.page.content()).toString().toLowerCase();
	    let title :string =  (await this.page.title()).toLowerCase();

	    if (pageSource.includes("service unavailable") ||
	        pageSource.includes("it's rush hour") ||
	        title.includes("service unavailable") ||
	        title.includes("oops")) {

              let LinkBbuttons503Error:Locator[]=await this.page.locator("//a[translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='go to the amazon.in home page to continue shopping']").all();

            // if(LinkBbuttons503Error.length>0){
            //   LinkBbuttons503Error[0].click();
            // }
	        await  this.page.reload();
	    }
	}


     async scrollByPixel(x:number,  y:number) {
    	
		await this.page.mouse.wheel(x,y);
        
    }



    
    async smoothScrollToElement(locator :Locator) {

await locator.evaluate((element) => {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
});        
    
    }    



async openAndGetNewTab(triggerAction: () => Promise<void>): Promise<Page> {
  const context = this.page.context();
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    triggerAction(),
  ]);
  return newPage;
}   


async fetchTextWithRetries(locator: Locator): Promise<string> {
  const max = 2;

  for (let i = 0; i < max; i++) {
    try {
      const text: string = (await locator.innerText()).trim();
      if (text.length > 0) {
        return text;
      }
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed while fetching text: ${error}`);
    }
  }

  return ""; // all retries exhausted, nothing non-empty found — matches original Java behavior
}


async setSliderValue(locator: Locator, value: number): Promise<void> {
  await locator.evaluate((element, val) => {
    (element as HTMLInputElement).value = val.toString();
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}
	


 static extractPriceOrFail(input: string | null): string {
    if (input === null) {
      throw new Error("Cannot extract price: input is null");
    }

    let cleaned = input.replace(/[^0-9.]/g, "");

    // Keep only the first decimal point in case stray "." characters slipped through.
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1) {
      cleaned =
        cleaned.substring(0, firstDot + 1) +
        cleaned.substring(firstDot + 1).replace(/\./g, "");
    }

    if (cleaned.length === 0 || cleaned === ".") {
      throw new Error(`Cannot extract price: no digits found in input '${input}'`);
    }

    return cleaned;
  }



 async clickMoreButtonIfPresent(moreButton: Locator): Promise<void> {
  try {
    if (await moreButton.isVisible()) {
      await this.smoothScrollToElement(moreButton);
      await moreButton.click();
    }
    // else: button isn't present — nothing to do, this is a normal, expected outcome
  } catch (error) {
    console.warn(`Unexpected error while clicking the 'more' button: ${error}`);
  }
}

    async openClickOnNewPage(element: Locator): Promise<boolean> {
  const context = this.page.context();
  const beforeCount = context.pages().length;

  try {
    await this.page.keyboard.down('Control');
    await element.click();
    await this.page.keyboard.up('Control');

    if (context.pages().length > beforeCount) {
      return true;
    }
    return false;

  } catch (error) {
    try {
      await element.click();
      if (context.pages().length > beforeCount) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}




  addFieldIfPresent(key :string,value :string, filterValue :string, productIndex :number, result: Map<string, string | number | boolean | null> ):void {


	 if (value.trim().length>0) {
		 result.set(key, value);
	 } else {
		 result.set(key, null);  
    console.warn(
  `Failed to fetch '${key}' for filter value -> ${filterValue} and index -> ${productIndex}`
);
	 }  

}





 /*
global String() function, which already handles 
converting every type to a string correctly — so manually 
narrowing each type yourself would just be re-implementing what 
String() already does, with more code for no extra benefit.
 */
  safeLower(value: unknown): string {
  if (value == null) return "";
  return String(value).toLowerCase();
}





	containsCheck(toBeChecked: string, toBeCheckedIn: string): boolean {

  let list: string[] = toBeChecked.split(/\s+/);

  let bool: boolean = true;
  for (let i = 0; i < list.length; i++) {
    let str: string = list[i];

    if (toBeCheckedIn.includes(str)) {
      console.warn(`Text present in containsCheck method, text checked is "${str}"`);
    } else {
      bool = false;
      console.warn(`Text NOT present in containsCheck method, text checked is "${str}"`);
    }
  }

  return bool;
}




// async safeClickBooleanWithScreenShot(locatorr: Locator, filterName: string, filterOption: string): Promise<boolean> {
//   console.log(`Within safeClickBooleanWithScreenShot method`);

//   let filterOptionToPass: string = filterOption;

//   let attempts: number = 0;
//   while (attempts < 3) {
//     try {
//       const count = await this.page.locator('//ul[@id=\'filter-p_123\']//span[@class=\'a-size-base a-color-base\']').filter({ hasText: 'Samsung' }).count();
// console.log(`Matched count: ${count}`);
//       await this.smoothScrollToElement(this.productListingPage.getFilterByTypeAndName(filterName,filterOption));
                                                                
//       try {
//         await this.clickMoreButtonIfPresent(this.productListingPage.getMoreButtonByFilterTypeAndName(filterName));
//       } catch (error) {
//         console.error(`Actual error: ${error}`);
//         console.log(`Could not find more button`);
//       }

//       let element: Locator = locatorr;
//       const countt = await this.page.locator('//ul[@id=\'filter-p_123\']//span[@class=\'a-size-base a-color-base\']').filter({ hasText: 'Samsung' }).count();
// console.log(`Matched count: ${count}`);
//       await element.click();
//        return true; // success
      
//       await this.smoothScrollToElement(this.productListingPage.getFilterByTypeAndName(filterName,filterOption));

//       try {
//         await this.clickMoreButtonIfPresent(this.productListingPage.getMoreButtonByFilterTypeAndName(filterName));
//       } catch (error) {
//         console.error(`Actual error: ${error}`);
//         console.log(`Could not find more button`);
//       }

//       await this.smoothScrollToElement(this.productListingPage.getAppliedFilterByTypeAndName(filterName, filterOption));
//        return true; // success
//       console.log(`Clicked the element using safe click, element is ${element}`);
//       await this.capture(this.testInfo, filterOptionToPass);
     
//     } catch (error) {
//       console.error(`Actual error: ${error}`);
//       console.log(`Retrying click for: ${locatorr} - Attempt ${attempts + 1}`);
//       attempts++;

//       try {
//         await this.page.reload();

//         console.log(`Cannot apply filter, taking failed screenshot for -> ${filterOption}`);
//         await this.smoothScrollToElement(this.productListingPage.getFilterByTypeAndName(filterName,filterOption));

//         try {
//           await this.clickMoreButtonIfPresent(this.productListingPage.getMoreButtonByFilterTypeAndName(filterName));
//         } catch (error) {
//           console.error(`Actual error: ${error}`);
//           console.log(`Could not find more button`);
//         }

//         await this.capture(this.testInfo, filterOptionToPass, "failed filter apply screenshot-");

//         console.log(`Refreshing the page, while trying to click -> ${locatorr}`);
//       } catch (error) {
//         console.error(`Actual error: ${error}`);
//       }
//     }
//   }

//   console.log(`Skipping click action: Element not clickable after ${attempts} attempts - ${locatorr}`);
//   return false;
// }




async safeClickBooleanWithScreenShot(locatorr: Locator, filterName: string, filterOption: string): Promise<boolean> {
  console.log(`Within safeClickBooleanWithScreenShot method`);

  let attempts: number = 0;
  while (attempts < 3) {
    try {
      await this.smoothScrollToElement(this.productListingPage.getFilterByTypeAndName(filterName, filterOption));

      try {
        await this.clickMoreButtonIfPresent(this.productListingPage.getMoreButtonByFilterTypeAndName(filterName));
      } catch (error) {
        console.log(`Could not find more button`);
      }

      await locatorr.click();

      console.log(`Clicked the element using safe click, element is ${locatorr}`);
      await this.capture(this.testInfo, filterOption);

      return true; // success
    } catch (error) {
      console.error(`Actual error: ${error}`);
      console.log(`Retrying click for: ${locatorr} - Attempt ${attempts + 1}`);
      attempts++;

      try {
        await this.page.reload();

        await this.smoothScrollToElement(this.productListingPage.getFilterByTypeAndName(filterName, filterOption));

        try {
          await this.clickMoreButtonIfPresent(this.productListingPage.getMoreButtonByFilterTypeAndName(filterName));
        } catch (error) {
          console.log(`Could not find more button`);
        }

        await this.capture(this.testInfo, filterOption, "failed filter apply screenshot-");

        console.log(`Refreshing the page, while trying to click -> ${locatorr}`);
      } catch (error) {
        console.error(`Actual error: ${error}`);
      }
    }
  }

  console.log(`Skipping click action: Element not clickable after ${attempts} attempts - ${locatorr}`);
  return false;
}



        async capture(testInfo: TestInfo, ...names: string[]): Promise<string> {
  try {
    const inputNames = names.join("_");
    const fileName = `${inputNames || "screenshot"}_${Date.now()}.png`;
    const filePath = testInfo.outputPath(fileName);

    await this.page.screenshot({ path: filePath });

    return filePath;
  } catch (error) {
    console.error(`Screenshot capture failed: ${error}`);
    return "";
  }
}

}
 export default GenericUtility;