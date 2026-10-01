import { Locator, Page ,expect} from '@playwright/test';



class AmazonLandingPage{



    private page:Page;
	
	private searchBarLandingPage:Locator; 
	
	private amazonLogoLandingPage:Locator; 
		
	private submitSearchButton:Locator ;
		

    constructor(page:Page){
        this.page=page;
        this.searchBarLandingPage=page.locator("xpath=//input[@placeholder='Search Amazon.in']");
        this.amazonLogoLandingPage=page.locator("xpath=//a[@id='nav-logo-sprites']");
        this.submitSearchButton=page.locator("xpath=//input[@id='nav-search-submit-button']");

    }



    async givingInputWithinSearchBar(input :string) {

        await this.searchBarLandingPage.click();		
		await this.searchBarLandingPage.fill(input);

	}
	
	
	
	async clickingOnSubmitSearchButton(){
        await this.submitSearchButton.click();
	}
	
	 async openingLandingPage() {
        await this.page.goto('https://www.amazon.in/');
	}



}
export default AmazonLandingPage;