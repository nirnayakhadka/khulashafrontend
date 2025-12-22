// SocietyHome.jsx - समाज Page
import React from 'react';
import { ChevronRight } from 'lucide-react';

const SocietyHome = () => {
  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            समाज
            <div className="h-1 w-32 bg-purple-600 rounded-full mt-4"></div>
          </h1>
          <a href="#" className="text-purple-600 font-medium flex items-center gap-2 hover:gap-4 transition-all">
            थप हेर्नुहोस् <ChevronRight size={24} />
          </a>
        </div>

        <div className="group relative rounded-3xl overflow-hidden shadow-2xl h-[500px] md:h-[650px] cursor-pointer mb-12">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
            alt="समाज मुख्य समाचार"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 p-8 md:p-12 text-white w-full">
            <span className="inline-block bg-purple-600 px-5 py-2 rounded-full text-sm font-bold mb-4">समाज</span>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              सामाजिक सद्भाव र एकताको लागि युवाहरूको अभियान
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mt-4">
              देशभरि चलिरहेको 'हामी एक छौं' अभियानले लाखौंलाई जोडेको छ
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-gray-300">प्रतिवेदन: रमेश थापा</span>
              <span className="text-sm text-gray-300">•</span>
              <span className="text-sm text-gray-300">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Society Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {[
            {
              image: "https://images.unsplash.com/photo-1614632535591-98e13e1e6e4c?w=1200",
              tag: "समाज",
              title: "शिक्षामा समानता अभियान सफल",
              subtitle: "ग्रामीण क्षेत्रमा शिक्षाको पहुँच बढ्यो"
            },
            {
              image: "https://images.unsplash.com/photo-1507679799987-93b5f9b7a7ec?w=1200",
              tag: "समाज",
              title: "महिला सशक्तिकरण कार्यक्रम विस्तार",
              subtitle: "आर्थिक स्वावलम्बनका लागि तालिम"
            },
            {
              image: "https://images.unsplash.com/photo-1581092160607-798f1c6f3e1c?w=1200",
              tag: "समाज",
              title: "युवा उद्यमशीलता विकास",
              subtitle: "स्टार्टअप संस्कृतिको प्रवर्द्धन"
            },
            {
              image: "https://images.unsplash.com/photo-1552799446-159ba9523315?w=1200",
              tag: "समाज",
              title: "सामुदायिक स्वास्थ्य सेवा सुधार",
              subtitle: "ग्रामीण क्षेत्रमा निःशुल्क उपचार"
            },
            {
              image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200",
              tag: "समाज",
              title: "वातावरण संरक्षण जनचेतना",
              subtitle: "प्लास्टिकमुक्त अभियान सफल"
            },
            {
              image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1200",
              tag: "समाज",
              title: "सांस्कृतिक सम्पदा संरक्षण",
              subtitle: "परम्परागत कलाको पुनरुत्थान"
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-[420px] sm:h-[480px] lg:h-[520px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <span className="absolute top-6 left-6 bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
                {item.tag}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-200 line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocietyHome;