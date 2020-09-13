const axios = require('axios');
var clc = require("cli-color");
const dotenv = require('dotenv');
const readline = require("readline");

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion (){
    rl.question(clc.yellow("Enter city name to get weather?"), function(city) {
        const cityName = city || process.env.CITY_NAME;
        callApi(cityName);
    });
}
   
askQuestion();

const API_KEY = process.env.API_KEY;

function callApi(CITY_NAME){
    const ENTIRE_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}`;
    axios.get(ENTIRE_API_URL)
    .then(response => {
        const kelvinTemperature = response.data.main.temp;
        const cityName = response.data.name;
        const countryName = response.data.sys.country;

        // Making K to F and K to C conversions.
        const fahrenheitTemperature = (kelvinTemperature * 9/5) - 459.67;
        const celciusTemperature = kelvinTemperature - 273.15;

        // Building the final message.
        const message = (
            `Right now, in \
            ${cityName}, ${countryName} the current temperature is \
            ${fahrenheitTemperature.toFixed(2)} deg F or \
            ${celciusTemperature.toFixed(2)} deg C.`.replace(/\s+/g, ' ')
        );

        console.log(clc.blue(message));
        askQuestion();
    })
    .catch(error => {
        console.log('Please enter correct name!');
        askQuestion();
     });
}