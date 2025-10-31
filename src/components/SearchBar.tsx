import React, { useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import '../styles/SearchBar.css';

export const SearchBar: React.FC = () => {
  const [input, setInput] = useState('');
  const { fetchWeather, state } = useWeather();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await fetchWeather(input);
      setInput('');
    }
  };

  const handleHistoryClick = (city: string) => {
    fetchWeather(city);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a city..."
          className="search-input"
          disabled={state.loading}
        />
        <button type="submit" className="search-button" disabled={state.loading}>
          {state.loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {state.searchHistory.length > 0 && (
        <div className="search-history">
          <h3>Recent Searches</h3>
          <div className="history-list">
            {state.searchHistory.map((city) => (
              <button
                key={city}
                className="history-item"
                onClick={() => handleHistoryClick(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
