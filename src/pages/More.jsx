import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, User, Clock } from 'lucide-react';
import axiosInstance from '../api/axios';
import khulashaLogo from '../assets/image/khulashalogo.png';
import NepaliDate from 'nepali-date-converter';
const API_URL = import.meta.env.VITE_API_URL 
// Helper function to convert numbers to Nepali
const toNepaliNumber = (num) => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().split('').map(digit => nepaliDigits[digit]).join('');
};

// Pagination Controls Component
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
      <button
        onClick={() => {
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => {
            onPageChange(pageNum);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`w-10 h-10 rounded-lg font-semibold transition ${
            pageNum === currentPage
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
          }`}
          aria-label={`Go to page ${pageNum}`}
        >
          {pageNum}
        </button>
      ))}
      
      <button
        onClick={() => {
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const More = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 14; // 5 carousel + 9 grid articles per page

  // Get time ago in Nepali
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

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/news/category/more');
      
      const articles = response.data.success && Array.isArray(response.data.data) 
        ? response.data.data 
        : Array.isArray(response.data) 
          ? response.data 
          : [];
      
      // Sort by date (newest first)
      const sortedArticles = articles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      );
      
      setArticles(sortedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  // Only show carousel on first page
  const showCarousel = currentPage === 1;
  const carouselCards = showCarousel ? paginatedArticles.slice(0, 5).map((article) => ({
    id: article.id,
    image: article.image ? `${API_URL}${article.image}` : "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800&q=80",
    title: article.title,
    category: article.subtitle || "समाचार",
    date: article.publishedDate,
    journalist: article.journalistName
  })) : [];

  const gridArticles = showCarousel ? paginatedArticles.slice(5) : paginatedArticles;

  const nextSlide = () => {
    if (isAnimating || carouselCards.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % carouselCards.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || carouselCards.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + carouselCards.length) % carouselCards.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (carouselCards.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselCards.length, currentSlide]);

  const getVisibleCards = () => {
    if (carouselCards.length === 0) return [];
    const cards = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentSlide + i + carouselCards.length) % carouselCards.length;
      cards.push({ ...carouselCards[index], offset: i });
    }
    return cards;
  };

  const handleCardClick = (articleId) => {
    navigate(`/more/${articleId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCurrentSlide(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">लोड गर्दै...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-12">
        {/* Only show header on first page */}
        {currentPage === 1 && (
          <>
            <h2 className="text-4xl font-bold text-slate-800 mb-4 text-center">ताजा समाचार</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              देश विदेशका भरपर्दो र तथ्यपरक समाचार
            </p>
          </>
        )}
        
        {/* 3D Carousel Section */}
        {carouselCards.length > 0 && (
          <div className="relative h-[500px] mb-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
                {getVisibleCards().map((card) => {
                  const offset = card.offset;
                  const isCenter = offset === 0;
                  const absOffset = Math.abs(offset);
                  
                  return (
                    <div
                      key={card.id}
                      className="absolute cursor-pointer"
                      style={{
                        transform: `
                          translateX(${offset * 300}px)
                          translateZ(${isCenter ? 0 : -250 * absOffset}px)
                          scale(${isCenter ? 1 : 1 - absOffset * 0.25})
                          rotateY(${offset * -12}deg)
                        `,
                        zIndex: isCenter ? 50 : 50 - absOffset * 10,
                        opacity: absOffset > 1 ? 0.2 : 1,
                        width: '350px',
                        height: '450px',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'transform, opacity'
                      }}
                      onClick={() => isCenter && handleCardClick(card.id)}
                    >
                      <div 
                        className={`relative h-full rounded-2xl overflow-hidden shadow-2xl ${isCenter ? 'ring-4 ring-blue-500 shadow-blue-500/50' : ''}`}
                        style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      >
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-2 line-clamp-2">{card.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-white/80">
                            {card.date && (
                              <div className="flex items-center gap-1 mx-auto">
                                <Clock size={14} />
                                <span>{getTimeAgo(card.date)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-40">
              {carouselCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentSlide(idx);
                      setTimeout(() => setIsAnimating(false), 600);
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'bg-blue-500 w-8' 
                      : 'bg-white/60 w-2 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">सबै लेखहरू</h2>
          
          {gridArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={() => handleCardClick(article.id)}
                  getTimeAgo={getTimeAgo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-slate-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-600 mb-2">कुनै लेख भेटिएन</h3>
              <p className="text-slate-500">नयाँ लेखहरू चाँडै थपिनेछन्।</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

// Article Card Component
const ArticleCard = ({ article, onClick, getTimeAgo }) => {
  const [isHovered, setIsHovered] = useState(false);

  const stripHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={article.image ? `${API_URL}${article.image}` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-1 leading-normal">
          {article.title}
        </h3>
        
        {article.paragraph && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-1">
            {stripHtml(article.paragraph)}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <img
              src={article.journalistImage 
                ? `${API_URL}${article.journalistImage}`
                : khulashaLogo
              }
              alt={article.journalistName || "Khulasha Nepal"}
              className={article.journalistImage 
                            ? "w-10 h-10 rounded-full object-cover border border-blue-600 border-3" 
                            : "w-12 h-12 object-contain rounded-full object-contain border border-blue-600 border-3"
              }
            />
            <span className="text-sm font-medium text-slate-700">{article.journalistName || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Clock size={12} />
            <span>{getTimeAgo(article.publishedDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;