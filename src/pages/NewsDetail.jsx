import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import axiosInstance from '../api/axios';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    fetchNewsDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/news/${id}`);
      setNews(response.data);
      
      // Fetch all news for related articles
      const allNewsResponse = await axiosInstance.get('/news');
      const related = allNewsResponse.data
        .filter(item => item.id !== parseInt(id))
        .slice(0, 4);
      setRelatedNews(related);
      
      setError(null);
    } catch (err) {
      setError('Failed to load news details');
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = news?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news details...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'News not found'}</p>
          <button 
            onClick={() => navigate('/news')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/news')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to News</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              {news.image && (
                <img
                  src={news.image?.startsWith('http') ? news.image : `http://localhost:5000${news.image}`}
                  alt={news.title}
                  className="w-full h-96 object-cover"
                />
              )}

              <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {news.title}
                </h1>

                {/* Subtitle */}
                {news.subtitle && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {news.subtitle}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-200">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    {news.journalistImage ? (
                      <img
                        src={news.journalistImage?.startsWith('http') ? news.journalistImage : `http://localhost:5000${news.journalistImage}`}
                        alt={news.journalistName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{news.journalistName || 'Unknown Author'}</p>
                      <p className="text-sm text-gray-500">Journalist</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>
                      {new Date(news.publishedDate).toLocaleDateString('ne-NP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Time Ago */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span>{getTimeAgo(news.publishedDate)}</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-gray-600 font-medium">Share:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    title="Share on Facebook"
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                    title="Share on Twitter"
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={20} />
                  </button>
                </div>

                {/* Content */}
                {news.paragraph && (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: news.paragraph }}
                  />
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">सम्बन्धित समाचार</h3>
                  <div className="space-y-6">
                    {relatedNews.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/news/${item.id}`)}
                        className="flex gap-4 cursor-pointer group"
                      >
                        <img
                          src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                          alt={item.title}
                          className="w-24 h-20 object-cover rounded-lg group-hover:opacity-80 transition"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                            {item.title}
                          </p>
                          <span className="text-sm text-gray-500 mt-1 block">
                            {getTimeAgo(item.publishedDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ad Space */}
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

export default NewsDetail;