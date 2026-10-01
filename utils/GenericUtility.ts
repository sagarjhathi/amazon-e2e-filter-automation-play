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


}
 export default GenericUtility;