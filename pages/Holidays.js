import fs from 'fs';

export class HolidaysPage{

  constructor(page,context){
    this.page=page;
    this.context=context;
    
    // loacting the list of holiday packages using xpath
    this.holidayPackages = this.page.locator("//ul[@class='wfull noListStyle list']/li");

  }

  //viewing details
  async toViewDetails() {

    try{
      // checking the count of hoiliday packages
      const count = await this.holidayPackages.count();

      const data =[]
    
      // iterating the holiday packages to get single holiday package
      for (let i = 0; i < count; i++) {

        const holidayPackage = this.holidayPackages.nth(i);

        // sending each holiday package to packageDetails and storing the new page
        const tripPage = await this.packageDetails(holidayPackage);
      
        // sending the new tripPage to a method to get name and price
        const { name, price } = await this.namePrice(tripPage);
      
        data.push({
      
          "name":name,
          "price":price
    
        })
        
        fs.writeFileSync("output/result.json",JSON.stringify(data,null,2));
    
        console.log(`${i + 1} ${name}`, price);
    
        await tripPage.close();

      }
    }
    catch(error){
      console.log('Unable to view Details');
    }
    
  }

  // opening the holiday package and returning the new page
  async packageDetails(holidayPackage){

    const [newPage] = await Promise.all([

      this.context.waitForEvent("page"),

      holidayPackage.click()  

    ]);

    return newPage;

  }


  // getting name and price
  async namePrice(tripPage) {

    let name, price;
    
    try {

      // Wait explicitly for a reliable element
      await tripPage.waitForLoadState('domcontentloaded');
      await tripPage.waitForSelector('//*[@id="leftSect"]/h2', { timeout: 10000 });
    
      // getting the name
      name = await tripPage.locator('//*[@id="leftSect"]/h2').innerText();

      // getting the price
      price = await tripPage.locator('//*[@id="main-container"]/div[2]/div/div/div[1]/div[2]/div/span[2]').textContent();

    } 
    catch {

      // Wait explicitly for a reliable element
      await tripPage.waitForLoadState('domcontentloaded');
      await tripPage.waitForSelector('xpath=/html/body/div[1]/div[4]/div/div/h1', { timeout: 5000 });

      // getting the name
      name = await tripPage.locator('xpath=/html/body/div[1]/div[4]/div/div/h1').innerText();

      // getting the price
      price = await tripPage.locator('xpath=/html/body/div[1]/div[4]/div/div/ul[2]/li[1]/p[2]').textContent();

      // here the price has 2 values 
      price = price.split("\n")
      price = price[0]+"-"+price[2].trim();

    }
    
    // returning the name and price
    return { name: name.trim(), price: price.trim() };

  }
    
      
}