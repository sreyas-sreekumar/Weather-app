import {  useState, useEffect ,useCallback} from "react";
import './index.css';

import rainyBG from "./assets/rain.jpg";
import defaultBG from "./assets/default.jpg";
import sunnyBG from "./assets/sun.jpg";
function App()
{
  const getOrdinal = (num) => {
    if (num > 3 && num < 21) return 'th';
    switch(num % 10)
    {
      case 1 : return 'st';
      case 2 : return 'nd';
      case 3: return 'rd';
      default : return 'th';
    }

  };

  const[cityInput, setCityInput] = useState("");
  const[status,setStatus] = useState("idle");
  const [weather,setWeather] = useState(null);
  const [error,setError] = useState("");
  const [forecast , setForecast] = useState(null);
  const[searchID,setSearchID] = useState(0);

  const[savedCities,setSavedCities] = useState(() => 
  {
    const savedTemp = localStorage.getItem("user_cities");
    return savedTemp ? JSON.parse(savedTemp) : [];
  });

  const dailyData = forecast?.list.filter((dailyItem) => dailyItem.dt_txt.includes("12:00:00")) || [];
      
  let theme = "defaultTheme";
  let wallpaper = defaultBG;

  const searchHandle = useCallback(async (locationString ) => 
    {
      setSearchID(Date.now());
      setStatus("loading");
    setError("");
    setWeather(null);

    try
    {
      let queryString = "";

      if(locationString && typeof locationString === "object" &&locationString.lat && locationString.lon)
      {
        queryString = `lat=${locationString.lat}&lon=${locationString.lon}`;
      }

      else if(typeof locationString === "string" )
      {
        queryString = `city=${locationString}`;
      }

      else
      {
        if(!cityInput.trim())
        {
          setError("Enter a city name...");
          setStatus("error");
          return;
        }

        queryString = `city=${cityInput.trim()}`
      }

      const responseAPI = await fetch(`https://srey-weather360-backend.onrender.com/api/weather?${queryString}`);
      console.log("Weather data from backend:", responseAPI);

      if(!responseAPI.ok)
      {
        throw new Error("City is not found...try again")
      }

      const weatherData = await responseAPI.json();
      setWeather(weatherData);
      setCityInput(weatherData.city);
      setStatus("loading");
      setError("");

      const forecastResponseAPI = await fetch (`https://srey-weather360-backend.onrender.com/api/forecast?${queryString}`);
      console.log("Forecast data from backend", forecastResponseAPI);

      if(!forecastResponseAPI.ok)
      {
        throw new Error("City is not found for forecast...try again");
      }
      const forecastData = await forecastResponseAPI.json();
      setForecast(forecastData);
      setStatus("success");
      console.log("Fore cast data",forecastData);



    }
    catch(err)
    {
      setError(err.message);
      setStatus("error");

    }


  },[]);
  useEffect(() => 
    {
      navigator.geolocation.getCurrentPosition( 
      (position) => 
      {
        const coords = 
        {
          lat:position.coords.latitude,
          lon:position.coords.longitude
        };

        searchHandle(coords);
      },
      (err) =>
      {
        console.warn("User has not given permission for location or an unexpected error has occured",err);
        searchHandle("London");

      });
    },[searchHandle]);


  async function handleSaveCity(newCity)
  {
    if(!savedCities.includes(newCity))
    {
      const newSavedCities = [...savedCities,newCity];
      setSavedCities(newSavedCities);
      localStorage.setItem("user_cities",JSON.stringify(newSavedCities));
    }
  }

  async function handleDeleteCity(cityDelete,e)
  {
    e.stopPropagation()
    const newCityList = savedCities.filter(city => city != cityDelete);
    setSavedCities(newCityList);
    localStorage.setItem("user_cities",JSON.stringify(newCityList));
  }
    
  
  if(weather)
    {
        const cond = weather.condition.toLowerCase();
        if (cond.includes("rain") || cond.includes("drizzle"))
        {
          theme = "rainBG";
          wallpaper = rainyBG;
        }
        if (cond.includes("sun") || cond.includes("clear"))
        {
          theme = "sunnyBG";
          wallpaper = sunnyBG;
        }
    }




  return (
    <div className = {`app ${theme}`}
    style={{'--wallpaper': `url(${wallpaper})`}}
    >
      <div className="dashboard-layout">
        
        {savedCities.length > 0 && (
          <aside className="sidebar">
            <h3>Saved Cities</h3>
            <div className="saved-city-stack-vertical">
              {savedCities.map((city) => (
                <div 
                  key = {city}
                  className="city-name-vertical"
                  onClick={()=> searchHandle(city)}
                >
                <span>{city}</span>
                <button 
                className="delete-button" 
                onClick={(e) => handleDeleteCity(city,e)}>X</button>
                </div>
              ))}

            </div>
          </aside>
        )}

        <div className = "container">
            <h1>Weather</h1>
            <div className ="search-group">
              <input type = "text" value = {cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder= "Enter a city to find out..." />
              <button onClick = { () => searchHandle(cityInput)}>Search</button> 
            </div>
            {status === "loading" && <div className="loader"></div>}
            {status === "error" && <p>{error}</p>}

            {status === "success" && weather && (
              <div className="weather-container-animated" key={searchID} >
                  <div>
                    <div className = "weatherHeader">
                      <h2>{weather.city}</h2>
                      <h1 className="tempHeader">{weather.temperature}°C</h1>
                      <p>{weather.condition}</p>
                        {
                          weather.icon && (<img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt = "Weather Icon"/>)
                        }
                      <br></br>
                      <button onClick={() => handleSaveCity(weather.city)}> Save City</button>
                    </div>
                    {forecast && (
                      <div className="hourlyForecastContainer">
                        <div className = "frostedHeader">
                          <h2 className="sectionTitle">Next 24 Hours</h2>
                        </div>
                        <div className="hourlyScroll">
                          {forecast.list.slice(0,8).map((hourItem)=>
                            { 
                              const time = new Date(hourItem.dt * 1000);
                              const dayNum = time.getDate();
                              const month = time.toLocaleString('en-GB',{month : 'long'})
                              const ordinal = getOrdinal(dayNum);
                              const formattedDate = `${dayNum}${ordinal} ${month}`;
                              return (
                                <div key={hourItem.dt} className = "hourlyItem">
                                  <p className="hourlyTime">{formattedDate}</p>
                                  <img src = {`https://openweathermap.org/img/wn/${hourItem.weather[0].icon}.png`} alt = "icon for weather" />
                                  <p className = "hourlyTemp">{Math.round(hourItem.main.temp)}°</p>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    )}
                    <div className = "statsGrid">
                    {weather.uvIndex !== undefined && (
                      <div className="card">
                        <p>UV Index : {weather.uvIndex}</p>
                      </div>
                    )}

                      <div className="card">
                        <p className="statLabel">Feels like</p>
                        <p className = "statValue">{weather.feelsLike}°C</p>
                      </div>
                      <div className="card">                  
                        <p className="statLabel">Humidity </p>
                        <p className = "statValue">{weather.humidity}%</p>
                      </div>
                      <div className="card">                  
                        <p className="statLabel">Wind Speed</p>
                        <p className = "statValue">{weather.windSpeed} m/s</p>
                      </div>
                      <div className="card">                  
                        <p className="statLabel">Cloud Coverage</p>
                        <p className="statValue">{weather.cloudCover}%</p>
                      </div>
                    </div>
                    {forecast && (
                      <div className = "dailyForecastContainer">
                        <div className="frostedHeader">
                          <h2 className="sectionTitle">Next 5 Days</h2>
                        </div>
                        <div className = "dailyRow">
                          {
                            dailyData.map((day) => {
                              const dayName = new Date(day.dt * 1000).toLocaleDateString('en-GB',{weekday : 'long'});
                              return(
                                <div key={day.dt} className = "dailyItem">
                                  <p className="dayName">{dayName}</p>
                                  <img src = {`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt = "icon for weather" />
                                  <p className = "hourlyTemp">{Math.round(day.main.temp)}°</p>
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div> 
                    )}
                  </div>
              </div>
              )}
            
        </div> 


      </div>
    </div>
    );


}

export default App;