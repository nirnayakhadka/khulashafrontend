
import { Calendar, Clock, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';



function News() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 12;

  // Fetch news from backend
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/news');
      setNewsList(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare featured slides from news data
  const featuredSlides = newsList.slice(0, 4).map(news => ({
    id: news.id,
    title: news.title,
    excerpt: news.subtitle || news.paragraph?.substring(0, 100) + '...' || '',
    image: news.image?.startsWith('http') ? news.image : `http://localhost:5000${news.image}`
  }));

  const trendingPosts = newsList.slice(0, 3);
  const popularPosts = newsList.slice(3, 6);
  
// Pagination logic
  const totalPages = Math.ceil(newsList.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = newsList.slice(indexOfFirstPost, indexOfLastPost);

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
  const getTimeAgo = (date) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInMs = now - publishedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInDays === 0) {
      if (diffInHours === 0) return 'भर्खरै';
      return `${diffInHours} घण्टा अघि`;
    }
    if (diffInDays === 1) return '१ दिन अघि';
    if (diffInDays < 7) return `${diffInDays} दिन अघि`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} हप्ता अघि`;
    return `${Math.floor(diffInDays / 30)} महिना अघि`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={fetchNews}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Slider */}
<section className="my-12">
  {featuredSlides.length > 0 && (
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
        <SwiperSlide key={slide.id}> onClick={() => navigate(`/news/${slide.id}`)}
          <div className="relative h-full w-full cursor-pointer">
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
  )}
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
                  onClick={() => navigate(`/news/${post.id}`)}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                    viewMode === 'list' ? 'flex gap-8' : ''
                  }`}
                >
                  <img
                    src={post.image?.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                    alt={post.title}
                    className={`${
                      viewMode === 'list'
                        ? 'w-80 h-56 object-cover'
                        : 'w-full h-64 object-cover'
                    }`}
                  />
                  <div className="p-8 flex-1">
                    <h4 
                      className="text-2xl font-bold mb-4 hover:text-red-700 cursor-pointer transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/news/${post.id}`);
                      }}
                    >
                      {post.title}
                    </h4>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-6">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      {new Date(post.publishedDate).toLocaleDateString('ne-NP', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={18} />
                      {getTimeAgo(post.publishedDate)}
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
                        <button onClick={() => navigate(`/news/${post.id}`)}>
                         
                        </button>
                         {post.title}
                        </p>
                        <span className="text-sm text-gray-500 mt-1 block">{getTimeAgo(post.publishedDate)}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-red-700">लोकप्रिय</h3>
                <div className="space-y-6">
                  {popularPosts.map((post) => (
                    <div 
                        key={post.id} 
                        className="flex gap-4 cursor-pointer group"
                        onClick={() => navigate(`/news/${post.id}`)}
                      >
                        
                      <img
                        src={post.image?.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                        alt={post.title}
                        className="w-24 h-20 object-cover rounded-xl"
                      />
                    <p className="font-medium group-hover:text-red-700 transition">
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