import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/news/category/local';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80';

// Utility Functions
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const getTimeAgo = (date) => {
  const now = new Date();
  const published = new Date(date);
  const diffInMs = now - published;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  return published.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
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
            <h1 className="text-2xl font-bold mb-4 leading-tight hover:text-blue-700 transition">
              {current.title}
            </h1>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
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
        {story.category && (
          <span className="text-xs font-bold text-blue-600 mb-2 block uppercase">
            {story.category}
          </span>
        )}
        <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition line-clamp-2 leading-tight">
          {story.title}
        </h2>
        {story.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2 leading-snug flex-grow">
            {story.description}
          </p>
        )}
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
    className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col overflow-hidden"
  >
    <img 
      src={story.image} 
      alt={story.title} 
      className="w-full h-28 object-cover group-hover:scale-105 transition duration-500" 
      loading="lazy"
    />
    <div className="px-3 py-3 flex-grow">
      <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition line-clamp-2 leading-tight">
        {story.title}
      </h4>
      <span className="text-xs text-gray-500">{story.time}</span>
    </div>
  </div>
);

// Carousel Component
const Carousel = ({ items, index, onNext, onPrev, onItemClick }) => {
  if (items.length === 0) return null;

  const canGoPrev = index > 0;
  const canGoNext = index < items.length - 3;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">More Local News</h2>
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
  const [localNews, setLocalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocalNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch local news');
      const data = await response.json();
      setLocalNews(data);
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
  const { heroSlides, mainStories, sidebarStories, middleCards, bottomStories, videoCards } = useMemo(() => {
    const createStory = (news, includeTime = false) => ({
      id: news.id,
      image: getImageUrl(news.image),
      title: stripHtml(news.title),
      ...(includeTime && { time: getTimeAgo(news.publishedDate) })
    });

    return {
      heroSlides: localNews.slice(0, 3).map(news => ({
        ...createStory(news),
        date: formatDate(news.publishedDate),
        category: 'LOCAL NEWS',
        author: news.journalistName || 'Unknown Author'
      })),
      
      mainStories: localNews.slice(3, 7).map(news => ({
        ...createStory(news, true),
        category: 'LOCAL NEWS',
        description: stripHtml(news.subtitle || news.paragraph?.substring(0, 100) + '...' || 'No description available')
      })),
      
      sidebarStories: localNews.slice(7, 12).map(news => createStory(news, true)),
      
      middleCards: localNews.slice(12, 15).map(news => ({
        ...createStory(news),
        category: 'LOCAL NEWS',
        description: stripHtml(news.subtitle || news.paragraph?.substring(0, 80) + '...' || 'Read more...')
      })),
      
      bottomStories: localNews.slice(15, 17).map((news, index) => ({
        ...createStory(news),
        category: 'LOCAL NEWS',
        description: stripHtml(news.subtitle || news.paragraph?.substring(0, 100) + '...' || 'Read more...'),
        large: index === 1
      })),
      
      videoCards: localNews.slice(17).map(news => createStory(news))
    };
  }, [localNews]);

  const nextVideo = useCallback(() => {
    setVideoCarouselIndex(prev => Math.min(prev + 1, Math.max(0, videoCards.length - 3)));
  }, [videoCards.length]);

  const prevVideo = useCallback(() => {
    setVideoCarouselIndex(prev => Math.max(0, prev - 1));
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stories Grid */}
        {(mainStories.length > 0 || sidebarStories.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 lg:items-start">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {mainStories.map(story => (
                <StoryCard key={story.id} story={story} onClick={openArticlePopup} />
              ))}
            </div>

{sidebarStories.length > 0 && (
  <div className="space-y-4">
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">Hot Topics</h3>
    </div>

    {sidebarStories.slice(0, 3).map(story => (
      <SidebarStory
        key={story.id}
        story={story}
        onClick={openArticlePopup}
      />
    ))}
  </div>
)}

          </div>
        )}

        {/* Middle Cards */}
        {middleCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {middleCards.map(card => (
              <StoryCard key={card.id} story={card} onClick={openArticlePopup} />
            ))}
          </div>
        )}

        {/* Bottom Stories */}
        {bottomStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {bottomStories.map(story => (
              <StoryCard key={story.id} story={story} onClick={openArticlePopup} size="large" />
            ))}
          </div>
        )}

        {/* Video Carousel */}
        <Carousel
          items={videoCards}
          index={videoCarouselIndex}
          onNext={nextVideo}
          onPrev={prevVideo}
          onItemClick={openArticlePopup}
        />
      </div>
    </div>
  );
}

export default Local;