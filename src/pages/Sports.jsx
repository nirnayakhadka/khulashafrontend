import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Flame } from 'lucide-react';
import khulashaLogo from '../assets/image/khulashalogo.png';
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
      const response = await fetch('http://localhost:5000/api/news/category/sports');
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
<div className="max-w-7xl mx-auto px-4 py-8">
     <div className="max-w-7xl">
        {/* Title and Date Above */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gray-900">
            {loading ? (
              <div className="animate-pulse h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
            ) : sportsList.length === 0 ? (
              "खेलकुद समाचार"
            ) : (
              sportsList[0].title
            )}
          </h1>
          {!loading && sportsList.length > 0 && (
            <p className="text-sm md:text-base text-gray-600">
              {new Date(sportsList[0].publishedDate).toLocaleDateString('ne-NP')}
            </p>
          )}
        </div>

        {/* Image */}
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl mb-6">
          {loading || sportsList.length === 0 ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&h=900&fit=crop')",
              }}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer"
              style={{
                backgroundImage: `url('http://localhost:5000${sportsList[0].image}')`,
              }}
              onClick={() => navigate(`/sports/${sportsList[0].id}`)}
            />
          )}
        </div>

        {/* Meta Information Below Image */}
        {!loading && sportsList.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-gray-600 mb-6">
              {sportsList[0].journalistName && (
                <>
                  <div className="flex items-center gap-2">
                    <img
                      src={sportsList[0].journalistImage 
                        ? `http://localhost:5000${sportsList[0].journalistImage}`
                        : khulashaLogo
                      }
                      alt={sportsList[0].journalistName || "Khulasha Nepal"}
                      className={sportsList[0].journalistImage 
                        ? "w-10 h-10 rounded-full object-cover border-2 border-gray-300" 
                        : "w-6 h-6 object-contain"
                      }
                    />
                    <span className="text-sm md:text-base">{sportsList[0].journalistName}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                </>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm md:text-base">{getTimeAgo(sportsList[0].publishedDate)}</span>
              </div>
            </div>

            {/* Title */}
            <h2 
              className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 text-center cursor-pointer hover:text-blue-900 transition-colors"
              onClick={() => navigate(`/sports/${sportsList[0].id}`)}
            >
              {sportsList[0].title}
            </h2>

            {/* Subtitle/Description */}
            {sportsList[0].subtitle && (
              <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto line-clamp-1">
                {sportsList[0].subtitle}
              </p>
            )}
          </div>
        )}

        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        )}

        {!loading && sportsList.length === 0 && (
          <p className="text-lg text-gray-600 text-center">कुनै समाचार उपलब्ध छैन</p>
        )}
      </div>
 

      {/* Main Content */}
   
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
            {/* Featured Article (Second Item) */}
{currentPage === 1 && currentSports[1] && (
              <div className="mb-16">
                {/* Title and Date Above */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gray-900">
                    {currentSports[1].title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    {new Date(currentSports[1].publishedDate).toLocaleDateString('ne-NP')}
                  </p>
                </div>

                {/* Image */}
                <div
                  className="relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl h-96 mb-6"
                  onClick={() => handleArticleClick(currentSports[1].id)}
                >
                  {currentSports[1].image && (
                    <img
                      src={`http://localhost:5000${currentSports[1].image}`}
                      alt={currentSports[1].title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Meta Information Below Image */}
                <div>
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-gray-600 mb-6">
                    {currentSports[1].journalistName && (
                      <>
                        <div className="flex items-center gap-2">
                          <img
                            src={currentSports[1].journalistImage 
                              ? `http://localhost:5000${currentSports[1].journalistImage}`
                              : khulashaLogo
                            }
                            alt={currentSports[1].journalistName || "Khulasha Nepal"}
                            className={currentSports[1].journalistImage 
                              ? "w-10 h-10 rounded-full object-cover border-2 border-gray-300" 
                              : "w-6 h-6 object-contain"
                            }
                          />
                          <span className="text-sm md:text-base">{currentSports[1].journalistName}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm md:text-base">{getTimeAgo(currentSports[1].publishedDate)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 text-center cursor-pointer hover:text-blue-900 transition-colors"
                    onClick={() => handleArticleClick(currentSports[1].id)}
                  >
                    {currentSports[1].title}
                  </h3>

                  {/* Subtitle/Description */}
                  {currentSports[1].subtitle && (
                    <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto line-clamp-1">
                      {currentSports[1].subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentSports.slice(currentPage === 1 ? 2 : 0).map((sports) => (
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
                    
       

                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(sports.publishedDate)}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-900 transition">
                      {sports.title}
                    </h3>

                    {sports.subtitle && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {sports.subtitle}
                      </p>
                    )}

<div className="flex items-center justify-between pt-4 border-t border-gray-100">
  <div className="flex items-center gap-2">
    <img
      src={sports.journalistImage 
        ? `http://localhost:5000${sports.journalistImage}`
        : khulashaLogo
      }
      alt={sports.journalistName || "Khulasha Nepal"}
      className={sports.journalistImage 
        ? "w-8 h-8 rounded-full object-cover border border-gray-200" 
        : "w-8 h-8 object-contain"
      }
    />
    <span className="text-sm font-medium text-gray-700">
      {sports.journalistName || 'अज्ञात'}
    </span>
  </div>

  <span className="text-sm font-medium text-gray-600">
    खेलकुद समाचार
  </span>
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