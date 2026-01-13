import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NepaliDate from 'nepali-date-converter';
const API_URL = import.meta.env.VITE_API_URL 
const SocietyHome = ({ news = [] }) => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(7);
  
  const societyData = news;
  const hasMore = displayCount < societyData.length;

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80';
    return image.startsWith('http') ? image : `${API_URL}${image}`;
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
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  // Display logic: first item as featured, then show displayCount items
  const displayedData = societyData.slice(0, displayCount);
  const featuredArticle = displayedData[0];
  const gridArticles = displayedData.slice(1);

  if (societyData.length === 0) {
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
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            समाज
          </h1>
          <button 
            onClick={() => navigate('/society')}
            className="text-blue-600 font-medium flex items-center gap-2 hover:gap-4 transition-all"
          >
            थप समाचार हेर्नुहोस् <ChevronRight size={24} />
          </button>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div 
            onClick={() => navigate(`/society/${featuredArticle.id}`)}
            className="group cursor-pointer mb-12 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <div className="p-8 md:p-12 pb-6">
              <h2 className="text-4xl md:text-4xl font-bold leading-normal text-gray-900 group-hover:text-blue-900 transition-colors">
                {featuredArticle.title}
              </h2>
              <div className="flex items-center gap-4 mt-4">
                
                <span className="text-sm text-gray-600">
                  {getTimeAgo(featuredArticle.publishedDate)}
                </span>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[550px] overflow-hidden">
              <img
                src={getImageUrl(featuredArticle.image)}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="p-8 md:p-12 pt-6">
              <p className="text-xl md:text-xl text-gray-700 leading-relaxed">
                {getExcerpt(featuredArticle)}
              </p>
            </div>
          </div>
        )}

        {/* Society Grid */}
        {gridArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
            {gridArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/society/${item.id}`)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-[280px] sm:h-[320px] overflow-hidden">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold leading-tight mb-3 text-gray-900 group-hover:text-blue-900 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-base md:text-lg text-gray-600 line-clamp-2">
                    {getExcerpt(item)}
                  </p>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {getTimeAgo(item.publishedDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SocietyHome;