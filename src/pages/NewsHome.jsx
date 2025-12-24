// NewsHome.jsx - समाचार Page with Backend Integration
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const NewsHome = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news from backend
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/news');
      setNewsList(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInMs = now - publishedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInDays === 0) {
      if (diffInHours === 0) return 'भर्खरै';
      return `${diffInHours} घण्टा अघि`;
    }
    if (diffInDays === 1) return '१ दिन अघि';
    if (diffInDays < 7) return `${diffInDays} दिन अघि`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} हप्ता अघि`;
    return `${Math.floor(diffInDays / 30)} महिना अघि`;
  };

  // Prepare carousel items (first 3 news)
  const carouselItems = newsList.slice(0, 3);
  
  // Additional news grid (remaining news, max 8)
  const additionalNews = newsList.slice(3, 11);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-16">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">समाचार लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-16">
        <div className="text-center py-12">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button 
            onClick={fetchNews}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            पुन: प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">समाचार</h2>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Top Featured News Grid */}
      {carouselItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/news/${item.id}`)}
              className="group relative h-72 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <p className="text-white font-bold text-lg">{item.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-300">{item.journalist || 'समाचारदाता'}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-300">{getTimeAgo(item.publishedDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional News Grid */}
      {additionalNews.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalNews.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/news/${item.id}`)}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border border-gray-200"
            >
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                {item.category && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-200 line-clamp-2">
                  {item.subtitle || item.excerpt || item.paragraph?.substring(0, 100) + '...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
        >
          सबै समाचार हेर्नुहोस्
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default NewsHome;