import React, { useState } from "react";

// --- Style Objects ---
// Using objects for styles instead of a separate CSS file or Tailwind
const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'sans-serif',
    transition: 'background 0.5s ease',
  },
  card: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    transition: 'background 0.5s ease, color 0.5s ease',
    backdropFilter: 'blur(10px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  themeIcon: {
    width: '32px',
    height: '32px',
    cursor: 'pointer',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '600',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '16px',
  },
  weatherInfo: {
    marginTop: '16px',
  },
  error: {
    color: '#ef4444',
  },
  location: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  weatherDetail: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '18px',
    marginBottom: '4px',
  },
  detailIcon: {
    width: '24px',
    height: '24px',
  },
  placeholderText: {
    color: '#6b7280',
  },
};

// --- Theme-specific styles ---
const themeStyles = {
  light: {
    app: {
      background: 'linear-gradient(to right, #f8fafc, #e2e8f0)',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      color: '#0f172a',
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
    },
    placeholderText: {
        color: '#6b7280'
    }
  },
  dark: {
    app: {
      background: 'linear-gradient(to right, #0f172a, #1e293b)',
    },
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      color: '#f8fafc',
    },
    input: {
        backgroundColor: '#4a5568',
        color: '#fff',
        borderColor: '#718096'
    },
    placeholderText: {
        color: '#a0aec0'
    }
  },
};


// --- Main App Component ---
function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState("");
  
  // It's recommended to use an environment variable for the API key in a real app
  const API_KEY = "5d0c5b132b7f4af3b6395414252309"; 

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  
  const getConditionIcon = (condition) => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes("sun") || lowerCaseCondition.includes("clear")) {
      return "https://img.icons8.com/fluency/48/sun.png";
    } else if (lowerCaseCondition.includes("rain")) {
      return "https://img.icons8.com/fluency/48/rain.png";
    } else if (lowerCaseCondition.includes("cloud")) {
      return "https://img.icons8.com/fluency/48/cloud.png";
    }
    return "https://img.icons8.com/fluency/48/partly-cloudy-day.png";
  };

  const fetchWeather = async () => {
    setError("");
    setWeather(null);

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Could not find city.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Combine base styles with theme-specific styles
  const currentTheme = themeStyles[theme];

  return (
    <div style={{...styles.app, ...currentTheme.app}}>
      <div style={{...styles.card, ...currentTheme.card}}>
        
        <div style={styles.header}>
          <h1 style={styles.title}>Weather</h1>
          <img
            onClick={toggleTheme}
            src={
              theme === "light"
                ? "https://img.icons8.com/ios-filled/50/000000/moon-symbol.png"
                : "https://img.icons8.com/ios-filled/50/ffffff/sun--v1.png"
            }
            alt="Toggle theme"
            style={styles.themeIcon}
          />
        </div>

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text"
          placeholder="Enter city name"
          style={{...styles.input, ...currentTheme.input}}
        />

        <button onClick={fetchWeather} style={styles.button}>
          Search
        </button>

        <div style={styles.weatherInfo}>
          {error && <p style={styles.error}>{error}</p>}

          {weather && (
            <div>
              <h2 style={styles.location}>
                {weather.location.name}, {weather.location.country}
              </h2>
              
              <img
                src={getConditionIcon(weather.current.condition.text)}
                alt="Weather condition"
                style={{ margin: '0 auto 12px auto' }}
              />

              <div style={styles.weatherDetail}>
                <img src="https://img.icons8.com/fluency/24/temperature.png" alt="temp" style={styles.detailIcon}/>
                <span>Temperature: {weather.current.temp_c}°C</span>
              </div>

              <div style={styles.weatherDetail}>
                <img src={getConditionIcon(weather.current.condition.text)} alt="condition" style={styles.detailIcon}/>
                <span>Condition: {weather.current.condition.text}</span>
              </div>

              <div style={styles.weatherDetail}>
                <img src="https://img.icons8.com/fluency/24/hygrometer.png" alt="humidity" style={styles.detailIcon}/>
                <span>Humidity: {weather.current.humidity}%</span>
              </div>

              <div style={styles.weatherDetail}>
                <img src="https://img.icons8.com/fluency/24/wind.png" alt="wind" style={styles.detailIcon}/>
                <span>Wind: {weather.current.wind_kph} kph</span>
              </div>
            </div>
          )}

          {!error && !weather && (
            <p style={{...styles.placeholderText, ...currentTheme.placeholderText}}>
              Enter a city to see the weather.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
