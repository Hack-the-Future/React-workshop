import { useState, useEffect, useRef } from 'react'
import './App.css'
import { 
  fetchCityWeather, 
  geocodeLocation, 
  loadMultipleCitiesWeather, 
  celsiusToFahrenheit
} from './services/weatherService'
import WeatherDetailModal from './components/WeatherDetailModal'

function App() {
  const [selectedCity, setSelectedCity] = useState(null)
  const [cityWeatherData, setCityWeatherData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [cityList, setCityList] = useState(() => [
    { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060, id: 1 },
    { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, id: 2 }
  ])
  const [addingCity, setAddingCity] = useState(false)
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])

  // Function to add a marker to the map
  const addMarkerToMap = (city) => {
    if (mapInstance.current && window.google) {
      const marker = new window.google.maps.Marker({
        position: { lat: city.lat, lng: city.lng },
        map: mapInstance.current,
        title: `${city.name}, ${city.state}`,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#22c55e" stroke="#ffffff" stroke-width="2"/>
              <circle cx="10" cy="10" r="3" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(20, 20)
        }
      })
      
      marker.addListener('click', () => {
        setSelectedCity(city)
      })
      
      markersRef.current.push(marker)
      return marker
    }
    return null
  }

  // Search for a city and add it to the list
  const addCity = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setError('Please enter a city and state (e.g., "Miami, FL")')
      return
    }

    setError('')

    // TODO: implement adding city to list

      // Get coordinates from the location name using geocoding service
      

      // Fetch weather for the new city

        // Add to dynamic cities list
        
        // Add weather data

        // Add marker to map

      // Clear search input
  }

  // Remove a city from the dynamic list
  const removeCity = (cityToRemove) => {
    // Remove from city list
    
    // Remove weather data


    // Remove marker from map


    // Clear selection if this city was selected
  
  }

  // All cities are now in dynamicCities (including defaults)
  const allCities = cityList

  // Load initial city weather data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      const initialCities = [
        { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060, id: 1 },
        { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, id: 2 }
      ]
      
      const weatherData = await loadMultipleCitiesWeather(initialCities)
      setCityWeatherData(weatherData)
      setLoading(false)
    }
    
    loadInitialData()
  }, [])

  // Initialize Google Map
  useEffect(() => {
    const initMap = async () => {
      try {
        // Load the Google Maps JavaScript API
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?&libraries=places`
        script.async = true
        script.defer = true
        
        script.onload = () => {
          if (mapRef.current && window.google) {
            const map = new window.google.maps.Map(mapRef.current, {
              center: { lat: 39.8283, lng: -98.5795 }, // Center of US
              zoom: 4,
              styles: [
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#74b9ff" }]
                }
              ]
            })
            
            mapInstance.current = map
            
            // Add markers for initial cities
            const initialCities = [
              { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060, id: 1 },
              { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, id: 2 }
            ]
            
            initialCities.forEach((city) => {
              addMarkerToMap(city)
            })
          }
        }
        
        script.onerror = () => {
          console.error('Error loading Google Maps script')
          setError('Unable to load map. Please check your API key.')
        }
        
        // Only append script if it hasn't been loaded already
        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
          document.head.appendChild(script)
        } else if (window.google && mapRef.current) {
          // If script already loaded, initialize map directly
          script.onload()
        }
        
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setError('Unable to load map. Please check your API key.')
      }
    }

    initMap()
  }, [])

  const formatTemp = (tempCelsius) => {
    if (tempCelsius === null || tempCelsius === undefined) return 'N/A'
    return celsiusToFahrenheit(tempCelsius)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="w-full px-6 py-4">
          <h1 className="text-white text-3xl font-bold">
            🌤️ US Weather Dashboard
          </h1>
        </div>
      </div>

      {error && (
        <div className="w-full px-6 py-4">
          <div className="bg-red-500 text-white p-4 rounded-xl text-center shadow-lg">
            {error}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-120px)]">
        
        {/* Left Panel - City List */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Weather Cities
          </h2>
          
          {/* Search Bar */}
          <form onSubmit={addCity} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Add city (e.g., Miami, FL)..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
                disabled={addingCity}
                autoComplete="off"
              />
              <button 
                type="submit" 
                disabled={addingCity || !searchQuery.trim()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white border-none rounded-xl cursor-pointer text-sm font-semibold transition-colors duration-300 shadow-lg"
              >
                {addingCity ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
          
          {loading && (
            <div className="text-center py-8">
              <div className="text-blue-600 text-lg">Loading weather data...</div>
            </div>
          )}
          
          <div className="space-y-4">
            {allCities.map((city) => {
              const weather = cityWeatherData[city.name]
              return (
                <div 
                  key={`${city.name}-${city.state}`}
                  className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 rounded-xl p-4 border hover:shadow-lg transition-all duration-300 cursor-pointer hover:from-green-100 hover:to-green-200 relative"
                  onClick={() => setSelectedCity(city)}
                >
                  {/* Remove button for all cities */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCity(city)
                    }}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold transition-colors duration-200 flex items-center justify-center"
                    title="Remove city"
                  >
                    ×
                  </button>
                  
                  <div className="flex justify-between items-center pl-10">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {city.name}, {city.state}
                      </h3>
                      {weather ? (
                        <div className="text-sm text-gray-600 mt-1">
                          {weather.current.description}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Loading...</div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {weather && weather.current.icon && (
                        <img 
                          src={weather.current.icon}
                          alt={weather.current.description}
                          className="w-12 h-12"
                        />
                      )}
                      {weather && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatTemp(weather.current.temperature)}°F
                          </div>
                          {weather.current.humidity && (
                            <div className="text-xs text-gray-500">
                              {weather.current.humidity}% humidity
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            United States Map
          </h2>
          
          <div 
            ref={mapRef} 
            className="w-full h-[500px] rounded-xl border border-gray-300 bg-gray-100"
          >
            {/* Fallback content if Google Maps doesn't load */}
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <div>Loading Map...</div>
                <div className="text-sm mt-2">
                  Add your Google Maps API key to enable the interactive map
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Weather Detail Modal */}
      <WeatherDetailModal
        city={selectedCity}
        weatherData={selectedCity ? cityWeatherData[selectedCity.name] : null}
        onClose={() => setSelectedCity(null)}
      />
    </div>
  )
}

export default App
