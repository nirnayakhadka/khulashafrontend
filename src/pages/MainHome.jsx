import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import khulashaLogo from '../assets/image/khulashalogo.png';
import NepaliDate from 'nepali-date-converter';
const API_URL = import.meta.env.VITE_API_URL 
function MainHome({ news = [] }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Simplified navigation using 'category' field
  const navigateToArticle = (newsItem) => {
    const category = newsItem.category || 'news';
    navigate(`/${category}/${newsItem.id}`);
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1504711434969-e338f2762819?w=600';
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

  const nextSlide = () => {
    if (carouselNews.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % carouselNews.length);
    }
  };

  const prevSlide = () => {
    if (carouselNews.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + carouselNews.length) % carouselNews.length);
    }
  };

  // Use the passed 'news' prop directly
  const mainNewsData = news;

  // Section assignments

const heroNews = mainNewsData.slice(0, 3);           // Items 0-2 (3 items)
const trendingNews = mainNewsData.slice(3, 5);       // Items 3-4 (2 items)
const cultureNews = mainNewsData[5];                 // Item 5 (1 item)
const sidebarNews = mainNewsData.slice(6, 11);       // Items 6-10 (5 items) - थप समाचार
const carouselNews = mainNewsData.slice(11);         // Items 11+ (remaining) - थप रोचक सामग्री
  // Empty state
  if (mainNewsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">कुनै मुख्य समाचार उपलब्ध छैन</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section - Latest 3 News */}
        {heroNews.length > 0 && (
          <div className="my-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
                {heroNews.map((newsItem, index) => {


                  return (
                    <div key={newsItem.id} className="w-full">
                      <div 
                        onClick={() => navigateToArticle(newsItem)}
                        className="cursor-pointer"
                      >
                        {/* Title and Meta Above Photo */}
                        <div className="mb-4 md:mb-6 text-center max-w-4xl mx-auto">
                          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-normal mb-3 text-gray-900 hover:text-blue-800 transition-colors line-clamp-3 leading-normal">
                            {newsItem.title}
                          </h2>
                          
                          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-gray-600 ">
<div className="flex items-center gap-2">
  <img
    src={newsItem.journalistImage ? getImageUrl(newsItem.journalistImage) : khulashaLogo}
    alt={newsItem.journalistName || "Khulasha Nepal"}
    className={`
      w-15 h-15 
      rounded-full 
      object-cover
      border-4 border-blue-500/80
      transition-all duration-300
      hover:border-blue-600 
      hover:scale-105
      hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.5)]
    `}
  />
  <span className="text-base md:text-xl font-bold">{newsItem.journalistName}</span>
</div>
                            
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500" />
                          <span className="text-l font-bold md:text-base">
                            {getTimeAgo(newsItem.publishedDate)}
                          </span>
                        </div>
                          </div>
                        </div>
                        
                        {/* Photo */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] lg:h-[550px] group mb-4 md:mb-6">
                          <img 
                            src={getImageUrl(newsItem.image)} 
                            alt={newsItem.title} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        
                        {/* Subtitle and Highlight */}
                        <div className="space-y-3">
                          {newsItem.subtitle && (
                            <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                              {newsItem.subtitle}
                            </h3>
                          )}
                          {newsItem.paragraph && (
                            <p className="text-xl text-gray-700 line-clamp-2 leading-relaxed">
                              {newsItem.paragraph
                                .replace(/<[^>]*>/g, '')
                                .replace(/&nbsp;/g, ' ')
                                .trim()
                                .split('\n')[0]
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Trending News - Next 2 */}
        {trendingNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {trendingNews.map((trending) => (
              <div 
                key={trending.id} 
                onClick={() => navigateToArticle(trending)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 transition-transform duration-300">
                  <img src={getImageUrl(trending.image)} alt={trending.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent " />
                  <div className="absolute bottom-8 left-8 text-white hover:text-blue-700">
                    <h3 className="text-l font-bold mt-4 line-clamp-3 ">{trending.title}</h3>
                    <div className="flex items-center gap-4 mt-4">

                      
                      <span className="text-sm text-gray-200">{getTimeAgo(trending.publishedDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Culture / Featured Section */}
        {cultureNews && (
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-10">
              <div className="lg:col-span-3">
                <div 
                  onClick={() => navigateToArticle(cultureNews)}
                  className="relative rounded-2xl overflow-hidden shadow-2xl h-[540px] group cursor-pointer"
                >
                  <img src={getImageUrl(cultureNews.image)} alt={cultureNews.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent "></div>
                  <div className="absolute bottom-0 p-10 text-white">
                    <h2 className="text-2xl font-bold leading-normal line-clamp-2 hover:text-blue-700">{cultureNews.title}</h2>
                    <div className="flex items-center gap-4 mt-4">
                      {cultureNews.journalistImage && (
                        <img 
                          src={getImageUrl(cultureNews.journalistImage)} 
                          alt={cultureNews.journalistName}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                      )}
                     
                      <span className="text-sm text-gray-300">{getTimeAgo(cultureNews.publishedDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-[540px] p-6 flex flex-col">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">थप समाचार</h3>
                  <div className="space-y-4 flex-1 overflow-y-auto">
                    {sidebarNews.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => navigateToArticle(item)}
                        className="group cursor-pointer border-b border-gray-200 pb-4 last:border-b-0 hover:text-blue-950 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex gap-3">
                          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <img 
                              src={getImageUrl(item.image)} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors text-m mb-1">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              
                           
                              <span>{getTimeAgo(item.publishedDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carousel Section */}

{/* Carousel Section */}
{carouselNews.length > 0 && (
  <div className="mb-20">
    <div className="mt-10 bg-white rounded-2xl overflow-hidden shadow-2xl">

      <div className="bg-gray-100">
        
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            {/* Mobile view - show 1 item at a time */}
            <div className="md:hidden">
              <div className="flex transition-transform duration-600 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {carouselNews.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 px-3">
                    <div 
                      onClick={() => navigateToArticle(item)}
                      className="h-72 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group relative"
                    >
                      <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl flex items-end p-6">
                        <div>
                          <p className="text-white font-bold text-lg line-clamp-3 leading-normal md: text-m">{item.title}</p>
                          <div className="flex items-center gap-2 mt-2">

                            <p className="text-xs text-gray-300"> {getTimeAgo(item.publishedDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop view - show 3 items at a time */}
            <div className="hidden md:block">
              <div className="flex transition-transform duration-600 ease-in-out" style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}>
                {carouselNews.map((item) => (
                  <div key={item.id} className="flex-shrink-0 px-3" style={{ width: "33.333%" }}>
                    <div 
                      onClick={() => navigateToArticle(item)}
                      className="h-72 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group relative"
                    >
                      <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl flex items-end p-6 ">
                        <div>
                          <p className="text-white font-bold text-s line-clamp-3">{item.title}</p>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation buttons - only show if there are enough items */}
          {carouselNews.length > 3 && (
            <>
              <button 
                onClick={prevSlide} 
                disabled={currentSlide === 0}
                className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="text-gray-800" />
              </button>
              <button 
                onClick={nextSlide} 
                disabled={currentSlide >= carouselNews.length - 3}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="text-gray-800" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {carouselNews.length > 3 && (
            <div className="flex justify-center gap-2 mt-6 mb-6">
              {Array.from({ length: Math.max(0, carouselNews.length - 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-gray-800 w-8' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default MainHome;