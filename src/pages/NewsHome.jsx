// NewsHome.jsx - समाचार Page
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const NewsHome = () => {
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

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">समाचार</h2>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {carouselItems.map((item) => (
          <div
            key={item.id}
            className="group relative h-72 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.title_np}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <p className="text-white font-bold text-lg">{item.title_np}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-300">{item.journalist}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-300">{item.publishedTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional News Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            image: "https://images.unsplash.com/photo-1614632535591-98e13e1e6e4c?w=800",
            tag: "खेलकुद",
            title: "Manchester United demand record transfer fee for De Gea",
            subtitle: "Real Madrid offer world-record for goalkeeper"
          },
          {
            image: "https://images.unsplash.com/photo-1507679799987-93b5f9b7a7ec?w=800",
            tag: "अन्तर्राष्ट्रिय",
            title: "Greek debt talks deepen deadlock",
            subtitle: "EU leaders meet amid fears of new crisis"
          },
          {
            image: "https://images.unsplash.com/photo-1581092160607-798f1c6f3e1c?w=800",
            tag: "विज्ञान",
            title: "In pictures: 3D art in China's new hotspot",
            subtitle: "De Gea to Real Madrid talks heat up"
          },
          {
            image: "https://images.unsplash.com/photo-1552799446-159ba9523315?w=800",
            tag: "राजनीति",
            title: "Putin's Russian city faces NATO threat",
            subtitle: "Eastern Europe arms buildup intensifies"
          },
          {
            image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
            tag: "प्रविधि",
            title: "Samsung partners with Microsoft for new mobile",
            subtitle: "Toshiba software update announced"
          },
          {
            image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800",
            tag: "अन्तर्राष्ट्रिय",
            title: "French Uber protests block Paris and Marseille",
            subtitle: "Transport chaos as drivers strike"
          },
          {
            image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800",
            tag: "मनोरञ्जन",
            title: "Bobby Jindal presidential bid sparks Twitter mockery",
            subtitle: "Louisiana Governor's announcement ridiculed"
          },
          {
            image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
            tag: "विज्ञान",
            title: "What is the end of the middle class?",
            subtitle: "Greek debt crisis deepens"
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border border-gray-200"
          >
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <span className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
                {item.tag}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-blue-300 transition-colors">
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
  );
};

export default NewsHome;