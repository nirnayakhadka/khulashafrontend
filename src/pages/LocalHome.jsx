// LocalHome.jsx - Fixed with Pagination and Props
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NepaliDate from 'nepali-date-converter';
const LocalHome = ({ news = [] }) => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(18); // 6 featured + 6 most viewed + 6 additional
  
  const localNews = news;
  const hasMore = displayCount < localNews.length;

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };


const toNepaliNumber = (num) => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().split('').map(digit => nepaliDigits[digit]).join('');
};

const getTimeAgo = (dateString) => {
  const now = new Date();
  const published = new Date(dateString);
  const seconds = Math.floor((now - published) / 1000);

  if (seconds < 45) return "भर्खरै";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${toNepaliNumber(minutes)} ${minutes === 1 ? 'मिनेट' : 'मिनेट'} अघि`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${toNepaliNumber(hours)} ${hours === 1 ? 'घण्टा' : 'घण्टा'} अघि`;
  }

  // After 1 day, show the Nepali date with day and time
  const nepaliMonths = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
  ];

  const nepaliDays = [
    'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'
  ];

  const nepaliDate = new NepaliDate(published);
  const month = nepaliMonths[nepaliDate.getMonth()];
  const day = toNepaliNumber(nepaliDate.getDate());
  const dayOfWeek = nepaliDays[published.getDay()];

  // Get the time in 12-hour format
  let hours12 = published.getHours();
  const mins = published.getMinutes();
  const ampm = hours12 >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
  hours12 = hours12 % 12;
  hours12 = hours12 ? hours12 : 12; // Convert 0 to 12

  const formattedTime = `${toNepaliNumber(hours12)}:${toNepaliNumber(mins.toString().padStart(2, '0'))} ${ampm}`;

  return `${month} ${day} ${dayOfWeek}, ${formattedTime}`;
};

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getExcerpt = (item) => {
    const content = item.subtitle || item.paragraph || '';
    const plainText = stripHtml(content);
    return plainText.length > 80 ? plainText.substring(0, 80) + '...' : plainText;
  };

  // Get displayed items based on displayCount
  const displayedNews = localNews.slice(0, displayCount);

  // Featured news section (first 6 articles → 2 rows × 3 columns)
  const featuredNews = displayedNews.slice(0, 6);

  // Most viewed section (next 6 articles) - for sticky sidebar
  const mostViewedNews = displayedNews.slice(6, 12);

  // Additional cards section (next 6 articles) - for 2 rows × 2 columns
  const additionalCards = displayedNews.slice(12, 18);

  // Empty state
  if (localNews.length === 0) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-12 text-gray-500">
         
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl font-bold text-gray-900">
            स्थानीय
            <div className="h-1 w-32 bg-blue-600 rounded-full mt-4"></div>
          </h1>
          <button 
            onClick={() => navigate('/local')}
            className="text-blue-600 font-medium flex items-center gap-2 hover:gap-4 transition-all"
          >
            थप समाचार हेर्नुहोस्
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Featured News - 2 rows × 3 columns */}
        {featuredNews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/local/${item.id}`)}
                className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[4/3] lg:aspect-[4/3.2]"
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {item.hasVideo && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white" >
                  <h3 className="text-xl font-bold leading-normal mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Two Column Layout: Additional Cards (Left) + Most Viewed Sidebar (Right) */}
        {(additionalCards.length > 0 || mostViewedNews.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Additional Cards (2 rows × 2 columns) */}
            <div className="lg:col-span-2">
              {additionalCards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {additionalCards.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/local/${item.id}`)}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {getExcerpt(item)}
                        </p>
                        <div className="flex items-center gap-2 text-l text-gray-500">
                        
                          
                          <span>{getTimeAgo(item.publishedDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Sticky Most Viewed Sidebar */}
            <div className="lg:col-span-1">
              {mostViewedNews.length > 0 && (
                <div className="lg:sticky lg:top-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">थप समाचार</h2>
              
                    </div>
                    
                    <div className="space-y-4">
                      {mostViewedNews.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => navigate(`/local/${item.id}`)}
                          className="py-3 border-b border-gray-200 last:border-0 cursor-pointer group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{getTimeAgo(item.publishedDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default LocalHome;