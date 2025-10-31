import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// Types
export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface AirQualityData {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface AirQualityInfo {
  main: {
    aqi: number; // Air Quality Index: 1-5 (1=Good, 5=Very Poor)
  };
  components: AirQualityData;
  dt: number;
}

export interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface City {
  name: string;
  country: string;
}

export interface WeatherInfo {
  coord: { lon: number; lat: number };
  weather: WeatherData[];
  main: MainData;
  visibility: number;
  wind: WindData;
  clouds: { all: number };
  dt: number;
  sys: { 
    country: string; 
    sunrise: number; 
    sunset: number;
    type?: number;
    id?: number;
    message?: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
  base?: string;
  rain?: { '1h'?: number; '3h'?: number };
  snow?: { '1h'?: number; '3h'?: number };
  airQuality?: AirQualityInfo;
}

export interface WeatherState {
  data: WeatherInfo | null;
  loading: boolean;
  error: string | null;
  searchHistory: string[];
  unit: 'metric' | 'imperial';
  lastUpdated: number | null;
}

export type WeatherAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: WeatherInfo }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'TOGGLE_UNIT' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_ERROR' };

interface WeatherContextType {
  state: WeatherState;
  fetchWeather: (city: string) => Promise<void>;
  toggleUnit: () => void;
  clearHistory: () => void;
  clearError: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  searchHistory: [],
  unit: 'metric',
  lastUpdated: null,
};

const weatherReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
      };
    case 'ADD_TO_HISTORY': {
      const newHistory = [
        action.payload,
        ...state.searchHistory.filter((item) => item !== action.payload),
      ].slice(0, 5);
      return {
        ...state,
        searchHistory: newHistory,
      };
    }
    case 'TOGGLE_UNIT':
      return {
        ...state,
        unit: state.unit === 'metric' ? 'imperial' : 'metric',
      };
    case 'CLEAR_HISTORY':
      return {
        ...state,
        searchHistory: [],
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';

  const fetchWeather = useCallback(
    async (city: string) => {
      dispatch({ type: 'FETCH_START' });

      try {

        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: city,
              units: state.unit,
              appid: API_KEY,
            },
          }
        );

        const weatherData = weatherResponse.data;


        try {
          const airQualityResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution`,
            {
              params: {
                lat: weatherData.coord.lat,
                lon: weatherData.coord.lon,
                appid: API_KEY,
              },
            }
          );


          weatherData.airQuality = airQualityResponse.data.list[0];
        } catch (airError) {

          weatherData.airQuality = null;
        }

        dispatch({ type: 'FETCH_SUCCESS', payload: weatherData });
        dispatch({ type: 'ADD_TO_HISTORY', payload: city });
      } catch (error) {
        const errorMessage =
          error instanceof axios.AxiosError
            ? error.response?.data?.message || error.message
            : 'Failed to fetch weather data';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      }
    },
    [state.unit, API_KEY]
  );

  const toggleUnit = useCallback(() => {
    dispatch({ type: 'TOGGLE_UNIT' });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: WeatherContextType = {
    state,
    fetchWeather,
    toggleUnit,
    clearHistory,
    clearError,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
