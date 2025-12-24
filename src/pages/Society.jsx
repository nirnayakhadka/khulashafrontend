import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

function Society() {
  const navigate = useNavigate();
  const [societyData, setSocietyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const prevSlide = () => {
    const slidesToShow = window.innerWidth < 768 ? 1 : 3;
    const maxIndex = Math.max(0, societyData.length - slidesToShow);
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    const slidesToShow = window.innerWidth < 768 ? 1 : 3;
    const maxIndex = Math.max(0, societyData.length - slidesToShow);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleCardClick = (id) => {
    navigate(`/society/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading society articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button 
            onClick={fetchSocietyData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Top Featured Stories - First 3 articles
  const featuredStories = societyData.slice(0, 3);

  // Diverse Small Cards - Next 5 articles
  const smallCards = societyData.slice(3, 8);

  // Politics Section - Next 5 articles
  const politicsStories = societyData.slice(8, 13);

  // Carousel Images - All articles
  const carouselImages = societyData.length > 0 ? societyData : [];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">

        {/* Top Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {featuredStories.map(story => (
              <div
                key={story.id}
                onClick={() => handleCardClick(story.id)}
                className="group cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl"
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={getImageUrl(story.image)}
                    alt={story.title}
                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-4 mb-2">
                  SOCIETY
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight transition-colors group-hover:text-blue-700">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {story.subtitle || story.paragraph?.substring(0, 150) + '...' || ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Hero Section */}
        {societyData.length > 0 && (
          <div className="border-t border-b border-gray-200 py-16 mb-16 text-center">
            <img
              src={getImageUrl(societyData[0]?.journalistImage || societyData[0]?.image)}
              alt="Hero portrait"
              className="w-64 h-64 object-cover rounded-full mx-auto mb-8 shadow-2xl"
            />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Society & Culture Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the stories that shape our community, explore cultural insights, and connect with the voices that matter.
            </p>
          </div>
        )}

        {/* Diverse Small Cards */}
        {smallCards.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 pb-3 border-b border-gray-300">
              DIVERSE
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {smallCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="group cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                >
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src={getImageUrl(card.image)}
                      alt={card.title}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">SOCIETY</p>
                  <h4 className="text-base font-bold text-gray-900 leading-tight mb-2 transition-colors group-hover:text-blue-600 line-clamp-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {card.subtitle || card.paragraph?.substring(0, 100) + '...' || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Politics Section */}
        {politicsStories.length > 0 && (
          <div className="mb-20">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 pb-3 border-b border-gray-300">
              FEATURED STORIES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div 
                className="md:col-span-2 group cursor-pointer"
                onClick={() => handleCardClick(politicsStories[0].id)}
              >
                <div className="overflow-hidden rounded-xl mb-6">
                  <img
                    src={getImageUrl(politicsStories[0].image)}
                    alt={politicsStories[0].title}
                    className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight transition-colors group-hover:text-blue-700">
                  {politicsStories[0].title}
                </h2>
                <p className="text-lg text-gray-600 mb-8 line-clamp-4">
                  {politicsStories[0].subtitle || politicsStories[0].paragraph?.substring(0, 300) + '...' || ''}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(politicsStories[0].id);
                  }}
                  className="px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 rounded"
                >
                  READ MORE
                </button>
              </div>

              <div className="space-y-8">
                {politicsStories.slice(1).map(story => (
                  <div 
                    key={story.id} 
                    onClick={() => handleCardClick(story.id)}
                    className="group cursor-pointer flex gap-4 border-b border-gray-200 pb-6 last:border-0 last:pb-0 transition-all hover:translate-x-2"
                  >
                    <div className="overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={getImageUrl(story.image)}
                        alt={story.title}
                        className="w-32 h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 leading-tight transition-colors group-hover:text-blue-600 line-clamp-2">
                        {story.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {story.subtitle || ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Gallery Carousel */}
        {carouselImages.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-8 pb-3 border-b border-gray-300">
              FEATURED GALLERY
            </h3>

            <div className="relative group max-w-7xl mx-auto">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * (window.innerWidth < 768 ? 100 : 100 / 3)}%)`
                  }}
                >
                  {carouselImages.map((image) => (
                    <div
                      key={image.id}
                      className="w-full md:w-[33.333333%] flex-shrink-0 px-0 md:px-3"
                      onClick={() => handleCardClick(image.id)}
                    >
                      <div className="relative overflow-hidden rounded-xl h-[500px] md:h-[600px] group/item cursor-pointer bg-gray-900">
                        <img
                          src={getImageUrl(image.image)}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                        />

                        {/* Always Visible: Clean Title Overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 md:p-8 pt-20">
                          <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg line-clamp-2">
                            {image.title}
                          </h3>
                        </div>

                        {/* On Hover/Tap: Subtitle + Date */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-600 flex flex-col justify-end p-6 md:p-8">
                          <div className="text-white">
                            <span className="inline-block px-4 py-1.5 text-xs font-semibold bg-blue-600 rounded-full mb-4 shadow-md">
                              {new Date(image.publishedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-lg line-clamp-3">
                              {image.subtitle || image.paragraph?.substring(0, 150) || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {carouselImages.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-10 md:opacity-0 md:group-hover:opacity-100"
                    aria-label="Previous slide"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-10 md:opacity-0 md:group-hover:opacity-100"
                    aria-label="Next slide"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {carouselImages.length > 3 && (
                <div className="flex justify-center mt-10 space-x-3">
                  {Array.from({ length: Math.max(0, carouselImages.length - 2) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`transition-all duration-500 rounded-full ${
                        idx === currentIndex
                          ? 'bg-blue-600 w-12 h-3'
                          : 'bg-gray-300 w-3 h-3 hover:bg-gray-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {societyData.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No society articles yet</h3>
            <p className="text-gray-500">Check back later for new content</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Society;