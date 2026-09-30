import { Locator, Page ,expect} from '@playwright/test';

class ProductListingPage {

    private page: Page;

    private productNameListingPage: Locator;
    private productPriceListingPage: Locator;
    private productDeliveryDayListingPage: Locator;

    public listOfFilterNameInLeftNav: Locator;

    public listProcessorSpeedOptionsBy: Locator;
    public listBrandsOptionsByNew: Locator;
    public listBrandsOptionsByOld: Locator;
    public listDisplaySizeOptionsBy: Locator;
    public listDisplayTypeOptionsBy: Locator;
    public listDiscountOptionsBy: Locator;
    public listBatteryCapacityOptionsBy: Locator;
    public listStorageCapacityOptionsBy: Locator;
    public listDeliveryDayOptionsBy: Locator;
    public listMobilePhonePrimaryCameraResolutionOptionsBy: Locator;
    public listOperatingSystemVersionOptionsBy: Locator;

    public getItByTomorrowUnderDeliveryDayFilterBy: Locator;
    public getItInTwoDaysUnderDeliveryDayFilterBy: Locator;
    public eligibleForFreeDelivery: Locator;
    public getItTodayUnderDeliveryDayFilterBy: Locator;

    public seeMoreButtonUnderOperatingSystemFilter: Locator;
    public seeMoreButtonUnderBrandFilter: Locator;

    public listProductCardsBy: Locator;

    public priceMinSliderButton: Locator;
    public priceMaxSliderButton: Locator;
    public priceSliderSubmitButton: Locator;

    public maxPriceFilterApplied: Locator;
    public minPriceFilterApplied: Locator;

    public productPriceFromProductCards: Locator;
    public productNameListingPageBy: Locator;
    public productNameIndividualPage: Locator;

    public productKeyFeatureBlock: Locator;
    public aboutThisItemBulletPoint: Locator;
    public technicalDetailsBlockIndividualPage: Locator;

    public seeMoreProductDetailsButtonIndividualPageBy: Locator;

    public clearButtonBy: Locator;

    public seeMoreButtonIndividualPage: Locator;

    public reportAnIssue: Locator;

    public showMoreOnlyIndividualPage: Locator;

    public resetPriceRangeProductPage: Locator;


    constructor(page: Page) {

        this.page = page;

        this.productNameListingPage =
            page.locator("//div[@data-cy='title-recipe']");

        this.productPriceListingPage =
            page.locator("//span[@class='a-price-whole']");

        this.productDeliveryDayListingPage =
            page.locator("//div[@data-cy='delivery-recipe']");

        this.listOfFilterNameInLeftNav =
            page.locator("//div[@id='s-refinements']//span[@class='a-size-base a-color-base puis-bold-weight-text']");


        this.listProcessorSpeedOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Processor Speed']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listBrandsOptionsByNew =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Brands']/parent::div/following-sibling::div[@class='a-section a-spacing-medium sf-navigation-searchable-content']//span[@class='a-size-base a-color-base']");


        this.listBrandsOptionsByOld =
            page.locator("//ul[@id='filter-p_123']//span[@class='a-size-base a-color-base']");


        this.listDisplaySizeOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Screen Size']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listDisplayTypeOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Display Type']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listDiscountOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Discount']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listBatteryCapacityOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Battery Capacity']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listStorageCapacityOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Storage Capacity']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listDeliveryDayOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Delivery Day']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listMobilePhonePrimaryCameraResolutionOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Mobile Phone Primary Camera Resolution']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.listOperatingSystemVersionOptionsBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Operating System']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base']");


        this.getItByTomorrowUnderDeliveryDayFilterBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Delivery Day']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base' and text()='Get It by Tomorrow']");


        this.getItInTwoDaysUnderDeliveryDayFilterBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Delivery Day']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base' and text()='Get It in 2 Days']");


        this.eligibleForFreeDelivery =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Eligible for Free Delivery']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base' and text()='Free Shipping']");


        this.getItTodayUnderDeliveryDayFilterBy =
            page.locator("//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Delivery Day']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base' and text()='Get It Today']");


        this.seeMoreButtonUnderOperatingSystemFilter =
            page.locator("//a[@aria-label='See more, Operating System']");


        this.seeMoreButtonUnderBrandFilter =
            page.locator("//a[@aria-label='See more, Brands']");


        this.listProductCardsBy =
            page.locator("//div[@class='a-section a-spacing-small a-spacing-top-small']");


        this.priceMinSliderButton =
            page.locator("#p_36/range-slider_slider-item_lower-bound-slider");


        this.priceMaxSliderButton =
            page.locator("#p_36/range-slider_slider-item_upper-bound-slider");


        this.priceSliderSubmitButton =
            page.locator("//div[@class='a-section sf-submit-range-button']");


        this.maxPriceFilterApplied =
            page.locator("//label[@for='p_36/range-slider_slider-item_upper-bound-slider']");


        this.minPriceFilterApplied =
            page.locator("//label[@for='p_36/range-slider_slider-item_lower-bound-slider']");


        this.productPriceFromProductCards =
            page.locator("//span[@class='a-price-whole']");


        this.productNameListingPageBy =
            page.locator("//div[@data-cy='title-recipe']");


        this.productNameIndividualPage =
            page.locator("//span[@id='productTitle']");


        this.productKeyFeatureBlock =
            page.locator("//div[@class='a-section a-spacing-small a-spacing-top-small']");


        this.aboutThisItemBulletPoint =
            page.locator("//div[@id='feature-bullets']");


        this.technicalDetailsBlockIndividualPage =
            page.locator("//div[@id='prodDetails']");


        this.seeMoreProductDetailsButtonIndividualPageBy =
            page.locator("//a[@id='seeMoreDetailsLink']");


        this.clearButtonBy =
            page.locator("//span[@class='a-size-base a-color-base' and text()='Clear']");


        this.seeMoreButtonIndividualPage =
            page.locator("//span[@class='a-expander-prompt' and text()='Show More']");


        this.reportAnIssue =
            page.locator("//div[@id='CardInstanceCnrYlcUauBaBV5oi0X1UVw']");


        this.showMoreOnlyIndividualPage =
            page.locator("//span[@class='a-expander-prompt' and text()='Show More']");


        this.resetPriceRangeProductPage =
            page.locator("//span[@class='a-size-base a-color-link' and text()='Reset price range']");
    }
}