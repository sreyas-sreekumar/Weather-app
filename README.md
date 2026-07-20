# Weather360 — Full-Stack Weather Application
A responsive, glassmorphic weather application built with React and Express. Weather360 provides real-time atmospheric conditions, multi-day forecasts, geolocation integration, and localized city searching.

## Key Features
- Geolocation & Geocoding: Automatically fetches weather for your current location using browser GPS with seamless fallback defaults.

- Polymorphic Search: Search for weather data by city name with seamless input updating.

- 5-Day Weather Forecast: Real-time temperature, wind speed, humidity, and condition metrics.

- Saved Favorites: Quick-access location bookmarks backed by browser localStorage.

- Glassmorphism UI: Modern, fully responsive visual interface adapted for mobile and desktop screens.

## Tech Stack & Architecture
#### Frontend: 
- React, JavaScript (ES6+), CSS Modules / Modern CSS, Vercel

#### Backend: 
- Node.js, Express.js, Axios, Render

#### APIs: 
- OpenWeatherMap API (Current & Forecast Data)

## Live Demo
Frontend Application: https://weather360-app.vercel.app/

Backend API Gateway: [\[Render Base URL\]](https://srey-weather360-backend.onrender.com/)

## Local Installation & Setup Prerequisites
- Node.js (v18+ recommended)

- npm

### 1. Clone the repository
```Bash
git clone https://github.com/sreyas-sreekumar/Weather-app.git
cd Weather-app
```
### 2. Configure Backend
```Bash
cd backend
npm install
```
- Create a .env file in the backend/ directory:

```Plaintext
WEATHER_API_KEY=your_openweather_api_key
PORT=5050
```
- Start the local server:

```bash
node server.js
```
### 3. Configure Frontend
- Open a new terminal window and navigate to the frontend directory:

```Bash
cd frontend
npm install
npm run dev
```