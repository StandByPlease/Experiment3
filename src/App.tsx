import { WeatherProvider } from './contexts/WeatherContext';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import './styles/global.css';

function App() {
  return (
    <WeatherProvider>
      <Header />
      <main style={{ flex: 1, paddingBottom: '2rem' }}>
        <SearchBar />
        <WeatherDisplay />
      </main>
    </WeatherProvider>
  );
}

export default App;