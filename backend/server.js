import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

console.log("EXPRESS SERVER FILE LOADED");
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

    try
    {
        let queryParam;
        queryParam = city ? `q=${city}` : `lat=${lat}&lon=${lon}`;
        const url = `https://api.openweathermap.org/data/2.5/weather`+`?${queryParam}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("RAW OpenWeather response:", data);

        res.json({
            city:data.name,
            temperature: data.main.temp,
            condition: data.weather[0].description,
            cloudCover: data.clouds.all,
            icon: data.weather[0].icon,
            humidity:data.main.humidity,
            uvIndex: data.uvi,
            feelsLike: data.main.feels_like,
            windSpeed: data.wind.speed

        });

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

    try
    {
        let queryParam;
        queryParam = city ? `q=${city}` : `lat=${lat}&lon=${lon}`
        const url = `https://api.openweathermap.org/data/2.5/forecast`+`?${queryParam}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("RAW OpenWeather response:", data);

        res.json({
            city: data.city.name,
            list: data.list

        });

    }
    catch(err)
    {
        res.status(500).json({error :"Failure in accessing forecast data..."});

    }
});


app.listen(port,'0.0.0.0', () => { console.log(`Server running on port ${port}`)});