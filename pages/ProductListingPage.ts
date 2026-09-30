import { Locator, Page, expect } from '@playwright/test';

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

    public appliedProcessorSpeedOptions: Locator;
    public appliedStorageCapacityOptions: Locator;
    public appliedBrandsOptions: Locator;
    public appliedBatteryCapacityOptions: Locator;
    public appliedDisplaySizeOptions: Locator;
    public appliedDisplayTypeOptions: Locator;
    public appliedOperatingSystemOptions: Locator;
    public appliedMobilePhonePrimaryCameraResolutionOptions: Locator;
    public appliedDiscountOptions: Locator;
    public appliedOperatingSystemVersionOptions: Locator;
    public appliedBrandsOldOptions: Locator;
    public appliedScreenSizeOptions: Locator;


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

        this.appliedProcessorSpeedOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Processor Speed']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedStorageCapacityOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Storage Capacity']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedBrandsOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Brands']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedBatteryCapacityOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Battery Capacity']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedDisplaySizeOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Display Size']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedDisplayTypeOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Display Type']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedOperatingSystemOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Operating System']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedMobilePhonePrimaryCameraResolutionOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Mobile Phone Primary Camera Resolution']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedDiscountOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Discount']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedOperatingSystemVersionOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Operating System Version']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );

        this.appliedBrandsOldOptions = page.locator(
            "//ul[@id='filter-p_123']//span[@class='a-size-base a-color-base']"
        );

        this.appliedScreenSizeOptions = page.locator(
            "//span[@class='a-size-base a-color-base puis-bold-weight-text' and text()='Screen Size']/parent::div/following-sibling::ul//span[@class='a-size-base a-color-base a-text-bold']"
        );
    }



    public getFilterByTypeAndName(
        filterName: string,
        filterOption: string
    ): Locator {

        switch (filterName.toLowerCase()) {

            case "processorspeed":
                return this.listProcessorSpeedOptionsBy
                    .filter({ hasText: filterOption });

            case "storagecapacity":
                return this.listStorageCapacityOptionsBy
                    .filter({ hasText: filterOption });

            case "brands":
                return this.listBrandsOptionsByNew
                    .filter({ hasText: filterOption });

            case "batterycapacity":
                return this.listBatteryCapacityOptionsBy
                    .filter({ hasText: filterOption });

            case "displaysize":
                return this.listDisplaySizeOptionsBy
                    .filter({ hasText: filterOption });

            case "displaytype":
                return this.listDisplayTypeOptionsBy
                    .filter({ hasText: filterOption });

            case "operatingsystem":
                return this.listOperatingSystemVersionOptionsBy
                    .filter({ hasText: filterOption });

            case "mobilephoneprimarycameraresolution":
                return this.listMobilePhonePrimaryCameraResolutionOptionsBy
                    .filter({ hasText: filterOption });

            case "discount":
                return this.listDiscountOptionsBy
                    .filter({ hasText: filterOption });

            case "operating system version":
                return this.listOperatingSystemVersionOptionsBy
                    .filter({ hasText: filterOption });

            case "brandsold":
                return this.listBrandsOptionsByOld
                    .filter({ hasText: filterOption });

            case "screensize":
                return this.listDisplaySizeOptionsBy
                    .filter({ hasText: filterOption });

            default:
                throw new Error(`Unknown filter type: ${filterName}`);
        }









































    }



    public getAppliedFilterByTypeAndName(
        filterName: string,
        filterOption: string
    ): Locator {

        switch (filterName.toLowerCase()) {

            case "processorspeed":
                return this.appliedProcessorSpeedOptions
                    .filter({ hasText: filterOption });

            case "storagecapacity":
                return this.appliedStorageCapacityOptions
                    .filter({ hasText: filterOption });

            case "brands":
                return this.appliedBrandsOptions
                    .filter({ hasText: filterOption });

            case "batterycapacity":
                return this.appliedBatteryCapacityOptions
                    .filter({ hasText: filterOption });

            case "displaysize":
                return this.appliedDisplaySizeOptions
                    .filter({ hasText: filterOption });

            case "displaytype":
                return this.appliedDisplayTypeOptions
                    .filter({ hasText: filterOption });

            case "operatingsystem":
                return this.appliedOperatingSystemOptions
                    .filter({ hasText: filterOption });

            case "mobilephoneprimarycameraresolution":
                return this.appliedMobilePhonePrimaryCameraResolutionOptions
                    .filter({ hasText: filterOption });

            case "discount":
                return this.appliedDiscountOptions
                    .filter({ hasText: filterOption });

            case "operating system version":
                return this.appliedOperatingSystemVersionOptions
                    .filter({ hasText: filterOption });

            case "brandsold":
                return this.appliedBrandsOldOptions
                    .filter({ hasText: filterOption });

            case "screensize":
                return this.appliedScreenSizeOptions
                    .filter({ hasText: filterOption });

            default:
                throw new Error(`Unknown filter type: ${filterName}`);
        }
    }


    public getMoreButtonByFilterTypeAndName(
        filterName: string
    ): Locator {

        switch (filterName.toLowerCase()) {

            case "brands":
                return this.seeMoreButtonUnderBrandFilter;

            case "operatingsystem":
                return this.seeMoreButtonUnderOperatingSystemFilter;

            default:
                throw new Error(`Unknown filter type: ${filterName}`);
        }
    }



    public getDeliveryDayFilterByName(
        filterName: string
    ): string {

        switch (filterName) {

            case "verifyingGetItByTomorrowFilterFunctionality":
                return "Get It by Tomorrow";

            case "verifyingGetItIn2DaysFilterFunctionality":
                return "Get It in 2 Days";

            case "verifyingGetItByTodayFilterFunctionality":
                return "Get It By Today";

            case "verifyingFreeDeliveryFilterFunctionality":
                return "Eligible for Free Delivery";

            default:
                throw new Error(`Unknown filter type: ${filterName}`);
        }
    }



    public getFilterHeaderByTypeAndName(
        filterName: string
    ): Locator {

        switch (filterName.toLowerCase()) {

            case "processorspeed":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Processor Speed" });

            case "storagecapacity":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Storage Capacity" });

            case "brands":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Brands" });

            case "batterycapacity":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Battery Capacity" });

            case "displaysize":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Display Size" });

            case "displaytype":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Display Type" });

            case "operatingsystem":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Operating System" });

            case "mobilephoneprimarycameraresolution":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Mobile Phone Primary Camera Resolution" });

            case "discount":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Discount" });

            case "brandsold":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Brands" });

            case "screensize":
                return this.listOfFilterNameInLeftNav
                    .filter({ hasText: "Screen Size" });

            default:
                throw new Error(`Unknown filter type: ${filterName}`);
        }
    }


    public getProductByIndex(index: number): Locator {
        return this.productNameListingPageBy.nth(index - 1);
    }



}

export default ProductListingPage;