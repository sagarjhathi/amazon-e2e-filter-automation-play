import { Page ,Locator} from '@playwright/test';
import ProductListingPage from '../pages/ProductListingPage';


class GenericUtility{



    private productListingPage: ProductListingPage;

  constructor(page: Page) {
    this.productListingPage = new ProductListingPage(page);
  }


    



} export default GenericUtility;