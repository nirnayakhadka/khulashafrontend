// LocalHome.jsx - Fixed with Pagination and Props
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LocalHome = ({ news = [] }) => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(18); // 6 featured + 6 most viewed + 6 additional
  
  const localNews = news;
  const hasMore = displayCount < localNews.length;

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
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
            थप हेर्नुहोस्
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
                
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
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
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.journalistName || 'समाचारदाता'}</span>
                          <span>•</span>
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
                      <h2 className="text-2xl font-bold text-gray-900">सर्वाधिक पढिएको</h2>
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
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

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 12)}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              थप स्थानीय समाचार हेर्नुहोस् ({localNews.length - displayCount} बाँकी)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalHome;