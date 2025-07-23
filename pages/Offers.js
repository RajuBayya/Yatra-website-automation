import {expect} from '@playwright/test'

// Offers.js
export class OfferPage {

  constructor(page) {

        
    this.page = page;
      
    // locating the banner using xpath
    this.bannerLocator = this.page.locator('//*[@id="collapsibleSection"]/section[1]/div[1]/div/div/h2'); 

    // locating the the holidays
    this.holidays=this.page.locator("//ul[@id='offer-box-shadow']/li[4]");


  }
  
  // checking the title and banner
  async checkTitleBanner() {

    try{
      const title = await this.page.title();
  
      // checking the title
      expect(title).toContain('Domestic Flights Offers');

      // checking the banner
      expect(this.bannerLocator).toHaveText('Great Offers & Amazing Deals');

      // taking the screenshot of the holidays page
      await this.page.screenshot({ path: 'offerspage.png' });
    }
    catch(error){
      console.log('Title and Banner Checking Failed ')
    }


  }

    // navigating to holidays
    async goToHolidays(){

      try{
        await this.page.waitForSelector('//ul[@id="offer-box-shadow"]/li[4]');

        // clicking in the holidays
        await this.page.locator('//ul[@id="offer-box-shadow"]/li[4]').click();
      }
      catch(error){
        console.log('Unbale to navigate to Holidays')
      }
     
      
    }

}
  