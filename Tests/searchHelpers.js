import {ClientFunction} from 'testcafe';
import { selectors } from "./searchSelectors";

export const verifySearchUI = async browser => {
    await browser
        .expect(selectors.heroBannerTitle.exists).ok()
        .expect(selectors.heroBannerSubTitle.exists).ok()
        .expect(selectors.certifiedVehicleCheckbox.exists).ok()
        .expect(selectors.certifiedVehicleToolTipIcon.exists).ok()
        .expect(selectors.hybridCheckbox.exists).ok()
        .expect(selectors.modelDropDownList.exists).ok()
        .expect(selectors.priceDropDown.exists).ok()
        .expect(selectors.locationInputBox.exists).ok()
        .expect(selectors.searchToyotaVehiclesButton.exists).ok()
        .expect(selectors.searchAllVehicleMake.exists).ok()
        .expect(selectors.valueMyCarHeadingText.exists).ok()
        .expect(selectors.valueMyCarLink.exists).ok()
};


export const fillDetailsAndClickSearch = async ( browser, { model, price, locationInput, isHybrid, isCertified, clickSearch} )=> {

    model !== '' ? await enterVehicleModel(browser, model) : '';
    price !== '' ? await enterPriceValue(browser, price) : '';
    locationInput !== '' ? await enterLocationInput(browser, locationInput) : '';
    isCertified ? await clickCertifiedCheckbox(browser) : '';
    isHybrid ? await clickHybridCheckbox(browser) : '';


    const vehicleCount = await getHomePageVehicleCount();
    await browser.expect(vehicleCount).notEql('');

    if (clickSearch) {
        await clickSearchButton(browser);
        const location = ClientFunction(() => document.location.href);
        await browser.expect(await location()).contains('/used-cars/for-sale');
        await browser.expect(await location()).contains('TOYO');
        await browser.expect(await location()).contains(model);
        await browser.expect(await location()).contains(price);
        await browser.expect(await location()).contains(locationInput);
    }

    return vehicleCount;
};

export const clickHybridCheckbox = async browser => {
    await browser.click(selectors.hybridCheckbox);
};

export const clickCertifiedCheckbox = async browser => {
    await browser.click(selectors.certifiedVehicleCheckbox);
};

export const enterVehicleModel = async (browser, model) => {
    await browser
        .click(selectors.modelDropDown)
        .click(selectors.modelDropDownList.withAttribute('data-value', model));
};

export const enterPriceValue = async (browser, price) => {
    await browser
        .click(selectors.priceDropDown)
        .click(selectors.priceDropDownList.withAttribute('data-value', price));
};

export const enterLocationInput = async (browser, locationInput) => {
    await browser
        .typeText(selectors.locationInputBox, locationInput)
        .wait(2000)
        .click(selectors.locationInputListItems.nth(0));
};


export const getHomePageVehicleCount = async () => {
    const searchCount = await selectors.searchToyotaVehiclesButton.innerText;
    return parseInt(searchCount.replace(/[^0-9.,]/g, ''));
};

export const clickSearchButton = async browser => {
    await browser
        .click(selectors.searchToyotaVehiclesButton);
};

export const getSearchResultsPageVehicleCount = async () => {
    const searchCount = (await selectors.searchResultsHeader.innerText).replace(/[^0-9.]/g, '');
    return parseInt(await searchCount);
};

export const verifyCorrectModelsAreDisplayed = async (browser, { model }) => {
    const searchResultTitles = await selectors.searchResultsCarTitles;

    for(let i = 0; i <= searchResultTitles.length; i++) {
        const currentSearchResultTitle = await searchResultTitles.nth(i).innerText;
        await browser.expect(currentSearchResultTitle.toLowerCase()).contains(model.toLowerCase());
    }
};

export const verifyCorrectPricesAreDisplayed = async (browser, { price }) => {
    const priceValues = await selectors.priceValuesSearchResultsPage;

    for(let i = 0; i <= priceValues.length; i++) {
        const currentPriceValue = await priceValues.nth(i).innerText;
        await browser.expect(parseInt(currentPriceValue.replace(/[^0-9.]/g, ''))).lte(parseInt(price));
    }
};

export const verifyCorrectLocationIsDisplayed = async (browser, { locationInput }) => {
    const priceValues = await selectors.locationNamesSearchResultsPage;

    for(let i = 0; i <= priceValues.length; i++) {
        const currentPriceValue = await priceValues.nth(i).innerText;
        await browser.expect(currentPriceValue.toLowerCase()).contains(locationInput.toLowerCase());
    }
};

export const verifySearchResultsForHybridFilter = async browser => {
    await browser.expect(selectors.searchResultsSideBarHybridFilter.checked).eql(true);

    const location = ClientFunction(() => document.location.href);
    await browser.expect(await location()).contains('isHybrid=true');

};

export const verifySearchResultsForCertifiedFilter = async browser => {
    await browser.expect(selectors.searchResultsSideBarCertifiedFilter.checked).eql(true);

    const location = ClientFunction(() => document.location.href);
    await browser.expect(await location()).contains('IsToyotaCertified=true');

};

export const verifySearchButtonWhenNoResults = async browser => {
    await browser.expect(selectors.searchToyotaVehiclesButton.innerText).eql('SEARCH 0 VEHICLES');
    await browser.expect(await selectors.searchToyotaVehiclesButton.getAttribute('disabled')).eql('disabled');
};

export const verifyCertifiedToolTip = async browser => {

    const toolTipContent = 'All Toyota Certified Used Vehicles\n' +
        'undergo an exhaustive quality\n' +
        'inspection and are certified by\n' +
        'a Toyota technician.';

    await clickCertifiedToolTip(browser);
    await browser
        .expect(selectors.certifiedVehicleToolTipContent.innerText).eql(toolTipContent);
};

export const clickCertifiedToolTip = async browser => {
    await browser
        .click(selectors.certifiedVehicleToolTipIcon);
};

export const verifyClosingToolTip = async (browser, { isToolTipOpen }) => {
    await browser.expect(await selectors.certifiedVehicleToolTipContent.visible).eql(isToolTipOpen);
};

export const verifySearchAllVehicleMakeLink = async browser => {
    await browser.click(selectors.searchAllVehicleMake);

    const location = ClientFunction(() => document.location.href);
    await browser.expect(await location()).eql(`https://www.toyota.com.au/used-cars/for-sale`);
    await browser.expect(selectors.searchResultsSideBarMakeFilterOptions.nth(0).innerText).contains('All Makes');
};

export const clickValueMyCarLink = async browser => {
    await browser.click(selectors.valueMyCarLink);

    const location = ClientFunction(() => document.location.href);
    await browser.expect(await location()).eql(`https://www.toyota.com.au/used-cars/car-valuation`);
};

export const verifySearchFiltersForCertifiedHybrid = async browser => {
    await browser.expect(selectors.searchResultsSideBarCertifiedFilter.checked).eql(true);
    await browser.expect(selectors.searchResultsSideBarHybridFilter.checked).eql(true);

    const location = ClientFunction(() => document.location.href);
    await browser.expect(await location()).contains('IsToyotaCertified=true');
    await browser.expect(await location()).contains('isHybrid=true');
};
