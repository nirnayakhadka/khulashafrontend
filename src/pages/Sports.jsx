import React from 'react'
import { Play, Clock } from 'lucide-react'

function Sports() {
  const featuredGames = [
    {
      title: "राष्ट्रिय फुटबल लिग",
      subtitle: "काठमाडौं vs पोखरा",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
      tag: "प्रत्यक्ष",
      uploadTime: "२ घण्टा अगाडि"
    },
    {
      title: "च्याम्पियन्स कप",
      subtitle: "ललितपुर सिटी मात्स",
      image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=250&fit=crop",
      tag: "नयाँ",
      uploadTime: "५ घण्टा अगाडि"
    },
    {
      title: "मार्तण्ड कप २०२५",
      subtitle: "युवा प्रतिभा खोज",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=250&fit=crop",
      tag: "लोकप्रिय",
      uploadTime: "१ दिन अगाडि"
    }
  ]

  const games = [
    {
      title: "CALL OF DUTY: GHOSTS II",
      description: "रणभूमिमा तपाईंको साहस परीक्षण गर्नुहोस्",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=200&fit=crop",
      uploadTime: "३ घण्टा अगाडि"
    },
    {
      title: "ASSASSIN'S CREED IV: BLACK FLAG",
      description: "समुद्री डाकुको जीवन अनुभव गर्नुहोस्",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop",
      uploadTime: "६ घण्टा अगाडि"
    },
    {
      title: "ADVENTURE INTO CASTLETON: CHANNEL",
      description: "रहस्यमय महलको खोजी यात्रा",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=200&fit=crop",
      uploadTime: "१२ घण्टा अगाडि"
    },
    {
      title: "BATTLEFIELD 4 PS4 VERSION SUPPORT",
      description: "युद्धको मैदानमा आफ्नो टोली नेतृत्व गर्नुहोस्",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop",
      uploadTime: "१ दिन अगाडि"
    },
    {
      title: "FIFA STREET ULTIMATE EDITION",
      description: "सडक फुटबलको रोमाञ्चक अनुभव लिनुहोस्",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=200&fit=crop",
      uploadTime: "२ दिन अगाडि"
    },
    {
      title: "NBA 2K25 CHAMPIONSHIP MODE",
      description: "बास्केटबल च्याम्पियनशिप जित्नुहोस्",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop",
      uploadTime: "३ दिन अगाडि"
    }
  ]

  const sidebarGames = [
    {
      title: "Grand Theft Auto V",
      tag: "PS4",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&h=100&fit=crop"
    },
    {
      title: "Uncharted Collection",
      tag: "PS4",
      image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=100&h=100&fit=crop"
    },
    {
      title: "The Last of Us Part II",
      tag: "PS5",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop"
    },
    {
      title: "God of War Ragnarök",
      tag: "PS5",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop"
    }
  ]


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen bg-gray-900">
        <div className="max-w-[1600px] mx-auto h-full relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&h=900&fit=crop')"
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-7xl font-bold mb-4 tracking-wider">NEW FIFA 14</h1>
              <p className="text-xl text-gray-300">XBOX, XBOX ONE अनि PLAYSTATION 4 मा</p>
              <button className="mt-8 bg-red-600 hover:bg-red-700 px-8 py-3 rounded font-semibold transition-colors">
                खेल डाउनलोड गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-3">
            {/* Featured Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {featuredGames.map((game, index) => (
                <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 px-3 py-1 text-xs font-bold rounded text-white">
                      {game.tag}
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs text-white">
                    <Clock className="w-3 h-3" />
                    <span>{game.uploadTime}</span>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                    <p className="text-sm text-gray-300">{game.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Games List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {games.map((game, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-500 px-2 py-1 text-xs font-bold rounded text-white">
                        नयाँ
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      <Clock className="w-3 h-3" />
                      <span>{game.uploadTime}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{game.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                    <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                      थप जान्नुहोस् →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional 4 Column Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=200&fit=crop"
                    alt="Racing Game"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 px-2 py-1 text-xs font-bold rounded text-white">
                      नयाँ
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">NEED FOR SPEED</h3>
                  <p className="text-gray-600 text-xs mb-3">रेसिङको रोमाञ्च</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>४ दिन अगाडि</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=300&h=200&fit=crop"
                    alt="Sports Game"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 px-2 py-1 text-xs font-bold rounded text-white">
                      नयाँ
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">CRICKET 24</h3>
                  <p className="text-gray-600 text-xs mb-3">क्रिकेट च्याम्पियन</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>५ दिन अगाडि</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=300&h=200&fit=crop"
                    alt="Adventure Game"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 px-2 py-1 text-xs font-bold rounded text-white">
                      नयाँ
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">HORIZON ZERO</h3>
                  <p className="text-gray-600 text-xs mb-3">साहसिक यात्रा</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>६ दिन अगाडि</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop"
                    alt="Action Game"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 px-2 py-1 text-xs font-bold rounded text-white">
                      नयाँ
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">SPIDER-MAN</h3>
                  <p className="text-gray-600 text-xs mb-3">सुपरहिरो एक्शन</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>७ दिन अगाडि</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white-600 rounded-lg overflow-hidden shadow-lg sticky top-4 self-start">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 text-blue">लोकप्रिय खेलहरू</h3>
                <div className="space-y-4">
                  {sidebarGames.map((game, index) => (
                    <div key={index} className="flex gap-3 bg-blue-500 p-3 rounded hover:bg-blue-800 transition-colors cursor-pointer">
                      <img 
                        src={game.image} 
                        alt={game.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1">{game.title}</h4>
                        <span className="text-xs bg-orange-500 px-2 py-1 rounded text-white">
                          {game.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-red-700 p-6">
                <h4 className="font-bold mb-3 text-white">सामुदायिक समाचार</h4>
                <p className="text-sm text-red-100 mb-4">
                  नयाँ टूर्नामेंट सुरु हुँदैछ! अहिले नै दर्ता गर्नुहोस्।
                </p>
                <button className="w-full bg-white text-blue-800 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                  सहभागी हुनुहोस्
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Section - Full Width at Bottom */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">हेडलाइन</h2>
            <a href="#" className="text-red-600 hover:text-red-700 font-semibold">
              सबै समाचार →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4 bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&h=100&fit=crop"
                alt="News"
                className="w-32 h-24 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  नेपाली टोलीले जित्यो ऐतिहासिक खेल, च्याम्पियनशिपमा प्रवेश
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>२ घण्टा अगाडि</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&h=100&fit=crop"
                alt="News"
                className="w-32 h-24 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  विश्व कपको तयारीमा जुटे खेलाडीहरू, कडा अभ्यास जारी
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>४ घण्टा अगाडि</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=150&h=100&fit=crop"
                alt="News"
                className="w-32 h-24 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  युवा खेलाडीलाई राष्ट्रिय टोलीमा मौका, प्रशिक्षकको घोषणा
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>६ घण्टा अगाडि</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=150&h=100&fit=crop"
                alt="News"
                className="w-32 h-24 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  स्टेडियमको निर्माण कार्य तीव्र गतिमा, छिट्टै सम्पन्न हुने
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>८ घण्टा अगाडि</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=150&h=100&fit=crop"
                alt="News"
                className="w-32 h-24 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  प्रशिक्षकको नयाँ रणनीति, टोलीमा देखियो सकारात्मक परिवर्तन
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>१० घण्टा अगाडि</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=150&h=100&fit=crop"
                alt="News"
                className="w-32 h-24 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  खेलकुद पत्रकारहरूको सम्मेलन, नयाँ नियम बारे छलफल
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>१२ घण्टा अगाडि</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sports