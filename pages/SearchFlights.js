import {expect} from '@playwright/test'
import fs from 'fs';
import inputdata from '../input/inputdata.json'

export class SearchFlights{

    constructor(page,context){
        this.page=page;
        this.context=context;

        // locating the starting place
        this.locate=page.locator('//*[@id="__next"]/div/div[1]/div[2]/div[3]/div[2]/div[1]/div[1]/div[1]/div[1]');
        this.startingPlace=page.locator('#input-with-icon-adornment');
        this.select=page.locator('.css-36ryd3', { hasText: inputdata.source });

        // locating the destination place
        this.locate1=page.locator('//*[@id="__next"]/div/div[1]/div[2]/div[3]/div[2]/div[1]/div[1]/div[2]/div[1]');
        this.destinationPlace=page.locator('#input-with-icon-adornment');
        this.select1=page.locator('.css-36ryd3', { hasText: inputdata.destination});

        this.date=page.locator('//*[@id="__next"]/div/div[1]/div[2]/div[3]/div[2]/div[1]/div[2]/div/div[1]/div[2]/div');

        // locating the no of paasengers
        this.passengers=page.locator('//*[@id="__next"]/div/div[1]/div[2]/div[3]/div[2]/div[1]/div[3]/div/div[2]');

        // locating the adults
        this.adults=page.locator("//div[@class='MuiBox-root css-gcq4i1']/div/div[1]/div[1]/div/ul/li[2]");

        // locating the childs
        this.childs=page.locator("//div[@class='MuiBox-root css-gcq4i1']/div/div[1]/div[2]/div/ul/li[2]")

        // locating the done button 
        this.done=page.locator('//*[@id="traveller_container"]/div[3]/div/button');

        // locating the search button
        this.search=page.locator('//*[@id="__next"]/div/div[1]/div[2]/div[3]/div[2]/div[1]/div[4]/div/button');

        // locating the container of flight and its details
        this.flights=page.locator("//div[@class='flight-seg no-pad col-12 v-aligm-t']/div");

        // locating the flight name
        this.flightName=page.locator("//div[@class='airline-holder clearfix i-b text-left flex grid full']/div[2]");

        // locating the flight time
        this.flightTime=page.locator("//div[@class='depart-details']/p[2]");
         
    }

    async selectPlaces(){
        try{
            // selecting the starting place
            await this.locate.click();
            await this.startingPlace.fill(inputdata.source);
            await this.select.click();

            // selecting the destination place
            await this.locate1.click();
            await this.destinationPlace.fill(inputdata.destination);
            await this.select1.click();

            // select the date
            await this.date.click();

            // Pick today's date
            var today = new Date().getDate()// e.g., "2"

            if(parseInt(today)<10){
                today="0"+today;
            }

            // selecting today's date
            await this.page.click(`//*[@id="__next"]/div/div[1]/div[2]/div[3]/div[2]/div[1]/div[2]/div/div[4]/div/div/div/div/div/div/div[2]/div[2]/div/div/span[normalize-space(text())="${today}"]`);

            // selecting the passengers
            await this.passengers.click();

            await this.page.waitForTimeout(2000);
            await this.adults.click();

            await this.page.waitForTimeout(2000);
            await this.childs.click();

            await this.done.click();

            // clicking on search
            await this.search.click();

            //await this.page.waitForSelector('srp  wr-hr-center wr-width grid');   
        }
        catch(error){
            console.log('Unable to select places')
        }
        
    }

    async displayDetails(){
        try{

            let data =[];

            await this.flights.first().waitFor();
            const count=await this.flights.count();
            //console.log(await this.flights.count())

            // iterating flight details
            for(let i=0;i <count-1; i++){
                const flight= this.flightName.nth(i);
                const time=this.flightTime.nth(i);

                await expect(flight).toBeVisible();
                await expect(time).toBeVisible();

                const x =await this.getNameTime(flight,time);
                expect(x.name).not.toBe('');
                expect(x.time).not.toBe('');

                data.push([x])
    
            }
            fs.writeFileSync("output/result1.json",JSON.stringify(data,null,2));
        }
        catch(error){
            console.log('Unable to view flight details')
        }

    }
   
    async getNameTime(flight,time){
        
        // getting name and time of the flight
        const name=await flight.textContent();
        const times=await time.textContent();
         console.log(name,times);
        
        return {
            name:name,
            time:times
        }
        
    }
    
}