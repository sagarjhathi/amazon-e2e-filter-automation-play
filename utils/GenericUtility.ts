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


} export default GenericUtility;