import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import '../styles/Header.css';

export const Header: React.FC = () => {
  const { state, toggleUnit, clearHistory } = useWeather();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">⛅ Weather App</h1>
        <div className="header-controls">
          <button
            className="unit-toggle"
            onClick={toggleUnit}
            title="Toggle between Celsius and Fahrenheit"
          >
            {state.unit === 'metric' ? '°C → °F' : '°F → °C'}
          </button>
          {state.searchHistory.length > 0 && (
            <button
              className="clear-history-btn"
              onClick={clearHistory}
              title="Clear search history"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
