import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';
const API_BASE_URL = 'http://localhost:5000/api/news/category/local';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80';

// Utility Functions
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};


const toNepaliNumber = (num) => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().split('').map(digit => nepaliDigits[digit]).join('');
};

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


const getImageUrl = (imagePath) => {
  return imagePath ? `http://localhost:5000${imagePath}` : FALLBACK_IMAGE;
};

// Loading Component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading local news...</p>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <p className="text-red-600 text-lg mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-900 transition"
      >
        Retry
      </button>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <p className="text-gray-600 text-lg">No local news articles available</p>
    </div>
  </div>
);

// Hero Slider Component
const HeroSlider = ({ slides, currentSlide, onSlideChange, onArticleClick }) => {
  const nextSlide = () => onSlideChange((currentSlide + 1) % slides.length);
  const prevSlide = () => onSlideChange((currentSlide - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  const current = slides[currentSlide];

  return (
    <div className="relative h-[550px] overflow-hidden group">
      <div className="max-w-7xl mx-auto h-full relative">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      <div 
        className="absolute bottom-0 left-0 right-0 p-8 text-white cursor-pointer hover:bg-black/10 transition"
        onClick={() => onArticleClick(current.id)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 text-sm mb-3">
              <span>{current.date}</span>
            </div>
            <h1 className="text-2xl font-bold mb-4 leading-normal line-clamp-2 hover:text-blue-700 transition">
              {current.title}
            </h1>
          </div>
        </div>
      </div>

<button
  onClick={prevSlide}
  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
  aria-label="Previous slide"
>
  <ChevronLeft size={24} className="md:w-7 md:h-7" />
</button>
<button
  onClick={nextSlide}
  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
  aria-label="Next slide"
>
  <ChevronRight size={24} className="md:w-7 md:h-7" />
</button>

      <div className="absolute bottom-8 right-8 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === index ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Story Card Component
const StoryCard = ({ story, onClick, size = 'medium' }) => {
  const heightClass = size === 'small' ? 'h-28' : size === 'large' ? 'h-64' : 'h-48';

  return (
    <div
      onClick={() => onClick(story.id)}
      className="bg-white overflow-hidden rounded-lg shadow hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 flex flex-col"
    >
      <div className={`relative ${heightClass} overflow-hidden flex-shrink-0`}>
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          loading="lazy"
        />
      </div>
      <div className="px-4 py-3 flex-grow flex flex-col">
        <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition line-clamp-3 leading-normal">
          {story.title}
        </h2>
        {story.time && (
          <span className="text-xs text-gray-500 mt-auto">{story.time}</span>
        )}
      </div>
    </div>
  );
};

// Sidebar Story Component
const SidebarStory = ({ story, onClick }) => (
  <div
    onClick={() => onClick(story.id)}
    className="bg-white hover:bg-gray-50 transition-all duration-300 group cursor-pointer p-3"
  >
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
        <img 
          src={story.image} 
          alt={story.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition line-clamp-2 leading-normal">
          {story.title}
        </h4>
        <span className="text-xs text-gray-500">{story.time}</span>
      </div>
    </div>
  </div>
);

// Section with Navigation Component
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

// Section with Navigation Component (removed - no longer needed)

// Carousel Component
const Carousel = ({ items, index, onNext, onPrev, onItemClick }) => {
  if (items.length === 0) return null;

  const canGoPrev = index > 0;
  const canGoNext = index < items.length - 3;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">थप स्थानीय समाचार</h2>
      <div className="relative group">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous items"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next items"
        >
          <ChevronRight size={24} />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 34}%)` }}
          >
            {items.map((card) => (
              <div key={card.id} className="flex-shrink-0 w-full md:w-1/3">
                <div
                  onClick={() => onItemClick(card.id)}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group/card"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-semibold text-gray-900 group-hover/card:text-blue-900 transition line-clamp-3">
                      {card.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
function Local() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [localNews, setLocalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 30;

  const fetchLocalNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch local news');
      const data = await response.json();
      
      const articles = data.success && Array.isArray(data.data) 
        ? data.data 
        : Array.isArray(data) 
          ? data 
          : [];
      
      // Sort by date (newest first)
      const sortedArticles = articles.sort((a, b) => 
        new Date(b.publishedDate) - new Date(a.publishedDate)
      );
      
      setLocalNews(sortedArticles);
    } catch (err) {
      setError('Failed to load local news articles');
      console.error('Error fetching local news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalNews();
  }, [fetchLocalNews]);

  const openArticlePopup = useCallback((articleId) => {
    navigate(`/local/${articleId}`);
  }, [navigate]);

  // Memoized data transformations
  const { heroSlides, mainStories, sidebarStories, middleCards, bottomStories, videoCards, totalPages } = useMemo(() => {
    const createStory = (news, includeTime = false) => ({
      id: news.id,
      image: getImageUrl(news.image),
      title: stripHtml(news.title),
      ...(includeTime && { time: getTimeAgo(news.publishedDate) })
    });

    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedNews = localNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(localNews.length / ITEMS_PER_PAGE);

    return {
      heroSlides: paginatedNews.slice(0, 5).map(news => ({
        ...createStory(news),
        date: getTimeAgo(news.publishedDate),
        category: 'LOCAL NEWS',
        author: news.journalistName || 'Unknown Author'
      })),
      
      mainStories: paginatedNews.slice(5, 11).map(news => ({
        ...createStory(news, true),
        category: 'LOCAL NEWS',
        description: stripHtml(news.subtitle || news.paragraph?.substring(0, 100) + '...' || 'No description available')
      })),
      
      sidebarStories: paginatedNews.slice(11, 21).map(news => createStory(news, true)),
      
      middleCards: paginatedNews.slice(21, 24).map(news => ({
        ...createStory(news, true),
        category: 'LOCAL NEWS',
        description: stripHtml(news.subtitle || news.paragraph?.substring(0, 80) + '...' || 'Read more...')
      })),
      
      bottomStories: paginatedNews.slice(24, 26).map((news, index) => ({
        ...createStory(news, true),
        category: 'LOCAL NEWS',
        description: stripHtml(news.subtitle || news.paragraph?.substring(0, 100) + '...' || 'Read more...'),
        large: index === 1
      })),
      
      videoCards: paginatedNews.slice(26, 30).map(news => createStory(news, true)),
      
      totalPages
    };
  }, [localNews, currentPage, ITEMS_PER_PAGE]);

  const nextVideo = useCallback(() => {
    setVideoCarouselIndex(prev => Math.min(prev + 1, Math.max(0, videoCards.length - 3)));
  }, [videoCards.length]);

  const prevVideo = useCallback(() => {
    setVideoCarouselIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setVideoCarouselIndex(0);
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchLocalNews} />;
  if (localNews.length === 0) return <EmptyState />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeroSlider
        slides={heroSlides}
        currentSlide={currentSlide}
        onSlideChange={setCurrentSlide}
        onArticleClick={openArticlePopup}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top Stories Grid */}
        {(mainStories.length > 0 || sidebarStories.length > 0) && (
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Left Side - Main Stories (3 columns x 2 rows) */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {mainStories.map(story => (
                  <StoryCard key={story.id} story={story} onClick={openArticlePopup} />
                ))}
              </div>

              {/* Right Side - Compact Sticky Sidebar */}
              {sidebarStories.length > 0 && (
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-4 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-white border-b-2 border-gray-200 p-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">थप समाचार</h3>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                      {sidebarStories.map(story => (
                        <SidebarStory
                          key={story.id}
                          story={story}
                          onClick={openArticlePopup}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Middle Cards */}
        {middleCards.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {middleCards.map(card => (
                <StoryCard key={card.id} story={card} onClick={openArticlePopup} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Stories */}
        {bottomStories.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {bottomStories.map(story => (
                <StoryCard key={story.id} story={story} onClick={openArticlePopup} size="large" />
              ))}
            </div>
          </div>
        )}

        {/* Video Carousel */}
        {videoCards.length > 0 && (
          <Carousel
            items={videoCards}
            index={videoCarouselIndex}
            onNext={nextVideo}
            onPrev={prevVideo}
            onItemClick={openArticlePopup}
          />
        )}

        {/* Pagination Controls */}
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Local;