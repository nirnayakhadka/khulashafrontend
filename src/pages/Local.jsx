import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

function Local() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80',
      date: 'April 26, 2025',
      category: 'POLITICS',
      title: "Obama 'confident' of reaching deal by June",
      author: 'John Smith',
      views: '1.2M'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=1200&q=80',
      date: 'April 25, 2025',
      category: 'BUSINESS',
      title: 'Global markets surge amid economic optimism',
      author: 'Sarah Johnson',
      views: '890K'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
      date: 'April 24, 2025',
      category: 'TECHNOLOGY',
      title: 'Tech giants announce breakthrough in AI development',
      author: 'Michael Chen',
      views: '1.5M'
    }
  ];



  const mainStories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      category: 'SPORTS',
      title: 'Manchester United demand record breaking transfer fee for De Gea',
      description: 'The Red Devils are holding out for a world-record fee as Spanish giants circle their goalkeeper.',
      time: '2 hours ago'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80',
      category: 'LIFESTYLE',
      title: 'Climate 2025 Lolls: deadlock over draft',
      description: 'International negotiations stall as nations dispute environmental commitments.',
      time: '4 hours ago'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1581093450021-4a2022b0c7b3?w=600&q=80',
      category: 'TECHNOLOGY',
      title: 'Apple unveils revolutionary M4 chip with enhanced AI capabilities',
      description: 'The latest silicon promises unprecedented performance gains and power efficiency for upcoming devices.',
      time: '3 hours ago'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
      category: 'BUSINESS',
      title: 'Wall Street hits all-time high as inflation cools',
      description: 'Major indices surge following better-than-expected economic data and Federal Reserve signals.',
      time: '5 hours ago'
    }
  ];

  const sidebarStories = [
    { id: 1, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&q=80', title: 'Coffee & Health: Is six cups a day really too much?', time: '1 hour ago' },
    { id: 2, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80', title: 'Lifestyle: Urban agriculture sees massive growth', time: '3 hours ago' },
    { id: 3, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80', title: 'How to Heat Bitcoin with USB 3', time: '5 hours ago' },
    { id: 4, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', title: 'Samsung Unveils Microsoft wireless keyboard', time: '6 hours ago' },
    { id: 5, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80', title: 'Snapchat eyes $1 Bn Eurtion funding', time: '8 hours ago' }
  ];

  const middleCards = [
    { id: 1, image: 'https://images.unsplash.com/photo-1464690048666-8db43868cd37?w=400&q=80', category: 'POLITICS', title: "Putin's Reassuringly", description: 'Russian leader signals willingness to engage in diplomatic talks with Western nations.' },
    { id: 2, image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&q=80', category: 'SOCIAL', bgColor: 'bg-sky-400', title: 'add hair', description: 'Social media platform faces unprecedented user exodus amid policy changes.', isTwitterCard: true },
    { id: 3, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', category: 'EDUCATION', title: 'Briefly: Undergraduate third seeks policy change', description: 'Student body calls for comprehensive reform of university admission policies.' }
  ];

  const bottomStories = [
    { id: 1, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80', category: 'POLITICS', title: 'What does David Cameron want?', description: 'Former PM weighs in on current political landscape and future direction.' },
    { id: 2, image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80', category: 'TECHNOLOGY', title: "French firm projects blockchain use in Marseille", description: 'Innovation hub explores practical applications of distributed ledger technology.', large: true }
  ];

  const videoCards = [
    { id: 1, image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80', hasVideo: true, title: 'Virtual reality transforms education' },
    { id: 2, image: 'https://images.unsplash.com/photo-1509966756634-9c23dd6e6815?w=400&q=80', title: 'Watch in the end of the middle segment' },
    { id: 3, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', title: 'Greek debt crisis: They are only to pay' },
    { id: 4, image: 'https://images.unsplash.com/photo-1516321310764-7b7ec6b9e68b?w=400&q=80', hasVideo: true, title: 'AI revolution in healthcare explained' },
    { id: 5, image: 'https://images.unsplash.com/photo-1531297484001-800221147f48?w=400&q=80', title: 'New electric vehicle breaks speed records' },
    { id: 6, image: 'https://images.unsplash.com/photo-1498050108023-c63000294a15?w=400&q=80', title: 'Space tourism: The next frontier' },
    { id: 7, image: 'https://images.unsplash.com/photo-1581093577422-7c3a3d4e9f6f?w=400&q=80', hasVideo: true, title: 'Quantum computing breakthrough announced' }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const nextVideo = () => setVideoCarouselIndex((prev) => (prev + 1) % (videoCards.length - 2));
  const prevVideo = () => setVideoCarouselIndex((prev) => (prev - 1 + videoCards.length) % (videoCards.length - 2));

  return (
    <div className="bg-gray-100 min-h-screen">
      
      
      {/* Hero Slider with Arrows */}
      <div className="relative h-[550px] overflow-hidden group">
        <div className="max-w-[1600px] mx-auto h-full relative">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-[1600px] mx-auto">
            <div className="max-w-[1600px]">
              <div className="flex items-center space-x-4 text-sm mb-3">
                <span>{heroSlides[currentSlide].date}</span>
                <span>in</span>
                <span className="text-red-500 font-semibold">{heroSlides[currentSlide].category}</span>
              </div>
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <div className="flex items-center space-x-6 text-sm">
                <button className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition">
                  Read More
                </button>
                <span className="flex items-center space-x-2">👤 {heroSlides[currentSlide].author}</span>
                <span className="flex items-center space-x-2">👁 {heroSlides[currentSlide].views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left/Right Arrows */}
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

        {/* Dots */}
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



      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Top Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainStories.map((story) => (
              <div key={story.id} className="bg-white overflow-hidden rounded-lg shadow hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
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

          <div className="space-y-4">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-bold">Top News</h3>
            </div>
            {sidebarStories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
        </div>

        {/* Middle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {middleCards.map((card) => (
            <div
              key={card.id}
              className={`${card.isTwitterCard ? card.bgColor : 'bg-white'} rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1`}
            >
              {card.isTwitterCard ? (
                <div className="p-8 text-white h-full flex flex-col justify-center">
                  <div className="text-5xl mb-4">add section</div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {bottomStories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
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

        {/* Video Carousel Section */}
        <div className="py-8">
          <h2 className="text-2xl font-bold mb-6">Featured Videos</h2>
          <div className="relative group">
            {/* Carousel Arrows */}
            <button
              onClick={prevVideo}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel */}
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${videoCarouselIndex * 34}%)` }}
              >
                {videoCards.map((card) => (
                  <div key={card.id} className="flex-shrink-0 w-full md:w-1/3">
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group/card">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition duration-700"
                        />
                        {card.hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center hover:scale-110 transition">
                              <Play size={28} className="text-black ml-1" />
                            </div>
                          </div>
                        )}
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
      </div>
    </div>
  );
}

export default Local;