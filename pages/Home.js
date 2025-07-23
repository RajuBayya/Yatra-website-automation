import {expect} from '@playwright/test'

export class HomePage{

    constructor(page,context){
        this.page=page;
        this.context=context;
        
        // locating the cross mark using xpath
        this.popUp=page.locator('//*[@id="__next"]/div/div[1]/div[1]/div[2]/div/section[2]/span/img');

        // locating the view all offers using role
        this.offers=page.getByRole("button",{name:'View all offers'});

    }

    // function for navigating to yatra main page
    async goToHome(){

        try {

            // navigating to yatra
            await this.page.goto('https://www.yatra.com/');
            await expect(this.page).toHaveURL('https://www.yatra.com/');
            await this.page.waitForTimeout(3000);
      
            // Handle popup if visible
            if (await this.popUp.isVisible()) {
              await this.popUp.click();
              await expect(this.popUp).toBeHidden();

            }

        } 
          catch (error) {
            console.error('Unable to navigate homepage :', error.message);
        }
        
              
    }

    // navigating to offers and returning offers page
    async goToOffers(){
        
        try{
            // Confirm 'View all offers' button is present
            await expect(this.offers).toBeVisible();
            await expect(this.offers).toBeEnabled();
            
            const [newPage] = await Promise.all([
                this.context.waitForEvent("page"),

                this.offers.click()  
            ]);
        
            return newPage;
        }
        catch(error){
            console.log("Unable to open offers page");
        }
         
    }

}