// SportsHome.jsx - खेलखबर Page
import React from 'react';
import { ChevronRight } from 'lucide-react';

const SportsHome = () => {
  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            खेलखबर
            <div className="h-1 w-32 bg-green-600 rounded-full mt-4"></div>
          </h1>
          <a href="#" className="text-green-600 font-medium flex items-center gap-2 hover:gap-4 transition-all">
            थप हेर्नुहोस् <ChevronRight size={24} />
          </a>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left + Middle Column: Main Content + 3x2 Grid Cards */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Large Card */}
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer h-[500px] md:h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1200"
                alt="Featured Sports"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <span className="absolute top-6 left-6 bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold uppercase">
                FEATURED
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  नेपाली क्रिकेट टोलीको ऐतिहासिक जित
                </h2>
                <p className="text-xl md:text-2xl text-gray-200">
                  भारतविरुद्धको टेस्टमा पहिलो जित
                </p>
                <p className="text-sm mt-4 opacity-80">२०८२ माघ १</p>
              </div>
            </div>

            {/* 3 Rows × 2 Columns Grid Cards (6 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  image: "https://images.unsplash.com/photo-1570549718199-c4a5c8f7b6e5?w=800",
                  title: "फुटबल क्लबमा नयाँ खेलाडी अनुबन्ध",
                  subtitle: "एजेन्सीले रेकर्ड शुल्क तिरेको",
                  tag: "फुटबल"
                },
                {
                  image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
                  title: "म्याराथन दौडमा नेपाली धावक स्वर्ण",
                  subtitle: "एशियाली खेलकुदमा सफलता",
                  tag: "एथलेटिक्स"
                },
                {
                  image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800",
                  title: "क्रिकेट लिगको नयाँ सिजन सुरु",
                  subtitle: "ठूला खेलाडीहरू सहभागी",
                  tag: "क्रिकेट"
                },
                {
                  image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800",
                  title: "बास्केटबल टोलीको अन्तर्राष्ट्रिय भ्रमण",
                  subtitle: "एशिया टुरमा नेपाल",
                  tag: "बास्केटबल"
                },
                {
                  image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800",
                  title: "टेनिसमा नेपाली खेलाडीको सफलता",
                  subtitle: "एटीपी टुरमा राम्रो प्रदर्शन",
                  tag: "टेनिस"
                },
                {
                  image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800",
                  title: "भलिबल राष्ट्रिय टोलीको तयारी",
                  subtitle: "एशियाली च्याम्पियनसिपका लागि",
                  tag: "भलिबल"
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer h-[360px] lg:h-[400px]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                    {item.tag}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-green-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-200 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-10">
            {/* Trending List */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">ट्रेन्डिङ</h2>
              <div className="space-y-5">
                {[
                  "नेपालले ट्वान्टी२० सिरिजमा जित",
                  "फुटबल टोलीको प्रशिक्षक परिवर्तन",
                  "जिम खेलकुदमा नेपाली खेलाडीको सफलता",
                  "बास्केटबल लिगको फाइनल खेल",
                  "टेनिसमा नयाँ खेलाडी उदय",
                  "भलिबल राष्ट्रिय टोलीको तयारी",
                ].map((title, i) => (
                  <div key={i} className="py-3 border-b border-gray-200 last:border-0">
                    <h4 className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors cursor-pointer line-clamp-2">
                      {title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Section */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">अन्य खेल समाचार</h3>
              <div className="space-y-4">
                <p className="text-gray-700">नेपालको खेलकुद विकासमा नयाँ योजना</p>
                <p className="text-gray-700">युवा खेलाडीहरूलाई अन्तर्राष्ट्रिय अवसर</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsHome;