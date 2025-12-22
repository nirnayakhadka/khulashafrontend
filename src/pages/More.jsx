import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, Globe, Video, Mic, BookOpen, Award, Users, MessageCircle, ChevronLeft, ChevronRight, Star, CheckCircle, Link2, Ribbon } from 'lucide-react';

const More = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [hoveredBioCard, setHoveredBioCard] = useState(null);

  // Carousel cards - Nepali News
  const carouselCards = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800&q=80",
      title: "प्रधानमन्त्रीको संसदमा विशेष सम्बोधन",
      category: "राजनीति"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      title: "नेपालमा डिजिटल प्रविधिको विकास",
      category: "प्रविधि"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
      title: "शेयर बजारमा उछाल, लगानीकर्ता खुशी",
      category: "अर्थतन्त्र"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
      title: "हिमालय संरक्षणका लागि नयाँ योजना",
      category: "वातावरण"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
      title: "साग प्रतियोगिता: नेपाली टिमको शानदार प्रदर्शन",
      category: "खेलकुद"
    }
  ];

  const featured3DCards = [
    {
      id: 1,
      icon: TrendingUp,
      title: "चर्चित समाचार",
      description: "देश विदेशका सबैभन्दा धेरै पढिएका र चर्चित समाचारहरू",
      gradient: "from-orange-500 to-pink-500",
      stats: "२५ लाख+ पाठक",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"
    },
    {
      id: 2,
      icon: Video,
      title: "भिडियो समाचार",
      description: "ताजा समाचार र विशेष अन्तर्वार्ता भिडियोमा हेर्नुहोस्",
      gradient: "from-blue-500 to-cyan-500",
      stats: "१८ लाख+ दर्शक",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80"
    },
    {
      id: 3,
      icon: Mic,
      title: "पोडकास्ट",
      description: "गहिरो विश्लेषण र विशेषज्ञहरूको छलफल सुन्नुहोस्",
      gradient: "from-purple-500 to-indigo-500",
      stats: "५ लाख+ श्रोता",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
    }
  ];

  // Bio Cards Data - Nepali News Portal Categories
  const bioCards = [
    {
      id: 1,
      color: "rgb(184, 87, 73)",
      icon: Newspaper,
      title: "राजनीति",
      description: "देश र विदेशका राजनीतिक घटनाक्रम र विश्लेषण",
      rating: 4.1,
      completion: 0.12,
      gradient: "from-red-600 to-red-700",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80"
    },
    {
      id: 2,
      color: "rgb(68, 131, 97)",
      icon: TrendingUp,
      title: "अर्थतन्त्र",
      description: "व्यापार, वित्त र शेयर बजारका समाचार",
      rating: 4.5,
      completion: 0.32,
      gradient: "from-green-700 to-green-800",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
    },
    {
      id: 3,
      color: "rgb(191, 123, 63)",
      icon: Globe,
      title: "अन्तर्राष्ट्रिय",
      description: "विश्वभरका महत्वपूर्ण समाचार र घटनाहरू",
      rating: 5,
      completion: 0.8,
      gradient: "from-orange-600 to-orange-700",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
    },
    {
      id: 4,
      color: "rgb(200, 98, 148)",
      icon: Users,
      title: "समाज",
      description: "सामाजिक मुद्दा र समुदायका कथाहरू",
      rating: 4.6,
      completion: 1,
      gradient: "from-pink-600 to-pink-700",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
    },
    {
      id: 5,
      color: "rgb(87, 107, 170)",
      icon: Award,
      title: "खेलकुद",
      description: "राष्ट्रिय र अन्तर्राष्ट्रिय खेलकुद समाचार",
      rating: 4.2,
      completion: 0.46,
      gradient: "from-blue-600 to-blue-700",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80"
    },
    {
      id: 6,
      color: "rgb(127, 92, 170)",
      icon: Video,
      title: "मनोरञ्जन",
      description: "चलचित्र, संगीत र सेलिब्रिटी समाचार",
      rating: 3.9,
      completion: 0.6,
      gradient: "from-purple-600 to-purple-700",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80"
    }
  ];

  // Character Cards Data - Nepali Political Leaders
  const heroData = [
    {
      id: "leader1",
      alias: "राष्ट्रिय नेता",
      realName: "प्रधानमन्त्री ओली",
      imgSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      description: 'नेपालको वर्तमान प्रधानमन्त्री केपी शर्मा ओली। उहाँले देशको आर्थिक र सामाजिक विकासमा महत्वपूर्ण योगदान दिनुभएको छ।'
    },
    {
      id: "leader2",
      alias: "पूर्व प्रधानमन्त्री",
      realName: "पुष्पकमल दाहाल प्रचण्ड",
      imgSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
      description: 'नेपालको पूर्व प्रधानमन्त्री पुष्पकमल दाहाल प्रचण्ड। जसले गणतन्त्र नेपालको निर्माणमा अहम भूमिका खेल्नुभएको थियो।'
    },
    {
      id: "leader3",
      alias: "काङ्ग्रेस नेता",
      realName: "शेरबहादुर देउवा",
      imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      description: "नेपाली काङ्ग्रेसका सभापति शेरबहादुर देउवा। बहुदलीय लोकतन्त्रका पक्षधर र अनुभवी राजनीतिज्ञ हुनुहुन्छ।"
    }
  ];

  const quickLinks = [
    { icon: Globe, title: "अन्तर्राष्ट्रिय", color: "text-blue-500" },
    { icon: Newspaper, title: "स्थानीय समाचार", color: "text-green-500" },
    { icon: BookOpen, title: "विचार", color: "text-purple-500" },
    { icon: Award, title: "पुरस्कार", color: "text-yellow-500" },
    { icon: Users, title: "समुदाय", color: "text-pink-500" },
    { icon: MessageCircle, title: "फोरम", color: "text-indigo-500" }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % carouselCards.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + carouselCards.length) % carouselCards.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleCards = () => {
    const cards = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentSlide + i + carouselCards.length) % carouselCards.length;
      cards.push({ ...carouselCards[index], offset: i });
    }
    return cards;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Carousel Section */}
      <div className="max-w-[1600px] mx-auto px-4 py-16 sm:px-6 lg:px-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">ताजा समाचार</h2>
        
        <div className="relative h-96 mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
              {getVisibleCards().map((card) => {
                const offset = card.offset;
                const isCenter = offset === 0;
                const absOffset = Math.abs(offset);
                
                return (
                  <div
                    key={card.id}
                    className="absolute transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      transform: `
                        translateX(${offset * 280}px)
                        translateZ(${isCenter ? 0 : -200 * absOffset}px)
                        scale(${isCenter ? 1 : 1 - absOffset * 0.2})
                        rotateY(${offset * -15}deg)
                      `,
                      zIndex: isCenter ? 50 : 50 - absOffset * 10,
                      opacity: absOffset > 1 ? 0.3 : 1,
                      width: '320px',
                      height: '420px'
                    }}
                    onClick={() => isCenter && alert(`खोल्दै: ${card.title}`)}
                  >
                    <div className={`relative h-full rounded-2xl overflow-hidden shadow-2xl ${isCenter ? 'ring-4 ring-blue-500' : ''}`}>
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className="inline-block px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold mb-3">
                          {card.category}
                        </span>
                        <h3 className="text-2xl font-bold">{card.title}</h3>
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

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentSlide(idx);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? 'bg-blue-500 w-8' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>



        {/* Bio Cards with Hover Transition */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">समाचार वर्ग</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1600px] mx-auto">
            {bioCards.map((card, idx) => {
              const Icon = card.icon;
              const isLarge = idx === 2 || idx === 3;
              const isHoveredCard = hoveredBioCard === card.id;
              
              return (
                <div
                  key={card.id}
                  className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                    isLarge ? 'lg:col-span-2 lg:row-span-2' : ''
                  }`}
                  style={{
                    minHeight: isLarge ? '400px' : '300px'
                  }}
                  onMouseEnter={() => setHoveredBioCard(card.id)}
                  onMouseLeave={() => setHoveredBioCard(null)}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${card.image})`,
                      transform: isHoveredCard ? 'scale(1.1)' : 'scale(1)'
                    }}
                  ></div>
                  


                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <pattern id={`pattern-${card.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="2" fill="white" />
                      </pattern>
                      <rect width="100" height="100" fill={`url(#pattern-${card.id})`} />
                    </svg>
                  </div>

                  <div className="relative p-6 h-full flex flex-col justify-between text-white z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-light opacity-90">समाचार वर्ग</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Star className="w-6 h-6 fill-white" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <Icon className="w-5 h-5" style={{ color: card.color }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold mb-3 drop-shadow-lg">{card.title}</h3>
                      <p className="text-white/95 mb-6 line-clamp-2 drop-shadow-md">{card.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-white" />
                          <span className="font-semibold">{card.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">{Math.round(card.completion * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
                {/* Router Tabs Card */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">हाम्रो बारेमा</h2>
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-[1600px] mx-auto">
           
            <div className="flex gap-4 mb-6 border-b border-slate-200">
              {[
                { key: 'about', label: 'परिचय' },
                { key: 'services', label: 'सेवाहरू' },
                { key: 'contact', label: 'सम्पर्क' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="min-h-64">
              {activeTab === 'about' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">हाम्रो बारेमा</h3>
                  <p className="text-slate-600 mb-4">
                    हामी नेपालको अग्रणी अनलाइन समाचार पोर्टल हौं। देश विदेशका भरपर्दो र तथ्यपरक समाचार प्रदान गर्दै आएका छौं। हाम्रो उद्देश्य पाठकहरूलाई सही समयमा सही जानकारी प्रदान गर्नु हो।
                  </p>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-blue-900">
                      हाम्रो टिमले २४ घण्टै देश विदेशका समाचारहरू संकलन र प्रकाशन गर्दै आएको छ। तपाईंको विश्वास नै हाम्रो शक्ति हो।
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'services' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">हाम्रा सेवाहरू</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <Newspaper className="w-8 h-8 text-purple-600 mb-3" />
                      <h4 className="font-bold text-purple-900 mb-2">समाचार कभरेज</h4>
                      <p className="text-sm text-purple-700">२४/७ ताजा समाचार अपडेट</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <Video className="w-8 h-8 text-blue-600 mb-3" />
                      <h4 className="font-bold text-blue-900 mb-2">भिडियो सामग्री</h4>
                      <p className="text-sm text-blue-700">विशेष अन्तर्वार्ता र रिपोर्ट</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <Mic className="w-8 h-8 text-green-600 mb-3" />
                      <h4 className="font-bold text-green-900 mb-2">पोडकास्ट</h4>
                      <p className="text-sm text-green-700">गहिरो विश्लेषण र छलफल</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                      <Globe className="w-8 h-8 text-orange-600 mb-3" />
                      <h4 className="font-bold text-orange-900 mb-2">अन्तर्राष्ट्रिय</h4>
                      <p className="text-sm text-orange-700">विश्वव्यापी समाचार नेटवर्क</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">सम्पर्क जानकारी</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-800">इमेल</p>
                        <p className="text-slate-600">info@nepalnews.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                      <Globe className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-slate-800">वेबसाइट</p>
                        <p className="text-slate-600">www.nepalnews.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                      <Newspaper className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-semibold text-slate-800">कार्यालय</p>
                        <p className="text-slate-600">काठमाडौं, नेपाल</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Character Cards with Hover */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">राजनीतिक नेताहरू</h2>
          <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
            नेपालका प्रमुख राजनीतिक नेताहरूको जानकारी। थप विवरणको लागि प्रत्येक नेतामाथि माउस घुमाउनुहोस्।
          </p>
          
          <div className="space-y-8 max-w-[1600px] mx-auto">
            {heroData.map((hero) => (
              <CharacterCard key={hero.id} {...hero} />
            ))}
          </div>
        </div>

        {/* 3D Cards Section */}
        <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">विशेष संग्रह</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featured3DCards.map((card) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;
            
            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group cursor-pointer"
                style={{
                  transform: isHovered ? 'translateY(-12px) rotateX(5deg)' : 'translateY(0) rotateX(0)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div 
                  className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
                  style={{
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.4s ease',
                    boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60`}></div>
                  </div>

                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{card.title}</h3>
                    <p className="text-slate-600 mb-4">{card.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span className="text-sm font-semibold text-slate-500">{card.stats}</span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                        हेर्नुहोस् →
                      </span>
                    </div>
                  </div>

                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                    style={{
                      transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                      transition: 'transform 0.6s ease, opacity 0.6s ease'
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Character Card Component
const CharacterCard = ({ alias, realName, imgSrc, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative h-100 rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title and Subtitle */}
      <div
        className="absolute top-28 left-0 bg-white px-6 py-3 shadow-lg transition-transform duration-300 z-10"
        style={{
          transform: isHovered ? 'translateX(-10px)' : 'translateX(0)'
        }}
      >
        <h2 className="text-3xl font-bold text-slate-900">{alias}</h2>
      </div>
      
      <div
        className="absolute top-40 left-16 bg-black text-white px-6 py-2 text-xs uppercase tracking-wider transition-transform duration-300 z-20"
        style={{
          transform: isHovered ? 'translateX(-80px)' : 'translateX(0)'
        }}
      >
        {realName}
      </div>

      {/* Hover Description Overlay */}
      <div
        className="absolute inset-0 transition-all duration-400"
        style={{
          background: 'linear-gradient(-75deg, rgba(0,0,0,0.9) 40%, rgba(50,50,50,0.8) 60%, transparent 80%)',
          transform: isHovered ? 'translateX(0)' : 'translateX(100%)',
          opacity: isHovered ? 1 : 0
        }}
      >
        <div className="absolute right-0 top-0 h-full flex items-center pr-12 pl-48">
          <p className="text-white text-lg max-w-md leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default More;