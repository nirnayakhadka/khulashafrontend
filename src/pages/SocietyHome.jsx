// SocietyHome.jsx - समाज Page with Backend Integration
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const SocietyHome = () => {
  const navigate = useNavigate();
  const [societyData, setSocietyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSocietyData();
  }, []);

  const fetchSocietyData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/society');
      setSocietyData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load society articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInMs = now - publishedDate;
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

  // Featured main article (first one)
  const featuredArticle = societyData[0];
  
  // Grid articles (next 6 articles)
  const gridArticles = societyData.slice(1, 7);

  // Loading state
  if (loading) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">समाज समाचार लोड हुँदैछ...</p>
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
              onClick={fetchSocietyData}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              पुन: प्रयास गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (societyData.length === 0) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">समाज समाचार उपलब्ध छैन</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            समाज
            <div className="h-1 w-32 bg-purple-600 rounded-full mt-4"></div>
          </h1>
          <button 
            onClick={() => navigate('/society')}
            className="text-purple-600 font-medium flex items-center gap-2 hover:gap-4 transition-all"
          >
            थप हेर्नुहोस् <ChevronRight size={24} />
          </button>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div 
            onClick={() => navigate(`/society/${featuredArticle.id}`)}
            className="group relative rounded-3xl overflow-hidden shadow-2xl h-[500px] md:h-[650px] cursor-pointer mb-12"
          >
            <img
              src={getImageUrl(featuredArticle.image)}
              alt={featuredArticle.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 p-8 md:p-12 text-white w-full">
              <span className="inline-block bg-purple-600 px-5 py-2 rounded-full text-sm font-bold mb-4">समाज</span>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                {featuredArticle.title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mt-4 line-clamp-2">
                {featuredArticle.subtitle || featuredArticle.paragraph?.substring(0, 150) + '...' || ''}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-gray-300">
                  प्रतिवेदन: {featuredArticle.journalist || 'समाचारदाता'}
                </span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-300">
                  {getTimeAgo(featuredArticle.publishedDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Society Grid */}
        {gridArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {gridArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/society/${item.id}`)}
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-[420px] sm:h-[480px] lg:h-[520px]"
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <span className="absolute top-6 left-6 bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
                  समाज
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl text-gray-200 line-clamp-2">
                    {item.subtitle || item.paragraph?.substring(0, 100) + '...' || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/society')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold text-lg rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            सबै समाज समाचार हेर्नुहोस्
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocietyHome;