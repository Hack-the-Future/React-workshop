import { celsiusToFahrenheit, msToMph } from '../services/weatherService'

const WeatherDetailModal = ({ city, weatherData, onClose }) => {
  if (!city || !weatherData) return null

  const formatTemp = (tempCelsius) => {
    if (tempCelsius === null || tempCelsius === undefined) return 'N/A'
    return celsiusToFahrenheit(tempCelsius)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
              title="Close"
            >
              <span className="text-white text-lg font-bold">×</span>
            </button>
            
            <h2 className="text-2xl font-bold mb-2">
              {city.name}, {city.state}
            </h2>
            
            <div className="flex items-center space-x-4">
              {weatherData.current.icon && (
                <img 
                  src={weatherData.current.icon}
                  alt={weatherData.current.description}
                  className="w-16 h-16"
                />
              )}
              <div>
                <div className="text-4xl font-bold">
                  {formatTemp(weatherData.current.temperature)}°F
                </div>
                <div className="text-lg capitalize opacity-90">
                  {weatherData.current.description}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {weatherData.current.humidity && (
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">💧</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {weatherData.current.humidity}%
                  </div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
              )}
              
              {weatherData.current.windSpeed && (
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">💨</div>
                  <div className="text-2xl font-bold text-green-600">
                    {msToMph(weatherData.current.windSpeed)}
                  </div>
                  <div className="text-sm text-gray-600">mph</div>
                </div>
              )}

              {weatherData.current.pressure && (
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(weatherData.current.pressure)}
                  </div>
                  <div className="text-sm text-gray-600">hPa</div>
                </div>
              )}

              {weatherData.current.visibility && (
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {Math.round(weatherData.current.visibility / 1000)}
                  </div>
                  <div className="text-sm text-gray-600">km</div>
                </div>
              )}
            </div>

            {/* Detailed Forecast */}
            {weatherData.current.detailedForecast && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Forecast Details
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {weatherData.current.detailedForecast}
                </p>
              </div>
            )}

            {/* Coordinates */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Coordinates: {city.lat.toFixed(4)}°, {city.lng.toFixed(4)}°
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WeatherDetailModal