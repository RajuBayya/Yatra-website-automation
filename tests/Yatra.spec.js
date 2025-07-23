import {test, expect} from '@playwright/test'
import { HomePage } from '../pages/Home';
import { OfferPage } from '../pages/Offers';
import { HolidaysPage } from '../pages/Holidays';
import { SearchFlights } from '../pages/SearchFlights'


test('yatra',async({page,context})=>{

  // HomePage 
  const home=new HomePage(page,context);
       
  await home.goToHome();  
       
  // storing the new page
  const newPage = await home.goToOffers();
    
  // Offers page  
  const offers=new OfferPage(newPage);
  await offers.checkTitleBanner();

  await Promise.all([
    newPage.waitForNavigation(), // wait for the navigation to complete
    offers.goToHolidays()
  ]);
          
  // Holidays Page
  const holidays=new HolidaysPage(newPage,context);
  await holidays.toViewDetails();

  
})

test.skip('yatra1',async({page,context})=>{

 
  // HomePage 
  const home=new HomePage(page,context);
       
  await home.goToHome();  

  const searchflights = new SearchFlights(page,context);

  await searchflights.selectPlaces();

  await page.waitForLoadState('domcontentloaded');
  await searchflights.displayDetails();


})

