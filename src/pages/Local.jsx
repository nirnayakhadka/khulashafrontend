import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/local';

function Local() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0);
  const [localNews, setLocalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch local news from backend
  useEffect(() => {
    fetchLocalNews();
  }, []);

  const fetchLocalNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
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

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get hero slides from local news (top 3 most recent)
  const heroSlides = localNews.slice(0, 3).map((news, index) => ({
    id: news.id,
    image: news.image ? `http://localhost:5000${news.image}` : 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80',
    date: new Date(news.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: 'LOCAL NEWS',
    title: news.title,
    author: news.journalistName || 'Unknown Author',
    views: '1.2M'
  }));

  // Get main stories (next 4 articles)
  const mainStories = localNews.slice(3, 7).map((news) => ({
    id: news.id,
    image: news.image ? `http://localhost:5000${news.image}` : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    category: 'LOCAL NEWS',
    title: news.title,
    description: news.subtitle || news.paragraph?.substring(0, 100) + '...' || 'No description available',
    time: getTimeAgo(news.publishedDate),
    fullData: news
  }));

  // Get sidebar stories (next 5 articles)
  const sidebarStories = localNews.slice(7, 12).map((news) => ({
    id: news.id,
    image: news.image ? `http://localhost:5000${news.image}` : 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&q=80',
    title: news.title,
    time: getTimeAgo(news.publishedDate),
    fullData: news
  }));

  // Get middle cards (next 3 articles)
  const middleCards = localNews.slice(12, 15).map((news) => ({
    id: news.id,
    image: news.image ? `http://localhost:5000${news.image}` : 'https://images.unsplash.com/photo-1464690048666-8db43868cd37?w=400&q=80',
    category: 'LOCAL NEWS',
    title: news.title,
    description: news.subtitle || news.paragraph?.substring(0, 80) + '...' || 'Read more...',
    fullData: news
  }));

  // Get bottom stories (next 2 articles)
  const bottomStories = localNews.slice(15, 17).map((news, index) => ({
    id: news.id,
    image: news.image ? `http://localhost:5000${news.image}` : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
    category: 'LOCAL NEWS',
    title: news.title,
    description: news.subtitle || news.paragraph?.substring(0, 100) + '...' || 'Read more...',
    large: index === 1,
    fullData: news
  }));

  // Get video cards (remaining articles)
  const videoCards = localNews.slice(17).map((news) => ({
    id: news.id,
    image: news.image ? `http://localhost:5000${news.image}` : 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80',
    hasVideo: false,
    title: news.title,
    fullData: news
  }));

  const openArticlePopup = (articleId) => {
    navigate(`/local/${articleId}`);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const nextVideo = () => setVideoCarouselIndex((prev) => Math.min(prev + 1, Math.max(0, videoCards.length - 3)));
  const prevVideo = () => setVideoCarouselIndex((prev) => Math.max(0, prev - 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading local news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchLocalNews}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (localNews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No local news articles available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Slider */}
      {heroSlides.length > 0 && (
        <div className="relative h-[550px] overflow-hidden group">
          <div className="max-w-[1600px] mx-auto h-full relative">
            <img
              src={heroSlides[currentSlide]?.image}
              alt={heroSlides[currentSlide]?.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-[1600px] mx-auto">
              <div className="max-w-[1600px]">
                <div className="flex items-center space-x-4 text-sm mb-3">
                  <span>{heroSlides[currentSlide]?.date}</span>
                  <span>in</span>
                  <span className="text-red-500 font-semibold">{heroSlides[currentSlide]?.category}</span>
                </div>
                <h1 className="text-5xl font-bold mb-4 leading-tight">
                  {heroSlides[currentSlide]?.title}
                </h1>
                <div className="flex items-center space-x-6 text-sm">
                  <button
                    onClick={() => {
                      const article = localNews.find(n => n.id === heroSlides[currentSlide]?.id);
                      if (article) openArticlePopup(article.id);
                    }}
                    className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                  >
                    Read More
                  </button>
                  <span className="flex items-center space-x-2">
                    <User size={16} />
                    {heroSlides[currentSlide]?.author}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-8 right-8 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Top Stories Grid */}
        {(mainStories.length > 0 || sidebarStories.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => openArticlePopup(story.id)}
                  className="bg-white overflow-hidden rounded-lg shadow hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold">
                      {story.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                      {story.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">{story.description}</p>
                    <span className="text-sm text-gray-500">{story.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {sidebarStories.length > 0 && (
              <div className="space-y-4">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                  <h3 className="text-lg font-bold">Latest Local News</h3>
                </div>
                {sidebarStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => openArticlePopup(story.id)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <img src={story.image} alt={story.title} className="w-full h-32 object-cover rounded-t-lg" />
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition">
                        {story.title}
                      </h4>
                      <span className="text-xs text-gray-500">{story.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Middle Cards */}
        {middleCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {middleCards.map((card) => (
              <div
                key={card.id}
                onClick={() => openArticlePopup(card.id)}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="p-6">
                  <span className="text-xs font-bold text-gray-500 mb-2 block">{card.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Stories */}
        {bottomStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {bottomStories.map((story) => (
              <div
                key={story.id}
                onClick={() => openArticlePopup(story.id)}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  {story.large && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                        <p className="text-sm">{story.description}</p>
                      </div>
                    </div>
                  )}
                </div>
                {!story.large && (
                  <div className="p-6">
                    <span className="text-xs font-bold text-gray-500 mb-2 block">{story.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600">{story.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Video Carousel Section */}
        {videoCards.length > 0 && (
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">More Local News</h2>
            <div className="relative group">
              <button
                onClick={prevVideo}
                disabled={videoCarouselIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextVideo}
                disabled={videoCarouselIndex >= videoCards.length - 3}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight size={24} />
              </button>

              <div className="overflow-hidden">
                <div
                  className="flex gap-6 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${videoCarouselIndex * 34}%)` }}
                >
                  {videoCards.map((card) => (
                    <div key={card.id} className="flex-shrink-0 w-full md:w-1/3">
                      <div
                        onClick={() => openArticlePopup(card.id)}
                        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group/card"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover/card:scale-110 transition duration-700"
                          />
                        </div>
                        <div className="p-5">
                          <h4 className="font-semibold text-gray-900 group-hover/card:text-blue-600 transition">
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
        )}
      </div>
    </div>
  );
}

export default Local;