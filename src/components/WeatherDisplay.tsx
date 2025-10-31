import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import '../styles/WeatherDisplay.css';

// Helper function to get wind direction from degrees
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
};

// Helper function to get air quality description
const getAirQualityDescription = (aqi: number): string => {
  switch (aqi) {
    case 1: return 'Good';
    case 2: return 'Fair';
    case 3: return 'Moderate';
    case 4: return 'Poor';
    case 5: return 'Very Poor';
    default: return 'Unknown';
  }
};

// Helper function to get air quality color
const getAirQualityColor = (aqi: number): string => {
  switch (aqi) {
    case 1: return '#00e400';
    case 2: return '#ffff00';
    case 3: return '#ff7e00';
    case 4: return '#ff0000';
    case 5: return '#8f3f97';
    default: return '#666';
  }
};

const getUVIndex = (lat: number, lon: number): string => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 6 || hour > 18) return "0 (Night)";
  const latFactor = Math.abs(lat) / 90;
  const lonFactor = Math.cos((lon * Math.PI) / 180);
  const timeFactor = Math.sin((hour - 6) * Math.PI / 12);
  const uvEstimate = Math.round((1 - latFactor) * lonFactor * timeFactor * 10);
  return `${Math.max(0, uvEstimate)} (Estimated)`;
};

const getLocalTime = (timezoneOffset: number): string => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localTime = new Date(utc + timezoneOffset * 1000);
  return localTime.toLocaleTimeString();
};

export const WeatherDisplay: React.FC = () => {
  const { state } = useWeather();

  if (state.error) {
    return (
      <div className="error-container">
        <p className="error-message">❌ {state.error}</p>
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className="welcome-container">
        <p className="welcome-message">☀️ Enter a city name to get started!</p>
      </div>
    );
  }

  const { data } = state;
  const unitSymbol = state.unit === 'metric' ? '°C' : '°F';
  const speedUnit = state.unit === 'metric' ? 'm/s' : 'mph';
  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  return (
    <div className="weather-display">
      <div className="location">
        <h1>{data.name}, {data.sys.country}</h1>
        <p className="timestamp">Updated at {new Date(data.dt * 1000).toLocaleTimeString()}</p>
      </div>

      <div className="weather-main">
        <img src={weatherIcon} alt={data.weather[0].description} className="weather-icon" />
        <div className="temperature-section">
          <div className="current-temp">
            {Math.round(data.main.temp)}{unitSymbol}
          </div>
          <div className="weather-description">
            {data.weather[0].main} - {data.weather[0].description}
          </div>
          <div className="feels-like">
            Feels like {Math.round(data.main.feels_like)}{unitSymbol}
          </div>
        </div>
      </div>

      <div className="weather-details-grid">
        <div className="detail-card">
          <span className="detail-label">🌡️ Temp Range</span>
          <span className="detail-value">
            {Math.round(data.main.temp_min)}{unitSymbol} - {Math.round(data.main.temp_max)}{unitSymbol}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">💧 Humidity</span>
          <span className="detail-value">{data.main.humidity}%</span>
        </div>

        <div className="detail-card">
          <span className="detail-label">🌪️ Wind Speed</span>
          <span className="detail-value">{data.wind.speed.toFixed(1)} {speedUnit}</span>
        </div>

        <div className="detail-card">
          <span className="detail-label">🧭 Wind Direction</span>
          <span className="detail-value">
            {data.wind.deg}° ({getWindDirection(data.wind.deg)})
          </span>
        </div>

        {data.wind.gust && (
          <div className="detail-card">
            <span className="detail-label">💨 Wind Gusts</span>
            <span className="detail-value">{data.wind.gust.toFixed(1)} {speedUnit}</span>
          </div>
        )}

        <div className="detail-card">
          <span className="detail-label">🔽 Pressure</span>
          <span className="detail-value">{data.main.pressure} hPa</span>
        </div>

        {data.main.sea_level && (
          <div className="detail-card">
            <span className="detail-label">🌊 Sea Level Pressure</span>
            <span className="detail-value">{data.main.sea_level} hPa</span>
          </div>
        )}

        {data.main.grnd_level && (
          <div className="detail-card">
            <span className="detail-label">🏔️ Ground Level Pressure</span>
            <span className="detail-value">{data.main.grnd_level} hPa</span>
          </div>
        )}

        <div className="detail-card">
          <span className="detail-label">👁️ Visibility</span>
          <span className="detail-value">
            {(data.visibility / 1000).toFixed(1)} km
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">☁️ Cloudiness</span>
          <span className="detail-value">{data.clouds.all}%</span>
        </div>

        {data.rain && (
          <div className="detail-card">
            <span className="detail-label">🌧️ Rain (1h)</span>
            <span className="detail-value">
              {data.rain['1h'] ? `${data.rain['1h']} mm` : 'No data'}
            </span>
          </div>
        )}

        {data.snow && (
          <div className="detail-card">
            <span className="detail-label">❄️ Snow (1h)</span>
            <span className="detail-value">
              {data.snow['1h'] ? `${data.snow['1h']} mm` : 'No data'}
            </span>
          </div>
        )}

        <div className="detail-card">
          <span className="detail-label">🌅 Sunrise</span>
          <span className="detail-value">
            {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">🌇 Sunset</span>
          <span className="detail-value">
            {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">🕐 Local Time</span>
          <span className="detail-value">
            {getLocalTime(data.timezone)}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">📍 Coordinates</span>
          <span className="detail-value">
            {data.coord.lat.toFixed(2)}°, {data.coord.lon.toFixed(2)}°
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">🌍 Timezone</span>
          <span className="detail-value">
            UTC{data.timezone >= 0 ? '+' : ''}{(data.timezone / 3600).toFixed(0)}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">📊 UV Index</span>
          <span className="detail-value">
            {getUVIndex(data.coord.lat, data.coord.lon)}
          </span>
        </div>

        <div className="detail-card">
          <span className="detail-label">📊 UV Index</span>
          <span className="detail-value">
            {getUVIndex(data.coord.lat, data.coord.lon)}
          </span>
        </div>


        {data.airQuality && (
          <>
            <div className="detail-card air-quality-card">
              <span className="detail-label">🏭 Air Quality</span>
              <span className="detail-value" style={{ color: getAirQualityColor(data.airQuality.main.aqi) }}>
                {data.airQuality.main.aqi}/5 ({getAirQualityDescription(data.airQuality.main.aqi)})
              </span>
            </div>

            <div className="detail-card">
              <span className="detail-label">🫁 PM2.5</span>
              <span className="detail-value">
                {data.airQuality.components.pm2_5.toFixed(1)} μg/m³
              </span>
            </div>

            <div className="detail-card">
              <span className="detail-label">💨 PM10</span>
              <span className="detail-value">
                {data.airQuality.components.pm10.toFixed(1)} μg/m³
              </span>
            </div>

            <div className="detail-card">
              <span className="detail-label">⚠️ NO₂</span>
              <span className="detail-value">
                {data.airQuality.components.no2.toFixed(1)} μg/m³
              </span>
            </div>

            <div className="detail-card">
              <span className="detail-label">🌫️ O₃</span>
              <span className="detail-value">
                {data.airQuality.components.o3.toFixed(1)} μg/m³
              </span>
            </div>

            <div className="detail-card">
              <span className="detail-label">🏭 CO</span>
              <span className="detail-value">
                {(data.airQuality.components.co / 1000).toFixed(2)} mg/m³
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
