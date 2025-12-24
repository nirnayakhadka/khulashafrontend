// MoreHome.jsx - Backend Integration
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const MoreHome = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 12;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/more');
      setArticles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      if (diffInHours === 0) return 'भर्खरै';
      return `${diffInHours} घण्टा अघि`;
    }
    if (diffInDays === 1) return '१ दिन अघि';
    if (diffInDays < 7) return `${diffInDays} दिन अघि`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} हप्ता अघि`;
    return `${Math.floor(diffInDays / 30)} महिना अघि`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ne-NP', options);
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Pagination logic
  const totalPages = Math.ceil(articles.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Trending and popular posts
  const trendingPosts = articles.slice(0, 3);
  const popularPosts = articles.slice(3, 6);

  // Loading state
  if (loading) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button 
              onClick={fetchArticles}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              पुन: प्रयास गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="mb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">समाचार उपलब्ध छैन</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-10">
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
                  onClick={() => navigate(`/more/${post.id}`)}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                    viewMode === 'list' ? 'flex gap-8' : ''
                  }`}
                >
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className={`${
                      viewMode === 'list'
                        ? 'w-80 h-56 object-cover'
                        : 'w-full h-64 object-cover'
                    }`}
                  />
                  <div className="p-8 flex-1">
                    <h4 className="text-2xl font-bold mb-4 hover:text-red-700 transition">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">
                      {post.subtitle || stripHtml(post.paragraph)?.substring(0, 150) + '...' || ''}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-6">
                      <span className="flex items-center gap-2">
                        <Calendar size={18} />
                        {formatDate(post.publishedDate)}
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
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Trending Section */}
              {trendingPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-red-700">ट्रेन्डिङ</h3>
                  <ol className="space-y-6">
                    {trendingPosts.map((post, index) => (
                      <li 
                        key={post.id} 
                        onClick={() => navigate(`/more/${post.id}`)}
                        className="flex gap-4 cursor-pointer group"
                      >
                        <span className="text-3xl font-extrabold text-gray-200 group-hover:text-red-700 transition-colors">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-lg hover:text-red-700 transition line-clamp-2">
                            {post.title}
                          </p>
                          <span className="text-sm text-gray-500 mt-1 block">
                            {getTimeAgo(post.publishedDate)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Popular Section */}
              {popularPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-red-700">लोकप्रिय</h3>
                  <div className="space-y-6">
                    {popularPosts.map((post) => (
                      <div 
                        key={post.id} 
                        onClick={() => navigate(`/more/${post.id}`)}
                        className="flex gap-4 cursor-pointer group"
                      >
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          className="w-24 h-20 object-cover rounded-xl"
                        />
                        <p className="font-medium hover:text-red-700 transition line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advertisement Section */}
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <p className="text-gray-600 font-medium text-lg">विज्ञापन क्षेत्र</p>
                <p className="text-sm text-gray-500 mt-2">३०० × ६००</p>
              </div>
            </div>
          </aside>
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/more')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            सबै समाचार हेर्नुहोस्
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreHome;