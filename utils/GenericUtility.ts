import { Page ,Locator} from '@playwright/test';
import ProductListingPage from '../pages/ProductListingPage';


class GenericUtility extends ProductListingPage{




    public async filterCheckUnderList(filterName: string): Promise<boolean> {

    const target = filterName.trim().toLowerCase();

    const filterCount = await this.listOfFilterNameInLeftNav.count();

    for (let i = 0; i < filterCount; i++) {

        const filterText = (
            await this.listOfFilterNameInLeftNav.nth(i).innerText()
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



}