import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';

const SportsHome = ({ news = [] }) => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(9); // 1 featured + 4 grid + 4 sidebar
  
  const sportsList = news;
  const hasMore = displayCount < sportsList.length;

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1200';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getCleanText = (text, maxLength = 150) => {
    const cleaned = stripHtml(text);
    if (cleaned.length > maxLength) {
      return cleaned.substring(0, maxLength) + '...';
    }
    return cleaned;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      if (diffInHours === 0) return 'भर्खरै';
      return `${diffInHours} घण्टा अघि`;
    }
    if (diffInDays === 1) return '१ दिन अघि';
    if (diffInDays < 7) return `${diffInDays} दिन अघि`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} हप्ता अघि`;
    return `${Math.floor(diffInDays / 30)} महिना अघि`;
  };

  // Get displayed items based on displayCount
  const displayedSports = sportsList.slice(0, displayCount);

  // Data slicing
  const featuredArticle = displayedSports[0];
  const gridArticles = displayedSports.slice(1, 5); // 4 articles for grid (2x2)
  const sidebarArticles = displayedSports.slice(5, 9); // 4 articles for sidebar

  const handleNavigate = (id) => {
    if (id === 'all') {
      navigate('/sports');
    } else {
      navigate(`/sports/${id}`);
    }
  };

  if (sportsList.length === 0) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-12 text-gray-500">
         
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            खेलखबर
            <div className="h-1 w-32 bg-blue-900 rounded-full mt-4"></div>
          </h1>
          <button 
            onClick={() => handleNavigate('all')}
            className="text-green-600 font-medium flex items-center gap-2 hover:gap-4 transition-all text-sm md:text-base"
          >
            थप हेर्नुहोस् <ChevronRight size={24} />
          </button>
        </div>

        {/* Main Layout - 2/3 Left + 1/3 Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left + Middle Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Large Card */}
            {featuredArticle && (
              <div 
                onClick={() => handleNavigate(featuredArticle.id)}
                className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer h-[450px] md:h-[550px]"
              >
                <img
                  src={getImageUrl(featuredArticle.image)}
                  alt={featuredArticle.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Right-side gradient only */}
                <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 drop-shadow-2xl group-hover:text-blue-400 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-100 line-clamp-2 mb-4 drop-shadow-lg">
                    {getCleanText(featuredArticle.subtitle || featuredArticle.paragraph, 150)}
                  </p>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Clock size={16} />
                    <span>{getTimeAgo(featuredArticle.publishedDate)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Articles - 2x2 */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gridArticles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  >
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.category && (
                        <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                        <Clock size={14} />
                        <span>{getTimeAgo(item.publishedDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
       
          {/* Right Sidebar - Compact List Format */}
          <div className="space-y-6">
            {sidebarArticles.length > 0 && sidebarArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Clock size={12} />
                    <span>{getTimeAgo(item.publishedDate)}</span>
                  </div>
                  
                  <h3 className="font-bold text-base text-gray-900 line-clamp-3 group-hover:text-blue-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 8)}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              थप खेलकुद समाचार हेर्नुहोस् ({sportsList.length - displayCount} बाँकी)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SportsHome;