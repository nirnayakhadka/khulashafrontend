import React, { useState } from 'react';
import { Calendar, Clock, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MoreHome = ({ news = [] }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [displayCount, setDisplayCount] = useState(12);
  
  const articles = news;
  const hasMore = displayCount < articles.length;

  const getImageUrl = (image) => {
    if (!image) return 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg';
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ne-NP', options);
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Get displayed articles based on displayCount
  const displayedArticles = articles.slice(0, displayCount);

  // Trending and popular posts (from remaining articles not in main display)
  const trendingPosts = articles.slice(0, 3);
  const popularPosts = articles.slice(3, 6);

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-12 text-gray-500">
          अन्य समाचार खण्डमा कुनै सामग्री छैन
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Latest News */}
          <main className="w-full lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">नवीनतम समाचार</h3>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-blue-900'}`}
                  aria-label="List view"
                >
                  <List size={20} className="sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-blue-900'}`}
                  aria-label="Grid view"
                >
                  <Grid size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Posts Grid/List - Fully Responsive */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8' 
                : 'space-y-6 sm:space-y-10'
            }>
              {displayedArticles.map((post) => (
                <article
                  key={post.id}
                  onClick={() => navigate(`/more/${post.id}`)}
                  className={`bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group ${
                    viewMode === 'list' 
                      ? 'flex flex-row gap-3 sm:gap-6 lg:gap-8' 
                      : 'flex flex-col'
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden flex-shrink-0 ${
                    viewMode === 'list'
                      ? 'w-32 h-32 xs:w-40 xs:h-40 sm:w-64 sm:h-56 md:w-80 md:h-64 lg:w-96'
                      : 'w-full h-48 sm:h-56 md:h-64'
                  }`}>
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 flex flex-col justify-between min-w-0 ${
                    viewMode === 'list' 
                      ? 'p-3 sm:p-6 lg:p-8' 
                      : 'p-4 sm:p-6'
                  }`}>
                    <div>
                      <h4 className={`font-bold mb-2 sm:mb-3 lg:mb-4 hover:text-blue-900 transition ${
                        viewMode === 'list' 
                          ? 'text-base sm:text-2xl lg:text-3xl line-clamp-2' 
                          : 'text-lg sm:text-xl line-clamp-2'
                      }`}>
                        {post.title}
                      </h4>
                      <p className={`text-gray-600 leading-relaxed ${
                        viewMode === 'list' 
                          ? 'text-xs sm:text-base lg:text-lg mb-2 sm:mb-4 lg:mb-6 line-clamp-2 sm:line-clamp-3' 
                          : 'text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3'
                      }`}>
                        {post.subtitle || stripHtml(post.paragraph)?.substring(0, viewMode === 'list' ? 200 : 120) + '...' || ''}
                      </p>
                    </div>
                    
                    <div className={`flex flex-row sm:flex-row sm:items-center text-gray-500 gap-1 sm:gap-2 lg:gap-6 mt-auto ${
                      viewMode === 'list' 
                        ? 'text-xs sm:text-sm' 
                        : 'text-xs sm:text-sm'
                    }`}>
                      <span className="flex items-center gap-1 sm:gap-2">
                        <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">{formatDate(post.publishedDate)}</span>
                      </span>
                      <span className="flex items-center gap-1 sm:gap-2">
                        <Clock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{getTimeAgo(post.publishedDate)}</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 sm:mt-12 text-center">
                <button
                  onClick={() => setDisplayCount(prev => prev + 12)}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  थप समाचार हेर्नुहोस् ({articles.length - displayCount} बाँकी)
                </button>
              </div>
            )}
          </main>

          {/* Right Sidebar - Responsive */}
          <aside className="w-full lg:w-1/4">
            <div className="lg:sticky lg:top-8 space-y-6 sm:space-y-8">
              {/* Trending Section */}
              {trendingPosts.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-red-700">ट्रेन्डिङ</h3>
                  <ol className="space-y-4 sm:space-y-6">
                    {trendingPosts.map((post, index) => (
                      <li 
                        key={post.id} 
                        onClick={() => navigate(`/more/${post.id}`)}
                        className="flex gap-3 sm:gap-4 cursor-pointer group"
                      >
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-200 group-hover:text-blue-900 transition-colors flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base sm:text-lg hover:text-blue-900 transition line-clamp-2">
                            {post.title}
                          </p>
                          <span className="text-xs sm:text-sm text-gray-500 mt-1 block">
                            {getTimeAgo(post.publishedDate)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Popular Section */}
              {popularPosts.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-red-700">लोकप्रिय</h3>
                  <div className="space-y-4 sm:space-y-6">
                    {popularPosts.map((post) => (
                      <div 
                        key={post.id} 
                        onClick={() => navigate(`/more/${post.id}`)}
                        className="flex gap-3 sm:gap-4 cursor-pointer group"
                      >
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                        />
                        <p className="font-medium text-sm sm:text-base hover:text-blue-900 transition line-clamp-2 flex-1 min-w-0">
                          {post.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* View All Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => navigate('/more')}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold text-base sm:text-lg rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
          >
            सबै समाचार हेर्नुहोस्
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreHome;