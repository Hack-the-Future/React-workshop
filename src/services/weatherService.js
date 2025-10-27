// Weather service for fetching data from weather.gov API

/**
 * Convert Celsius to Fahrenheit for display
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32);

/**
 * Convert meters per second to mph
 * @param {number} ms - Speed in meters per second
 * @returns {number} Speed in miles per hour
 */
export const msToMph = (ms) => Math.round(ms * 2.237);

/**
 * Fetch weather data for a specific city using weather.gov API
 * @param {Object} city - City object with lat, lng, name, and state properties
 * @returns {Promise<Object|null>} Weather data object or null if failed
 */
export const fetchCityWeather = async (city) => {
  try {
    // Get weather station info from weather.gov
    const pointsResponse = await fetch(
      `https://api.weather.gov/points/${city.lat},${city.lng}`
    );
    
    if (!pointsResponse.ok) {
      throw new Error('Location not supported by weather.gov');
    }
    
    const pointsData = await pointsResponse.json();
    
    // Get current conditions
    const forecastResponse = await fetch(pointsData.properties.forecast);
    const observationsResponse = await fetch(pointsData.properties.observationStations);
    
    if (!forecastResponse.ok) {
      throw new Error('Unable to fetch weather data');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Try to get current observations
    let currentTemp = null;
    let humidity = null;
    let windSpeed = null;
    
    try {
      const stationsData = await observationsResponse.json();
      if (stationsData.features && stationsData.features.length > 0) {
        const stationUrl = stationsData.features[0].id;
        const currentResponse = await fetch(`${stationUrl}/observations/latest`);
        
        if (currentResponse.ok) {
          const currentData = await currentResponse.json();
          const props = currentData.properties;
          
          if (props.temperature && props.temperature.value !== null) {
            currentTemp = props.temperature.value; // Already in Celsius
          }
          if (props.relativeHumidity && props.relativeHumidity.value !== null) {
            humidity = Math.round(props.relativeHumidity.value);
          }
          if (props.windSpeed && props.windSpeed.value !== null) {
            windSpeed = props.windSpeed.value; // m/s
          }
        }
      }
    } catch {
      console.log('Could not fetch current observations, using forecast data');
    }
    
    const currentPeriod = forecastData.properties.periods[0];
    
    // Parse temperature from forecast if we don't have current observation
    if (currentTemp === null && currentPeriod.temperature) {
      // Convert to Celsius if the forecast is in Fahrenheit
      currentTemp = currentPeriod.temperatureUnit === 'F' 
        ? (currentPeriod.temperature - 32) * 5/9 
        : currentPeriod.temperature;
    }
    
    return {
      location: {
        name: city.name,
        state: city.state
      },
      current: {
        temperature: currentTemp,
        description: currentPeriod.shortForecast,
        detailedForecast: currentPeriod.detailedForecast,
        humidity: humidity,
        windSpeed: windSpeed,
        icon: currentPeriod.icon
      },
      forecast: forecastData.properties.periods.slice(0, 3)
    };
  } catch (err) {
    console.error(`Error fetching weather for ${city.name}:`, err);
    return null;
  }
};

/**
 * Geocode a location string to get coordinates
 * @param {string} locationQuery - Location string (e.g., "Miami, FL")
 * @returns {Promise<Object>} Object with lat, lng, name, and state
 */
export const geocodeLocation = async (locationQuery) => {
  const geocodeResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&countrycodes=us&limit=1`
  );
  
  if (!geocodeResponse.ok) {
    throw new Error('Unable to find location');
  }
  
  const geocodeData = await geocodeResponse.json();
  
  if (geocodeData.length === 0) {
    throw new Error('City not found. Please use format: "City, State" (e.g., "Miami, FL")');
  }
  
  const lat = parseFloat(geocodeData[0].lat);
  const lng = parseFloat(geocodeData[0].lon);
  
  // Extract city name and state from the display name
  const displayNameParts = geocodeData[0].display_name.split(',');
  const cityName = displayNameParts[0].trim();
  const stateName = displayNameParts[1]?.trim() || 'Unknown';
  
  return {
    name: cityName,
    state: stateName,
    lat: lat,
    lng: lng,
    id: Date.now() // Simple unique ID
  };
};

/**
 * Load weather data for multiple cities
 * @param {Array} cities - Array of city objects
 * @returns {Promise<Object>} Object with city names as keys and weather data as values
 */
export const loadMultipleCitiesWeather = async (cities) => {
  const weatherPromises = cities.map(city => 
    fetchCityWeather(city).then(weather => ({ city: city.name, weather }))
  );
  
  const results = await Promise.all(weatherPromises);
  const weatherData = {};
  
  results.forEach(result => {
    if (result.weather) {
      weatherData[result.city] = result.weather;
    }
  });
  
  return weatherData;
};