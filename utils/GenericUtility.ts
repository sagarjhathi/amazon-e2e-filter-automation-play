import { Page ,Locator} from '@playwright/test';
import ProductListingPage from '../pages/ProductListingPage';


class GenericUtility{



    private productListingPage: ProductListingPage;

  constructor(page: Page) {
    this.productListingPage = new ProductListingPage(page);
  }


    public async filterCheckUnderList(filterName: string): Promise<boolean> {

    const target = filterName.trim().toLowerCase();

    const filterCount = await this.productListingPage.listOfFilterNameInLeftNav.count();

    for (let i = 0; i < filterCount; i++) {

        const filterText = (
            await this.productListingPage.listOfFilterNameInLeftNav.nth(i).innerText()
        ).trim().toLowerCase();

        if (filterText === target) {
            console.log(`${filterName} matches with assert text here`);
            console.log('Found the Filter within the filter check List');

            return true;
        }
    }

    console.log(
        `Filter option '${filterName}' does not exist in the list. Skipping the test.`
    );

    return false;
}



} export default GenericUtility;