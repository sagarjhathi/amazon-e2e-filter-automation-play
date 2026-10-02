import { Page ,Locator} from '@playwright/test';
import ProductListingPage from '../pages/ProductListingPage';


class GenericUtility{


  private page:Page;
  private productListingPage: ProductListingPage;

  constructor(page: Page) {
    this.page=page;
    this.productListingPage = new ProductListingPage(page);
  }


    


  
async refreshIfServiceUnavailable() {
	   let  pageSource:string = (await this.page.content()).toString().toLowerCase();
	    let title :string =  (await this.page.title()).toLowerCase();

	    if (pageSource.includes("service unavailable") ||
	        pageSource.includes("it's rush hour") ||
	        title.includes("service unavailable") ||
	        title.includes("oops")) {

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


}
 export default GenericUtility;