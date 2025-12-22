
import React, { useState } from 'react';
import { Calendar, Clock, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

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
    title: 'नेपालको अर्थतन्त्रमा नयाँ अवसरहरू',
    excerpt: 'सरकारले नयाँ नीति लागू गरेपछि लगानीकर्ताहरू उत्साहित भएका छन्...',
    date: '२०८२ पुष ३',
    time: '२ घण्टा अघि',
    thumbnail: 'https://risingnepaldaily.com/storage/media/73522/HoR.jpeg',
  },
  // ... (rest of your mockPosts array remains the same)
];

const trendingPosts = mockPosts.slice(0, 3);
const popularPosts = mockPosts.slice(3, 6);

const MoreHome = () => {
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Pagination logic
  const totalPages = Math.ceil(mockPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = mockPosts.slice(indexOfFirstPost, indexOfLastPost);

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
            <div className="lg:sticky lg:top-8 space-y-8">
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
};

export default MoreHome;