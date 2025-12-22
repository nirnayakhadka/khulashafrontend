// LocalHome.jsx - स्थानीय Page
import React from 'react';

const LocalHome = () => {
  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            स्थानीय
            <div className="h-1 w-32 bg-blue-600 rounded-full mt-4"></div>
          </h1>
        </div>

        {/* Main 3-Column Layout with Sticky Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left + Middle Column: Feature News + Trending News (takes 2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured News Section */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    image: "https://images.unsplash.com/photo-1581092160607-798f1c6f3e1c?w=800",
                    title: "काठमाडौं उपत्यकामा नयाँ मेट्रो रेल परियोजना सुरु",
                    subtitle: "२०८३ सम्म सञ्चालनमा आउने",
                    date: "२०८२ माघ १",
                    source: "स्थानीय",
                    video: true,
                  },
                  {
                    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
                    title: "पोखरामा अन्तर्राष्ट्रिय पर्यटन सम्मेलन सफल",
                    subtitle: "विश्वभरिका पर्यटन व्यवसायी सहभागी",
                    date: "२०८२ माघ १",
                    source: "स्थानीय",
                  },
                  {
                    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800",
                    title: "भक्तपुरमा ३२औं दशैं महोत्सव सुरु",
                    subtitle: "परम्परागत कला र संस्कृति प्रदर्शन",
                    date: "२०८२ माघ १",
                    source: "स्थानीय",
                  },
                  {
                    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800",
                    title: "ललितपुरमा नयाँ पार्क निर्माण सम्पन्न",
                    subtitle: "स्थानीय बासिन्दालाई मनोरञ्जनको लागि",
                    date: "२०८२ माघ १",
                    source: "स्थानीय",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer h-[380px]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
                      {item.source}
                    </span>
                    {item.video && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold leading-tight mb-2 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-200 line-clamp-2">{item.subtitle}</p>
                      <p className="text-xs mt-2 opacity-80">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending News Section */}
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "काठमाडौंमा ट्राफिक व्यवस्थापनमा सुधार", image: "https://images.unsplash.com/photo-1507679799987-93b5f9b7a7ec?w=600" },
                  { title: "नयाँ बिजुली आयोजना निर्माण सुरु", image: "https://images.unsplash.com/photo-1581092160607-798f1c6f3e1c?w=600" },
                  { title: "स्थानीय बजारमा मूल्यवृद्धि नियन्त्रण", image: "https://images.unsplash.com/photo-1552799446-159ba9523315?w=600" },
                  { title: "नेपालगञ्जमा स्वास्थ्य शिविर", image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600" },
                  { title: "धनकुटामा चिया उत्पादन वृद्धि", image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=600" },
                  { title: "बुटवलमा नयाँ सडक विस्तार", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600" },
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative rounded-xl overflow-hidden shadow-lg h-48 mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-12">
            {/* Most Viewed */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">सर्वाधिक पढिएको</h2>
              <div className="space-y-4">
                {[
                  "काठमाडौंमा वायु प्रदूषण घट्यो",
                  "नयाँ पुल निर्माणले यात्रु सहज",
                  "स्थानीय तहमा बजेट वृद्धि",
                  "नेपालगञ्जमा बजार विस्तार",
                  "भक्तपुरमा नयाँ मन्दिर निर्माण",
                  "पोखरामा पर्यटन बोर्ड गठन",
                ].map((title, i) => (
                  <div key={i} className="py-3 border-b border-gray-200 last:border-0">
                    <h4 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                      {title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow Us */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">हामीलाई फलो गर्नुहोस्</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
                  { name: "Twitter", color: "bg-blue-400 hover:bg-blue-500" },
                  { name: "Instagram", color: "bg-pink-600 hover:bg-pink-700" },
                  { name: "YouTube", color: "bg-red-600 hover:bg-red-700" },
                ].map((social, i) => (
                  <button
                    key={i}
                    className={`text-white px-6 py-4 rounded-xl text-center font-medium transition-colors ${social.color}`}
                  >
                    {social.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalHome;