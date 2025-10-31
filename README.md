# Weather App

A React TypeScript application for displaying weather information, built with Vite.

## Prerequisites

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

## Project Structure

```
src/
├── components/
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   └── WeatherDisplay.tsx
├── contexts/
│   └── WeatherContext.tsx
├── styles/
│   ├── global.css
│   ├── Header.css
│   ├── SearchBar.css
│   └── WeatherDisplay.css
├── App.tsx
└── main.tsx
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/StandByPlease/Experiment3.git
   cd Experiment3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   This will start the Vite development server and open your application in the browser.

4. To build for production:
   ```bash
   npm run build
   ```

5. To preview the production build:
   ```bash
   npm run preview
   ```

## Technology Stack

- React 19
- TypeScript
- Vite
- Axios for API calls

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Features

- Weather information display
- Search functionality for different locations
- Responsive design with custom styling
- Context-based state management

## Folder Structure Details

- `components/` - Contains all React components
- `contexts/` - Contains React context for state management
- `styles/` - Contains CSS files for styling
- `App.tsx` - Main application component
- `main.tsx` - Application entry point