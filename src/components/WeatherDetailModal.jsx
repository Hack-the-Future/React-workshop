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
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
      
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WeatherDetailModal