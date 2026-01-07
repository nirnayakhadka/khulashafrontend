import React, { useState, useEffect } from 'react';

function Nav() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({
    kathmandu: { temp: '...', loading: true },
    pokhara: { temp: '...', loading: true }
  });
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);

  // Fetch logo from backend
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/footer/public');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.footer && data.footer.logoUrl) {
          setLogoUrl(data.footer.logoUrl);
        }
      } catch (err) {
        console.error('Error fetching logo:', err);
      } finally {
        setLogoLoading(false);
      }
    };

    fetchLogo();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch Kathmandu weather
        const kathmanduResponse = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=27.7172&longitude=85.3240&current=temperature_2m'
        );
        const kathmanduData = await kathmanduResponse.json();

        // Fetch Pokhara weather
        const pokharaResponse = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=28.2096&longitude=83.9856&current=temperature_2m'
        );
        const pokharaData = await pokharaResponse.json();

        setWeatherData({
          kathmandu: {
            temp: kathmanduData.current.temperature_2m.toFixed(1),
            loading: false
          },
          pokhara: {
            temp: pokharaData.current.temperature_2m.toFixed(1),
            loading: false
          }
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherData({
          kathmandu: { temp: 'N/A', loading: false },
          pokhara: { temp: 'N/A', loading: false }
        });
      }
    };

    fetchWeather();
    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(fetchWeather, 600000);

    return () => clearInterval(weatherInterval);
  }, []);

  // Get English date and time
  const getEnglishDateTime = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const month = months[currentTime.getMonth()];
    const date = currentTime.getDate();
    const day = days[currentTime.getDay()];
    
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'pm' : 'am';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;
    
    return `${month} ${date} ${day}, ${hours}.${minutes} ${period}`;
  };

  // Convert to Nepali date format
  const getNepaliDate = () => {
    const nepaliMonths = [
      'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन',
      'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फाल्गुन', 'चैत'
    ];
    const nepaliDays = [
      'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार',
      'बिहिबार', 'शुक्रबार', 'शनिबार'
    ];

    // This is a simplified conversion - for accurate conversion, you'd need a proper library
    // For now, showing current Gregorian date with Nepali labels
    const day = currentTime.getDay();
    const date = currentTime.getDate();
    
    // Rough estimate: Nepali calendar is about 56-57 years ahead
    // This is approximate - use a proper library for production
    const month = 8; // Pus (December/January period)
    
    return `${nepaliMonths[month]} ${date} ${nepaliDays[day]}`;
  };

  // Format time in Nepali
  const getNepaliTime = () => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;
    
    // Convert to Nepali numerals
    const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const hoursStr = hours.toString().split('').map(d => nepaliNumerals[parseInt(d)]).join('');
    const minutesStr = minutes.split('').map(d => nepaliNumerals[parseInt(d)]).join('');
    
    return `${hoursStr}:${minutesStr} ${period}`;
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
          {/* Logo and Info Section */}
          <div className="md:text-left">
            {/* Logo */}
            <div className=" rounded-lg shadow-md inline-block">
              {logoLoading ? (
                <div className="h-16 w-48 flex items-center justify-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Khulasa Nepal Logo" 
                  className="h-16 w-auto object-contain"
                />
              ) : (
                // Fallback to text logo if no image is available
                <>
                  <h1 className="text-4xl font-bold">
                    <span className="text-purple-600">खुलासा</span>{' '}
                    <span className="text-red-500">नेपाल</span>
                  </h1>
                  <p className="text-sm text-gray-700 mt-1">Khulasanepal.com</p>
                </>
              )}
            </div>

            {/* Date, Time & Weather - Below the Logo */}
            <div className="mt-4 text-white">
              <p className="text-base font-medium">
                {getNepaliDate()}, {getNepaliTime()}
              </p>
              <p className="text-l opacity-90">
                {getEnglishDateTime()}
              </p>
            </div>
          </div>

          {/* Optional: Empty div for spacing on larger screens if needed */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </div>
  );
}

export default Nav;