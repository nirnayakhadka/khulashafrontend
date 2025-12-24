import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Flame } from 'lucide-react';

const Sports = () => {
  const navigate = useNavigate();
  const [sportsList, setSportsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 24) return `${diffInHours} घण्टा अगाडि`;
    if (diffInDays === 1) return '१ दिन अगाडि';
    return `${diffInDays} दिन अगाडि`;
  };

  const handleArticleClick = (id) => {
    navigate(`/sports/${id}`);
  };

  // Pagination
  const totalPages = Math.ceil(sportsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSports = sportsList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}

{/* Hero Section - Full Width, Edge-to-Edge */}
{/* Hero Section - Professional & Contained */}
<div className="max-w-7xl mx-auto px-4 py-8">
  <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
    {/* Dynamic Background Image */}
    {loading || sportsList.length === 0 ? (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&h=900&fit=crop')",
        }}
      />
    ) : (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('http://localhost:5000${sportsList[0].image}')`,
        }}
      />
    )}

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    {/* Content */}
    <div 
      className="relative h-full flex items-end pb-8 px-6 md:px-10 cursor-pointer"
      onClick={() => {
        if (!loading && !error && sportsList.length > 0) {
          navigate(`/sports/${sportsList[0].id}`);
        }
      }}
    >
      <div className="text-white w-full max-w-4xl">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        ) : sportsList.length === 0 ? (
          <>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              खेलकुद समाचार
            </h1>
            <p className="text-lg text-gray-300">कुनै समाचार उपलब्ध छैन</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <span className="bg-red-600 px-4 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-2">
                <Flame className="w-4 h-4" />
                ताजा समाचार
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
              {sportsList[0].title}
            </h1>
            
            {sportsList[0].subtitle && (
              <p className="text-base md:text-lg text-gray-200 mb-4 line-clamp-2 max-w-3xl">
                {sportsList[0].subtitle}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getTimeAgo(sportsList[0].publishedDate)}</span>
              </div>
              {sportsList[0].journalistName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{sportsList[0].journalistName}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
</div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">समाचार लोड गर्न असफल भयो: {error}</p>
          </div>
        )}

        {!loading && !error && sportsList.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">कुनै खेलकुद समाचार उपलब्ध छैन</p>
          </div>
        )}

        {!loading && !error && currentSports.length > 0 && (
          <>
            {/* Featured Article (First Item) */}
            {currentPage === 1 && currentSports[0] && (
              <div className="mb-16">
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl h-96"
                  onClick={() => handleArticleClick(currentSports[0].id)}
                >
                  {currentSports[0].image && (
                    <img
                      src={`http://localhost:5000${currentSports[0].image}`}
                      alt={currentSports[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  <div className="absolute top-6 left-6">
                    <span className="bg-red-600 px-4 py-2 text-sm font-bold rounded text-white shadow-lg">
                      मुख्य समाचार
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                      <Play className="w-12 h-12 text-white" fill="white" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h2 className="text-3xl font-bold mb-3 leading-tight">
                      {currentSports[0].title}
                    </h2>
                    {currentSports[0].subtitle && (
                      <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                        {currentSports[0].subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeAgo(currentSports[0].publishedDate)}</span>
                      </div>
                      {currentSports[0].journalistName && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{currentSports[0].journalistName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentSports.slice(currentPage === 1 ? 1 : 0).map((sports) => (
                <article
                  key={sports.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer group"
                  onClick={() => handleArticleClick(sports.id)}
                >
                  <div className="relative h-56 overflow-hidden">
                    {sports.image ? (
                      <img
                        src={`http://localhost:5000${sports.image}`}
                        alt={sports.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Play size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-600 px-3 py-1 text-xs font-bold rounded text-white">
                        नयाँ
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(sports.publishedDate)}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                      {sports.title}
                    </h3>

                    {sports.subtitle && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {sports.subtitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {sports.journalistImage ? (
                          <img
                            src={`http://localhost:5000${sports.journalistImage}`}
                            alt={sports.journalistName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={14} className="text-blue-600" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {sports.journalistName || 'अज्ञात'}
                        </span>
                      </div>

                      <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 group">
                        पढ्नुहोस्
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition"
                >
                  <ChevronLeft size={20} />
                  अघिल्लो
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 rounded-lg font-semibold transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'border-2 border-gray-300 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition"
                >
                  पछिल्लो
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sports;