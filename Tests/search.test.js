import * as searchHelpers from './searchHelpers';

fixture `Search Functionality`
    .page(`https://www.toyota.com.au/used-cars`);

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify Search module and Hero banner are displayed', async browser => {
        await searchHelpers.verifySearchUI(browser);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify clicking on value my car link navigates to car valuation page', async browser => {
        await searchHelpers.clickValueMyCarLink(browser);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify user is able to search toyota specific vehicles', async browser => {
        await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '80000',
            locationInput: '',
            isHybrid: false,
            isCertified: false,
            clickSearch: true
        });
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify search count in the Homepage and the Search results page are equal', async browser => {
        const homePageVehicleCount = await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: 'COROLLA',
            price: '',
            locationInput: '',
            isHybrid: false,
            isCertified: false,
            clickSearch: true
        });
        const searchResultsVehicleCount = await searchHelpers.getSearchResultsPageVehicleCount();
        await browser.expect(homePageVehicleCount).eql(searchResultsVehicleCount);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify the search results with model filter displays the correct model', async browser => {
        await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: 'COROLLA',
            price: '',
            locationInput: '',
            isHybrid: false,
            isCertified: false,
            clickSearch: true
        });
        await searchHelpers.verifyCorrectModelsAreDisplayed(browser, {model: 'COROLLA'});
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify the search results with price filter displays the correct price range', async browser => {
        await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '80000',
            locationInput: '',
            isHybrid: false,
            isCertified: false,
            clickSearch: true
        });
        await searchHelpers.verifyCorrectPricesAreDisplayed(browser, {price: '80000'});
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify the search results with location filter displays the correct location', async browser => {
        await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '',
            locationInput: 'Melbourne',
            isHybrid: false,
            isCertified: false,
            clickSearch: true
        });
        await searchHelpers.verifyCorrectLocationIsDisplayed(browser, {locationInput: 'Melbourne'});
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify the search results with Hybrid checkbox filter displays only the hybrid vehicles', async browser => {
        const homePageVehicleCount = await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '80000',
            locationInput: '',
            isHybrid: true,
            isCertified: false,
            clickSearch: true
        });

        const searchResultsVehicleCount = await searchHelpers.getSearchResultsPageVehicleCount();

        await browser.expect(homePageVehicleCount).eql(searchResultsVehicleCount);
        await searchHelpers.verifySearchResultsForHybridFilter(browser);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify unChecking the hybrid checkbox updates the search count', async browser => {
        const getVehicleCountWithHybridFilter = await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '80000',
            locationInput: '',
            isHybrid: true,
            isCertified: false,
            clickSearch: false
        });

        await searchHelpers.clickHybridCheckbox(browser);
        await browser.expect(await searchHelpers.getHomePageVehicleCount()).gte(getVehicleCountWithHybridFilter);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify Search Button is disabled when no search results', async browser => {
        await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '5000',
            locationInput: '',
            isHybrid: true,
            isCertified: false,
            clickSearch: false
        });
        await searchHelpers.verifySearchButtonWhenNoResults(browser);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify the search results with Certified checkbox filter displays only the Certified vehicles', async browser => {
        const homePageVehicleCount = await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '80000',
            locationInput: '',
            isHybrid: false,
            isCertified: true,
            clickSearch: true
        });

        const searchResultsVehicleCount = await searchHelpers.getSearchResultsPageVehicleCount();

        await browser.expect(homePageVehicleCount).eql(searchResultsVehicleCount);
        await searchHelpers.verifySearchResultsForCertifiedFilter(browser);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify unChecking the certified checkbox updates the search count', async browser => {
        const getVehicleCountWithCertifiedFilter = await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '80000',
            locationInput: '',
            isHybrid: false,
            isCertified: true,
            clickSearch: false
        });

        await searchHelpers.clickCertifiedCheckbox(browser);
        await browser.expect(await searchHelpers.getHomePageVehicleCount()).gte(getVehicleCountWithCertifiedFilter);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify if the tooltip message displayed for the certified checkbox', async browser => {
        await searchHelpers.verifyCertifiedToolTip(browser);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify if certified tooltip message is closed upon clicking on the icon', async browser => {
        await searchHelpers.clickCertifiedToolTip(browser);
        await searchHelpers.verifyClosingToolTip(browser, { isToolTipOpen: true});

        await searchHelpers.clickCertifiedToolTip(browser);
        await searchHelpers.verifyClosingToolTip(browser, { isToolTipOpen: false});

    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify Search All Vehicle Makes link navigates to search results page with all vehicle results', async browser => {
        await searchHelpers.verifySearchAllVehicleMakeLink(browser);
    });

test
    .meta({smoke: 'true', regression: 'true', EndToEnd: 'false'})
    ('Verify if user is able to search for a hybrid certified car', async browser => {
        const homePageVehicleCount = await searchHelpers.fillDetailsAndClickSearch( browser, {
            model: '',
            price: '',
            locationInput: '',
            isHybrid: true,
            isCertified: true,
            clickSearch: true
        });
        const searchResultsVehicleCount = await searchHelpers.getSearchResultsPageVehicleCount();
        await browser.expect(homePageVehicleCount).eql(searchResultsVehicleCount);
        await searchHelpers.verifySearchFiltersForCertifiedHybrid(browser);
    });
