import React, { useState } from 'react';

function Society() {
  // Top Featured Stories
  const featuredStories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
      category: 'LIFESTYLE',
      title: 'Quiet Family Celebrations in a Busy World',
      description: 'Intimate gatherings bring warmth to winter evenings as families reconnect over shared memories and simple joys.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=800&q=80',
      category: 'CULTURE',
      title: 'Emerging Artist Unveils Bold New Collection',
      description: 'A local painter showcases vibrant works inspired by cultural heritage, blending tradition with contemporary expression.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      category: 'COMMUNITY',
      title: 'Bold Leaders Who Shaped Our City',
      description: 'Community pioneers reflect on decades of service, innovation, and the lasting impact on urban development.'
    }
  ];

  // Diverse Small Cards
  const smallCards = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
      category: 'SOCIETY',
      title: 'Portrait Studies: Faces That Tell Stories',
      description: 'A captivating photography exhibition exploring the depth of human emotion through intimate portraits.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80',
      category: 'NATURE',
      title: 'The Art of Botanical Gardens',
      description: 'Exquisite illustrations capturing the seasonal beauty and intricate details of flora.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
      category: 'TRAVEL',
      title: 'Vivid Night Skies Over City Lights',
      description: 'Urban explorers document mesmerizing twilight moments blending nature and metropolis.'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
      category: 'PORTRAIT',
      title: 'The Thoughtful Gentleman',
      description: 'Modern interpretations of classical portraiture with depth and character.'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=80',
      category: 'ENVIRONMENT',
      title: 'Protecting Pristine Wilderness',
      description: 'Ongoing conservation efforts to preserve untouched landscapes for future generations.'
    }
  ];

  // Politics Section
  const politicsStories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80',
      title: 'Parliament Debates Landmark Climate Bill'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=600&q=80',
      title: 'Election Results: A Shift in Power'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1541480551145-2370a440d585?w=600&q=80',
      title: 'New Housing Policy Promises Reform'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1528459584353-5297db1a9c01?w=600&q=80',
      title: 'Global Summit Yields Key Agreements'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=600&q=80',
      title: 'Opposition Leader Calls for Unity'
    }
  ];

  // Carousel Images with Title, Subtitle & Date
  const carouselImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80',
      title: 'Warm Family Moment',
      subtitle: 'Capturing the essence of togetherness in everyday life',
      date: 'December 18, 2025'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80',
      title: 'Political Conference Insights',
      subtitle: 'Key discussions shaping national policy and future directions',
      date: 'December 18, 2025'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
      title: 'Inspiring Community Leader',
      subtitle: 'A journey of dedication, service, and lasting community impact',
      date: 'December 18, 2025'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80',
      title: 'Expressive Portrait Study',
      subtitle: 'Emotions and stories revealed through the lens',
      date: 'December 18, 2025'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80',
      title: 'Serene Natural Landscape',
      subtitle: 'Finding peace and beauty in untouched wilderness',
      date: 'December 18, 2025'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80',
      title: 'Classic Gentleman Portrait',
      subtitle: 'Timeless sophistication meets modern expression',
      date: 'December 18, 2025'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&q=80',
      title: 'Botanical Garden Beauty',
      subtitle: 'The delicate artistry of nature in full bloom',
      date: 'December 18, 2025'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=80',
      title: 'Timeless Elegance',
      subtitle: 'Grace, poise, and the enduring power of classic style',
      date: 'December 18, 2025'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">

        {/* Top Featured Stories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredStories.map(story => (
            <div
              key={story.id}
              className="group cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-4 mb-2">
                {story.category}
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight transition-colors group-hover:text-blue-700">
                {story.title}
              </h3>
              <p className="text-sm text-gray-600">{story.description}</p>
            </div>
          ))}
        </div>

        {/* Hero Section */}
        <div className="border-t border-b border-gray-200 py-16 mb-16 text-center">
          <img
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80"
            alt="Hero portrait"
            className="w-64 h-64 object-cover rounded-full mx-auto mb-8 shadow-2xl"
          />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Welcome To The Times WordPress Theme For Writers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            This Times newspaper theme for WordPress is designed to give your writing the respect it deserves — to tell stories with clarity and grace.
          </p>
        </div>

        {/* Diverse Small Cards */}
        <div className="mb-16">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 pb-3 border-b border-gray-300">
            DIVERSE
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {smallCards.map(card => (
              <div
                key={card.id}
                className="group cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >
                <div className="overflow-hidden rounded-lg mb-4">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">{card.category}</p>
                <h4 className="text-base font-bold text-gray-900 leading-tight mb-2 transition-colors group-hover:text-blue-600">
                  {card.title}
                </h4>
                <p className="text-xs text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Politics Section */}
        <div className="mb-20">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 pb-3 border-b border-gray-300">
            POLITICS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 group cursor-pointer">
              <div className="overflow-hidden rounded-xl mb-6">
                <img
                  src={politicsStories[0].image}
                  alt={politicsStories[0].title}
                  className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight transition-colors group-hover:text-blue-700">
                {politicsStories[0].title}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <button className="px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 rounded">
                READ MORE
              </button>
            </div>

            <div className="space-y-8">
              {politicsStories.slice(1).map(story => (
                <div key={story.id} className="group cursor-pointer flex gap-4 border-b border-gray-200 pb-6 last:border-0 last:pb-0 transition-all hover:translate-x-2">
                  <div className="overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-32 h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 leading-tight transition-colors group-hover:text-blue-600">
                    {story.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Gallery Carousel with Title, Subtitle & Date */}
        <div className="mb-16">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-8 pb-3 border-b border-gray-300">
            FEATURED GALLERY
          </h3>

          <div className="relative group max-w-7xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  // 1 slide on mobile, 3 on larger → perfect equal width
                  transform: `translateX(-${currentIndex * (window.innerWidth < 768 ? 100 : 100 / 3)}%)`
                }}
              >
                {/* Duplicate for infinite loop */}
                {[
                  ...carouselImages,
                  ...carouselImages.slice(0, window.innerWidth < 768 ? 1 : 3)
                ].map((image, idx) => (
                  <div
                    key={`${image.id}-${idx}`}
                    className="w-full md:w-[33.333333%] flex-shrink-0 px-0 md:px-3"
                  >
                    <div className="relative overflow-hidden rounded-xl h-[500px] md:h-[600px] group/item cursor-pointer bg-gray-900">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                      />

                      {/* Always Visible: Clean Title Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 md:p-8 pt-20">
                        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                          {image.title}
                        </h3>
                      </div>

                      {/* On Hover/Tap: Subtitle + Date */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-600 flex flex-col justify-end p-6 md:p-8">
                        <div className="text-white">
                          <span className="inline-block px-4 py-1.5 text-xs font-semibold bg-blue-600 rounded-full mb-4 shadow-md">
                            {image.date}
                          </span>
                          <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-lg">
                            {image.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
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

            {/* Dots Indicator */}
            <div className="flex justify-center mt-10 space-x-3">
              {carouselImages.map((_, idx) => (
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
          </div>
        </div>

      </div>
    </div>
  );
}

export default Society;