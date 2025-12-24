// SportsHome.jsx - खेलखबर Page with Backend Integration
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SportsHome = () => {
  const navigate = useNavigate();
  const [sportsList, setSportsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/sports');
      if (!response.ok) throw new Error('Failed to fetch sports articles');
      const data = await response.json();
      setSportsList(data);
      setError(null);
    } catch (err) {
      setError('Failed to load sports articles');
      console.error('Error fetching sports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1200';
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

  // Featured large card (first article)
  const featuredArticle = sportsList[0];

  // Grid cards (next 6 articles)
  const gridArticles = sportsList.slice(1, 7);

  // Trending articles (next 6 articles for sidebar)
  const trendingArticles = sportsList.slice(7, 13);

  // Loading state
  if (loading) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">खेलकुद समाचार लोड हुँदैछ...</p>
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
              onClick={fetchSports}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              पुन: प्रयास गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (sportsList.length === 0) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">खेलकुद समाचार उपलब्ध छैन</p>
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
            खेलखबर
            <div className="h-1 w-32 bg-green-600 rounded-full mt-4"></div>
          </h1>
          <button 
            onClick={() => navigate('/sports')}
            className="text-green-600 font-medium flex items-center gap-2 hover:gap-4 transition-all"
          >
            थप हेर्नुहोस् <ChevronRight size={24} />
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left + Middle Column: Main Content + 3x2 Grid Cards */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Large Card */}
            {featuredArticle && (
              <div 
                onClick={() => navigate(`/sports/${featuredArticle.id}`)}
                className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer h-[500px] md:h-[600px]"
              >
                <img
                  src={getImageUrl(featuredArticle.image)}
                  alt={featuredArticle.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <span className="absolute top-6 left-6 bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold uppercase">
                  मुख्य समाचार
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-200 line-clamp-2">
                    {featuredArticle.subtitle || featuredArticle.paragraph?.substring(0, 150) + '...' || ''}
                  </p>
                  <p className="text-sm mt-4 opacity-80">
                    {new Date(featuredArticle.publishedDate).toLocaleDateString('ne-NP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* 3 Rows × 2 Columns Grid Cards (6 Cards) */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {gridArticles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/sports/${item.id}`)}
                    className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer h-[360px] lg:h-[400px]"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                      खेलकुद
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-green-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-200 line-clamp-2">
                        {item.subtitle || item.paragraph?.substring(0, 100) + '...' || ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-10">
            {/* Trending List */}
            {trendingArticles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">ट्रेन्डिङ</h2>
                <div className="space-y-5">
                  {trendingArticles.map((article, index) => (
                    <div 
                      key={article.id} 
                      onClick={() => navigate(`/sports/${article.id}`)}
                      className="py-3 border-b border-gray-200 last:border-0 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold text-gray-300 group-hover:text-green-600 transition-colors">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {getTimeAgo(article.publishedDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Section */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">अन्य खेल समाचार</h3>
              <div className="space-y-4">
                <p className="text-gray-700">नेपालको खेलकुद विकासमा नयाँ योजना</p>
                <p className="text-gray-700">युवा खेलाडीहरूलाई अन्तर्राष्ट्रिय अवसर</p>
                <button 
                  onClick={() => navigate('/sports')}
                  className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  सबै समाचार हेर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/sports')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold text-lg rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            सबै खेलकुद समाचार हेर्नुहोस्
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SportsHome;