import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NepaliDate from 'nepali-date-converter';
const NewsHome = ({ news = [] }) => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(12);
  
  const newsList = news;
  const hasMore = displayCount < newsList.length;


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
    const excerpt = item.excerpt || item.paragraph || '';
    const plainText = stripHtml(excerpt);
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const displayedNews = newsList.slice(0, displayCount);

  if (newsList.length === 0) {
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
        <div className="bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">समाचार</h2>
            <div className="flex items-center gap-3">

              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedNews.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/news/${item.id}`)}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {getExcerpt(item)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    
                    <span>{getTimeAgo(item.publishedDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
};

export default NewsHome;