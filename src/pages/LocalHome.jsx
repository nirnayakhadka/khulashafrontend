// LocalHome.jsx - स्थानीय Page with Backend Integration
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LocalHome = () => {
  const navigate = useNavigate();
  const [localNews, setLocalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocalNews();
  }, []);

  const fetchLocalNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/local');
      if (!response.ok) throw new Error('Failed to fetch local news');
      const data = await response.json();
      setLocalNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load local news articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  // Featured news section (first 4 articles)
  const featuredNews = localNews.slice(0, 4);

  // Trending news section (next 6 articles)
  const trendingNews = localNews.slice(4, 10);

  // Most viewed section (next 6 articles)
  const mostViewedNews = localNews.slice(10, 16);

  // Loading state
  if (loading) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">स्थानीय समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button 
              onClick={fetchLocalNews}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              पुन: प्रयास गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (localNews.length === 0) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">स्थानीय समाचार उपलब्ध छैन</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
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

        {/* Main 3-Column Layout with Sticky Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left + Middle Column: Feature News + Trending News (takes 2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured News Section */}
            {featuredNews.length > 0 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredNews.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/local/${item.id}`)}
                      className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer h-[380px]"
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
                        स्थानीय
                      </span>
                      {item.hasVideo && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold leading-tight mb-2 group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-200 line-clamp-2">
                          {item.subtitle || item.paragraph?.substring(0, 100) + '...' || ''}
                        </p>
                        <p className="text-xs mt-2 opacity-80">
                          {new Date(item.publishedDate).toLocaleDateString('ne-NP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending News Section */}
            {trendingNews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">ट्रेन्डिङ समाचार</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingNews.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => navigate(`/local/${item.id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="relative rounded-xl overflow-hidden shadow-lg h-48 mb-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {getTimeAgo(item.publishedDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-12">
            {/* Most Viewed */}
            {mostViewedNews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">सर्वाधिक पढिएको</h2>
                <div className="space-y-4">
                  {mostViewedNews.map((item, index) => (
                    <div 
                      key={item.id} 
                      onClick={() => navigate(`/local/${item.id}`)}
                      className="py-3 border-b border-gray-200 last:border-0 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-600 transition-colors">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {getTimeAgo(item.publishedDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow Us */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">हामीलाई फलो गर्नुहोस्</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
                  { name: "Twitter", color: "bg-blue-400 hover:bg-blue-500" },
                  { name: "Instagram", color: "bg-pink-600 hover:bg-pink-700" },
                  { name: "YouTube", color: "bg-red-600 hover:bg-red-700" },
                ].map((social, i) => (
                  <button
                    key={i}
                    className={`text-white px-6 py-4 rounded-xl text-center font-medium transition-colors ${social.color}`}
                  >
                    {social.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/local')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            सबै स्थानीय समाचार हेर्नुहोस्
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalHome;