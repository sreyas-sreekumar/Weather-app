import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import NodeCache from "node-cache";

console.log("EXPRESS SERVER FILE LOADED");
const cache = new  NodeCache({stdTTL: 600});
dotenv.config();
//console.log("API KEY:", process.env.WEATHER_API_KEY);
const app = express();

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
app.use(cors());

const port = process.env.PORT || 5050;

app.get("/api/weather",async (req,res) => {

    const {city,lat,lon} = req.query;

    if(!city && (!lat || !lon))
    {
        return res.status(400).json({error:"City is required to proceed"});
    }

    const cacheKey = city ? `city_${city.toLowerCase().trim()}` : `coords_${lat}_${lon}`;

    if(cache.has(cacheKey))
    {
        console.log(`Cache Hit for Cache Key : ${cacheKey}`);
        return res.json(cache.get(cacheKey));
    }

    console.log(`Cache Miss for Cache Key ${cacheKey} ->fetching now from OpenWeather`);


    try
    {
        let queryParam;
        queryParam = city ? `q=${city}` : `lat=${lat}&lon=${lon}`;
        const url = `https://api.openweathermap.org/data/2.5/weather`+`?${queryParam}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok)
        {
            return res.status(response.status).json({error : data.message || "City not found"});
        }
        console.log("RAW OpenWeather response:", data);

        const formattedData = {
            city:data.name,
            temperature: data.main.temp,
            condition: data.weather[0].description,
            cloudCover: data.clouds.all,
            icon: data.weather[0].icon,
            humidity:data.main.humidity,
            uvIndex: data.uvi,
            feelsLike: data.main.feels_like,
            windSpeed: data.wind.speed

        };

        cache.set(cacheKey,formattedData);
        return res.json(formattedData);



    }
    catch(err)
    {
        res.status(500).json({error :"Failure in accessing weather data..."});

    }
});


app.get("/api/forecast",async (req,res) => {

    const {city,lat,lon} = req.query;
    if(!city && (!lat ||!lon))
    {
        return res.status(400).json({error:"City is required to proceed"});
    }

    const cacheKey = city ? `forecast_city_${city.toLowerCase().trim()}` : `forecast_coords_${lat}_${lon}`;
    if(cache.has(cacheKey))
    {
        console.log(`Cache Hit for forecast Cache Key : ${cacheKey}`);
        return res.json(cache.get(cacheKey));
    }
    console.log(`Cache Miss for forecast Cache Key ${cacheKey} ->fetching now from OpenWeather`);


    try
    {
        let queryParam;
        queryParam = city ? `q=${city}` : `lat=${lat}&lon=${lon}`
        const url = `https://api.openweathermap.org/data/2.5/forecast`+`?${queryParam}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("RAW OpenWeather response:", data);

        const forecastFormattedData = 
        {
            city: data.city.name,
            list: data.list

        };

        cache.set(cacheKey,forecastFormattedData);
        return res.json(forecastFormattedData);

    }
    catch(err)
    {
        res.status(500).json({error :"Failure in accessing forecast data..."});

    }
});


app.listen(port,'0.0.0.0', () => { console.log(`Server running on port ${port}`)});