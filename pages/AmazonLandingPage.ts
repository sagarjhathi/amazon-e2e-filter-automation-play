import { Locator, Page ,expect} from '@playwright/test';



class AmazonLandingPage{



    private page:Page;
	
	private searchBarLandingPage:Locator; 
	
	public amazonLogoLandingPage:Locator; 
		
	private submitSearchButton:Locator ;
		
    public continueShoppingButtonCaptcha:Locator;

    constructor(page:Page){
        this.page=page;
        this.searchBarLandingPage=page.locator("xpath=//input[@placeholder='Search Amazon.in']");
        this.amazonLogoLandingPage=page.locator("xpath=//a[@id='nav-logo-sprites']");
        this.submitSearchButton=page.locator("xpath=//input[@id='nav-search-submit-button']");
        this.continueShoppingButtonCaptcha=page.locator("//*[translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='continue shopping']");

    }



    async givingInputWithinSearchBar(input :string) {

        await this.searchBarLandingPage.click();		
		await this.searchBarLandingPage.fill(input);

	}
	
	
	
	async clickingOnSubmitSearchButton(){
        await this.submitSearchButton.click();
	}
	
	 async openingLandingPage() {
        await this.page.goto('https://www.amazon.in/ref=cs_503_link/');
	}



}
export default AmazonLandingPage;