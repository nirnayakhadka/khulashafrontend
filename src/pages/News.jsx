import React, { useState } from 'react';
import { Calendar, Clock, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const featuredSlides = [
  {
    id: 1,
    title: 'अर्थमन्त्री वर्षमान पुनको अन्तर्राष्ट्रिय भेटघाट',
    excerpt: 'विश्व बैंक र IMF सँग नेपालको लगानी वातावरणबारे छलफल...',
    image: 'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=809080827920538',
  },
  {
    id: 2,
    title: 'नेपाल लगानीका लागि आकर्षक गन्तव्य: अर्थमन्त्री',
    excerpt: 'अन्तर्राष्ट्रिय लगानीकर्ताहरूसँग द्विपक्षीय वार्ता...',
    image: 'https://annapurnaexpress.prixacdn.net/media/albums/Barshaman_Pun_vZv3y8WnXG.jpg',
  },
  {
    id: 3,
    title: 'नेप्से सूचकांकमा उतारचढावको इतिहास',
    excerpt: 'बजारको वृद्धि र गिरावटको विस्तृत विश्लेषण...',
    image: 'https://s3.tradingview.com/snapshots/y/yb1NxnSy.png',
  },
  {
    id: 4,
    title: 'नेपालमा विदेशी प्रत्यक्ष लगानी (FDI) को अवलोकन',
    excerpt: 'पछिल्ला वर्षहरूमा FDI को वृद्धि दर र क्षेत्रहरू...',
    image: 'https://nepaleconomicforum.org/wp-content/uploads/2022/03/Screenshot-2022-03-07-at-2.57.59-PM-1024x550.png',
  },
];

const mockPosts = [
  {
    id: 1,
    title: 'नेपालको अर्थतन्त्रमा नयाँ अवसरहरू',
    excerpt: 'सरकारले नयाँ नीति लागू गरेपछि लगानीकर्ताहरू उत्साहित भएका छन्...',
    date: '२०८२ पुष ३',
    time: '२ घण्टा अघि',
    thumbnail: 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg',
  },
  {
    id: 2,
    title: 'अन्तर्वार्ता: अर्थमन्त्रीसँग विशेष कुराकानी',
    excerpt: 'अर्थमन्त्रीले बजेटका प्राथमिकताहरू बारे विस्तृतमा बताउनुभयो...',
    date: '२०८२ पुष २',
    time: '५ घण्टा अघि',
    thumbnail: 'https://www.researchgate.net/publication/377637443/figure/fig1/AS:11431281219652215@1706098068289/NEPSE-Combined-chart-of-Candle-Sticks-BB-and-MACD.jpg',
  },
  {
    id: 3,
    title: 'विदेशी लगानी बढ्दो क्रममा',
    excerpt: 'यो वर्ष नेपालमा विदेशी लगानी ३० प्रतिशतले बढेको छ...',
    date: '२०८२ पुष १',
    time: '१ दिन अघि',
    thumbnail: 'https://figures.semanticscholar.org/6541ac3c1f1ad4d3e3abc7e017266cadf01b2aef/12-Figure2-1.png',
  },
  {
    id: 4,
    title: 'स्टक मार्केटको अवस्था',
    excerpt: 'नेप्से सूचकांकमा सुधार देखिएको छ...',
    date: '२०८१ मंसिर ३०',
    time: '२ दिन अघि',
    thumbnail: 'https://www.investopaper.com/wp-content/uploads/2020/04/nepse-index.jpg',
  },
  {
    id: 5,
    title: 'नयाँ बजेटमा कर सुधारका प्रस्ताव',
    excerpt: 'कर प्रणालीलाई सरल र पारदर्शी बनाउने योजना सार्वजनिक...',
    date: '२०८१ मंसिर २९',
    time: '३ दिन अघि',
    thumbnail: 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg',
  },
  {
    id: 6,
    title: 'औद्योगिक क्षेत्रमा ठूलो लगानी',
    excerpt: 'निजी क्षेत्रको सहभागितासँगै नयाँ उद्योगहरू स्थापना हुँदै...',
    date: '२०८१ मंसिर २८',
    time: '४ दिन अघि',
    thumbnail: 'https://www.investopaper.com/wp-content/uploads/2020/04/nepse-index.jpg',
  },
  {
    id: 7,
    title: 'नेप्सेमा रेकर्ड तोड्ने कारोबार',
    excerpt: 'एकै दिन १५ अर्बभन्दा बढीको शेयर कारोबार...',
    date: '२०८१ मंसिर २७',
    time: '५ दिन अघि',
    thumbnail: 'https://s3.tradingview.com/snapshots/y/yb1NxnSy.png',
  },
  {
    id: 8,
    title: 'हाइड्रोपावर कम्पनीहरूको आकर्षक लाभांश',
    excerpt: 'लगानीकर्ताहरूले राम्रो प्रतिफल पाउने अपेक्षा...',
    date: '२०८१ मंसिर २६',
    time: '१ हप्ता अघि',
    thumbnail: 'https://nepaleconomicforum.org/wp-content/uploads/2022/03/Screenshot-2022-03-07-at-2.57.59-PM-1024x550.png',
  },
  {
    id: 9,
    title: 'बैंकहरूले ब्याजदर घटाए',
    excerpt: 'कर्जाको माग बढाउन ब्याजदरमा कटौती...',
    date: '२०८१ मंसिर २५',
    time: '१ हप्ता अघि',
    thumbnail: 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg',
  },
  {
    id: 10,
    title: 'राष्ट्र बैंकको मौद्रिक नीति समीक्षा',
    excerpt: 'अर्थतन्त्रलाई चलायमान बनाउन नयाँ निर्देशन...',
    date: '२०८१ मंसिर २४',
    time: '१० दिन अघि',
    thumbnail: 'https://www.researchgate.net/publication/377637443/figure/fig1/AS:11431281219652215@1706098068289/NEPSE-Combined-chart-of-Candle-Sticks-BB-and-MACD.jpg',
  },
  {
    id: 11,
    title: 'आईपीओ बजारमा उत्साह',
    excerpt: 'सामान्य लगानीकर्ताले पनि अवसर पाउने गरी नयाँ नियम...',
    date: '२०८१ मंसिर २३',
    time: '११ दिन अघि',
    thumbnail: 'https://figures.semanticscholar.org/6541ac3c1f1ad4d3e3abc7e017266cadf01b2aef/12-Figure2-1.png',
  },
  {
    id: 12,
    title: 'पर्यटन क्षेत्रमा लगानीको लहर',
    excerpt: 'विदेशी कम्पनीहरूले होटल तथा रिसोर्टमा चासो देखाएका छन्...',
    date: '२०८१ मंसिर २२',
    time: '१२ दिन अघि',
    thumbnail: 'https://annapurnaexpress.prixacdn.net/media/albums/Barshaman_Pun_vZv3y8WnXG.jpg',
  },
  {
    id: 13,
    title: 'सेयर बजारमा नयाँ लगानीकर्ताको प्रवेश',
    excerpt: 'डिम्याट खाता खोल्नेको संख्या रेकर्ड स्तरमा...',
    date: '२०८१ मंसिर २१',
    time: '२ हप्ता अघि',
    thumbnail: 'https://www.investopaper.com/wp-content/uploads/2020/04/nepse-index.jpg',
  },
  {
    id: 14,
    title: 'वित्तीय क्षेत्रको डिजिटलाइजेशन',
    excerpt: 'अनलाइन बैंकिङ र मोबाइल वालेटको प्रयोग बढ्दो...',
    date: '२०८१ मंसिर २०',
    time: '२ हप्ता अघि',
    thumbnail: 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg',
  },
  {
    id: 15,
    title: 'मुद्रास्फीति नियन्त्रणमा',
    excerpt: 'राष्ट्र बैंकका कदमले मूल्यवृद्धि दर घटेको छ...',
    date: '२०८१ मंसिर १९',
    time: '१५ दिन अघि',
    thumbnail: 'https://s3.tradingview.com/snapshots/y/yb1NxnSy.png',
  },
  {
    id: 16,
    title: 'निर्यातमा सकारात्मक संकेत',
    excerpt: 'हस्तकला र जडीबुटीको माग विदेशमा बढ्दो...',
    date: '२०८१ मंसिर १८',
    time: '१६ दिन अघि',
    thumbnail: 'https://nepaleconomicforum.org/wp-content/uploads/2022/03/Screenshot-2022-03-07-at-2.57.59-PM-1024x550.png',
  },
  {
    id: 17,
    title: 'साना तथा मझौला उद्यमलाई सहुलियत कर्जा',
    excerpt: 'स्टार्टअपहरूका लागि विशेष प्याकेज घोषणा...',
    date: '२०८१ मंसिर १७',
    time: '१७ दिन अघि',
    thumbnail: 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg',
  },
  {
    id: 18,
    title: 'बजार विश्लेषण: कुन सेक्टरमा लगानी गर्ने?',
    excerpt: 'विशेषज्ञहरूको सुझाव अनुसार आकर्षक क्षेत्रहरू...',
    date: '२०८१ मंसिर १६',
    time: '१८ दिन अघि',
    thumbnail: 'https://www.investopaper.com/wp-content/uploads/2020/04/nepse-index.jpg',
  },
  {
    id: 19,
    title: 'विश्व अर्थतन्त्रको प्रभाव नेपालमा',
    excerpt: 'अमेरिकी ब्याजदर घट्दा नेपाली बजारमा सकारात्मक असर...',
    date: '२०८१ मंसिर १५',
    time: '३ हप्ता अघि',
    thumbnail: 'https://s3.tradingview.com/snapshots/y/yb1NxnSy.png',
  },
  {
    id: 20,
    title: 'आगामी बजेटका अपेक्षा',
    excerpt: 'निजी क्षेत्रले पूर्वाधार र शिक्षा क्षेत्रमा जोड दिन आग्रह...',
    date: '२०८१ मंसिर १४',
    time: '३ हप्ता अघि',
    thumbnail: 'https://annapurnaexpress.prixacdn.net/media/albums/Barshaman_Pun_vZv3y8WnXG.jpg',
  },
  {
    id: 21,
    title: 'क्रिप्टोकरेंसीको नियमन बारे छलफल',
    excerpt: 'राष्ट्र बैंकले नयाँ नीति बनाउने तयारी...',
    date: '२०८१ मंसिर १३',
    time: '१ महिना अघि',
    thumbnail: 'https://www.researchgate.net/publication/377637443/figure/fig1/AS:11431281219652215@1706098068289/NEPSE-Combined-chart-of-Candle-Sticks-BB-and-MACD.jpg',
  },
  {
    id: 22,
    title: 'रेमिट्यान्समा नयाँ रेकर्ड',
    excerpt: 'वैदेशिक रोजगारीबाट प्राप्त रेमिट्यान्समा उल्लेख्य वृद्धि...',
    date: '२०८१ मंसिर १२',
    time: '१ महिना अघि',
    thumbnail: 'https://figures.semanticscholar.org/6541ac3c1f1ad4d3e3abc7e017266cadf01b2aef/12-Figure2-1.png',
  },
];

const trendingPosts = mockPosts.slice(0, 3);
const popularPosts = mockPosts.slice(3, 6);

function News() {
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12; // Now showing 12 posts per page (10-15 visible on most screens)

  // Pagination logic
  const totalPages = Math.ceil(mockPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = mockPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: scroll to top on page change
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Slider */}
<section className="my-12">
  <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] md:h-[550px] lg:h-[650px]">
    {/* Swiper */}
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation={{
        prevEl: '.swiper-button-prev-custom',
        nextEl: '.swiper-button-next-custom',
      }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      className="h-full w-full"
    >
      {featuredSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative h-full w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl hidden md:block">
                {slide.excerpt}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Navigation buttons inside the same relative container */}
    <button
      className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-3 md:p-4 shadow-xl transition"
      aria-label="Previous slide"
    >
      <ChevronLeft size={20} className="md:size-20 text-gray-800" />
    </button>
    <button
      className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-3 md:p-4 shadow-xl transition"
      aria-label="Next slide"
    >
      <ChevronRight size={20} className="md:size-20 text-gray-800" />
    </button>
  </div>
</section>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-10 pb-16">
          {/* Left: Latest News */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900">नवीनतम समाचार</h3>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-gray-300'}`}
                >
                  <List size={24} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-gray-300'}`}
                >
                  <Grid size={24} />
                </button>
              </div>
            </div>

            {/* Posts Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-10'}>
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                    viewMode === 'list' ? 'flex gap-8' : ''
                  }`}
                >
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className={`${
                      viewMode === 'list'
                        ? 'w-80 h-56 object-cover'
                        : 'w-full h-64 object-cover'
                    }`}
                  />
                  <div className="p-8 flex-1">
                    <h4 className="text-2xl font-bold mb-4 hover:text-red-700 cursor-pointer transition">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-6">
                      <span className="flex items-center gap-2">
                        <Calendar size={18} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={18} />
                        {post.time}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  अघिल्लो
                </button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  अर्को
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-red-700">ट्रेन्डिङ</h3>
                <ol className="space-y-6">
                  {trendingPosts.map((post, index) => (
                    <li key={post.id} className="flex gap-4">
                      <span className="text-3xl font-extrabold text-gray-200">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-lg hover:text-red-700 cursor-pointer transition">
                          {post.title}
                        </p>
                        <span className="text-sm text-gray-500 mt-1 block">{post.time}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-red-700">लोकप्रिय</h3>
                <div className="space-y-6">
                  {popularPosts.map((post) => (
                    <div key={post.id} className="flex gap-4">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-24 h-20 object-cover rounded-xl"
                      />
                      <p className="font-medium hover:text-red-700 cursor-pointer transition">
                        {post.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <p className="text-gray-600 font-medium text-lg">विज्ञापन क्षेत्र</p>
                <p className="text-sm text-gray-500 mt-2">३०० × ६००</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default News;