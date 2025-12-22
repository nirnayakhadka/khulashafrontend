// Main.jsx - Main Page with Integrated Components
import React, { useState } from 'react';
import { Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';

// Import all page components
import NewsHome from './NewsHome';
import MoreHome from './MoreHome';
import SocietyHome from './SocietyHome';
import LocalHome from './LocalHome';
import SportsHome from './SportsHome';

function Main() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainNews = {
    id: 1,
    image: 'https://images.unsplash.com/photo-1504711434969-e338f2762819?w=600',
    tag_np: 'मुख्य',
    title_np: 'सरकारको नयाँ बजेट घोषणा',
    subtitle_np: 'विकास र समृद्धिमा केन्द्रित बजेट',
    date: '२०८१ पुस ४',
    journalist: 'रमेश थापा',
    publishedTime: '2 hours ago'
  };

  const trendingNews = [
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1422293681-551d976b3a35?w=600',
      tag_np: 'ट्रेन्डिङ',
      title_np: 'प्रधानमन्त्रीसँग विशेष अन्तर्वार्ता',
      subtitle_np: 'देशको अर्थतन्त्र र विकासको योजना',
      journalist: 'विकास अधिकारी',
      publishedTime: '1 hour ago'
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',
      tag_np: 'ट्रेन्डिङ',
      title_np: 'युवा उद्यमीहरूको सफलताको कथा',
      subtitle_np: 'नेपालमा स्टार्टअप संस्कृतिको विकास',
      journalist: 'सरिता भट्टराई',
      publishedTime: '10 hours ago'
    }
  ];

  const cultureNews = [
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1608517296779-a012a46276bf?w=600',
      tag_np: 'संस्कृति',
      title_np: 'नेपाली चलचित्र उद्योगको नयाँ युग',
      subtitle_np: 'अन्तर्राष्ट्रिय स्तरमा नेपाली फिल्मको पहिचान',
      journalist: 'कमल पोखरेल',
      publishedTime: '1 day ago'
    }
  ];

  const carouselItems = [
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
      tag_np: 'विविध',
      title_np: 'हिमालय पर्वतारोहणको नयाँ रेकर्ड',
      subtitle_np: 'नेपाली आरोहीले नयाँ इतिहास रचे',
      journalist: 'दीपक तामाङ',
      publishedTime: '7 hours ago'
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600',
      tag_np: 'विविध',
      title_np: 'पोखरामा अन्तर्राष्ट्रिय पर्यटन सम्मेलन',
      subtitle_np: 'विश्वभरिका पर्यटन विशेषज्ञहरू सहभागी',
      journalist: 'निशा लामा',
      publishedTime: '3 days ago'
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      tag_np: 'विविध',
      title_np: 'नेपाली खानाको विश्वव्यापी लोकप्रियता',
      subtitle_np: 'अन्तर्राष्ट्रिय बजारमा नेपाली खानाको माग बढ्दो',
      journalist: 'संगीता घिमिरे',
      publishedTime: '2 days ago'
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="my-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
              {[0, 1, 2].map((index) => {
                const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600'];
                return (
                  <div key={index} className="w-full">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] md:h-[600px] lg:h-[550px] group cursor-pointer">
                      <img 
                        src={mainNews.image} 
                        alt={mainNews.title_np} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 p-6 md:p-10 lg:p-12 text-white w-full">
                        <span className={`inline-block px-4 py-1.5 ${colors[index]} text-sm font-bold mb-4 rounded`}>
                          {mainNews.tag_np}
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
                          {mainNews.title_np}
                        </h2>
                        <p className="mt-3 md:mt-4 text-lg md:text-xl lg:text-2xl text-gray-200">
                          {mainNews.subtitle_np}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <User size={18} className="text-gray-300" />
                            <span className="text-sm md:text-base text-gray-300">{mainNews.journalist}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={18} className="text-gray-300" />
                            <span className="text-sm md:text-base text-gray-300">{mainNews.publishedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* समाचार Section - IMPORTED COMPONENT */}
        <NewsHome />

        {/* ट्रेन्डिङ अन्तर्वार्ता */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {trendingNews.map((trending) => (
            <div key={trending.id} className="group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 transition-transform duration-300 hover:scale-105">
                <img src={trending.image} alt={trending.title_np} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="bg-blue-600 px-4 py-1 rounded text-sm font-bold">{trending.tag_np}</span>
                  <h3 className="text-4xl font-bold mt-4">{trending.title_np}</h3>
                  <p className="mt-3 text-lg">{trending.subtitle_np}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-sm text-gray-200">द्वारा: {trending.journalist}</span>
                    <span className="text-sm text-gray-200">•</span>
                    <span className="text-sm text-gray-200">{trending.publishedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Culture Section */}
        <div className="mb-16">
          <div className="h-1 w-32 bg-purple-600 rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-10">
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[540px] group cursor-pointer">
                <img src={cultureNews[0]?.image} alt={cultureNews[0]?.title_np} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 p-10 text-white">
                  <span className="inline-block px-4 py-1 bg-purple-600 text-sm font-bold mb-4 rounded">{cultureNews[0]?.tag_np}</span>
                  <h2 className="text-5xl font-bold leading-tight">{cultureNews[0]?.title_np}</h2>
                  <p className="mt-4 text-xl text-gray-200">{cultureNews[0]?.subtitle_np}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-sm text-gray-300">लेखक: {cultureNews[0]?.journalist}</span>
                    <span className="text-sm text-gray-300">•</span>
                    <span className="text-sm text-gray-300">{cultureNews[0]?.publishedTime}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-[540px] p-6 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border-2 border-pink-200 cursor-pointer hover:shadow-lg transition-shadow flex flex-col h-60">
                    <span className="inline-block px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded mb-3">विज्ञापन</span>
                    <div className="bg-white rounded-lg flex-1 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400" alt="Advertisement" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200 cursor-pointer hover:shadow-lg transition-shadow flex flex-col h-60">
                    <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded mb-3">विज्ञापन</span>
                    <div className="bg-white rounded-lg flex-1 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400" alt="Advertisement" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>

        {/* Carousel Section */}
        <div className="mb-20">
          <div className="h-1 w-32 bg-indigo-600 rounded-full"></div>
          <div className="mt-10 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative h-96 overflow-hidden">
              <img src={carouselItems[currentSlide]?.image} alt={carouselItems[currentSlide]?.title_np} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white max-w-2xl">
                <h2 className="text-5xl font-bold leading-tight">{carouselItems[currentSlide]?.title_np}</h2>
                <p className="mt-5 text-xl">{carouselItems[currentSlide]?.subtitle_np}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm text-gray-300">रिपोर्ट: {carouselItems[currentSlide]?.journalist}</span>
                  <span className="text-sm text-gray-300">•</span>
                  <span className="text-sm text-gray-300">{carouselItems[currentSlide]?.publishedTime}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-10">
              <h3 className="text-2xl font-bold mb-8 text-gray-800">थप रोचक सामग्री</h3>
<div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  <div className="flex transition-transform duration-600 ease-in-out md:hidden" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {carouselItems.map((item) => (
                      <div key={item.id} className="w-full flex-shrink-0 px-3">
                        <div className="h-72 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group relative">
                          <img src={item.image} alt={item.title_np} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl flex items-end p-6">
                            <div>
                              <p className="text-white font-bold text-lg">{item.title_np}</p>
                              <p className="text-xs text-gray-300 mt-1">{item.journalist} • {item.publishedTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="hidden md:flex transition-transform duration-600 ease-in-out" style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}>
                    {carouselItems.map((item) => (
                      <div key={item.id} className="w-full flex-shrink-0 px-3" style={{ width: "33.333%" }}>
                        <div className="h-72 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group relative">
                          <img src={item.image} alt={item.title_np} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl flex items-end p-6">
                            <div>
                              <p className="text-white font-bold text-lg">{item.title_np}</p>
                              <p className="text-xs text-gray-300 mt-1">{item.journalist} • {item.publishedTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={prevSlide} className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform z-10">
                  <ChevronLeft className="text-gray-800" />
                </button>
                <button onClick={nextSlide} className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform z-10">
                  <ChevronRight className="text-gray-800" />
                </button>
              </div>
          </div>
        </div>
        </div>
        {/* समाज Section - IMPORTED COMPONENT */}
        <SocietyHome />

        {/* स्थानीय Section - IMPORTED COMPONENT */}
        <LocalHome />

        {/* खेलखबर Section - IMPORTED COMPONENT */}
        <SportsHome />
        <MoreHome />
      </div>
    </div>
  );
}

export default Main;