import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2, BookmarkPlus, Facebook, Twitter, Linkedin } from 'lucide-react';
import axiosInstance from '../api/axios';
import khulashaLogo from '../assets/image/khulashalogo.png';

const MoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [mixedNews, setMixedNews] = useState([]);

  useEffect(() => {
    fetchArticle();
    window.scrollTo(0, 0);
  }, [id]);

const fetchArticle = async () => {
  try {
    setLoading(true);
    
    // Fetch article detail, related articles, and mixed news in parallel
    const [response, allArticlesResponse, mixedRes] = await Promise.all([
      axiosInstance.get(`/news/${id}`),
      axiosInstance.get('/news/category/more'),
      axiosInstance.get(`/news/mixed-feed/${id}?limit=18`)
    ]);
    
    // Extract article from response
    const articleData = response.data.success && response.data.data 
      ? response.data.data 
      : response.data;
    setArticle(articleData);

    // Extract array from allArticlesResponse
    const allArticlesData = allArticlesResponse.data.success && Array.isArray(allArticlesResponse.data.data)
      ? allArticlesResponse.data.data
      : Array.isArray(allArticlesResponse.data)
        ? allArticlesResponse.data
        : [];

    // Related articles (same category only)
    const related = allArticlesData
      .filter(item => item.id !== parseInt(id))
      .slice(0, 8);
    setRelatedArticles(related);

    // Extract array from mixedRes
    const mixedData = mixedRes.data.success && Array.isArray(mixedRes.data.data)
      ? mixedRes.data.data
      : Array.isArray(mixedRes.data)
        ? mixedRes.data
        : [];
    
    setMixedNews(mixedData);

    setError(null);
  } catch (error) {
    console.error('Error fetching article:', error);
    setError('समाचार लोड गर्न सकिएन। कृपया पुन: प्रयास गर्नुहोस्।');
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ne-NP', options);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'भर्खरै';
    if (diffInHours < 24) return `${diffInHours} घण्टा अघि`;
    if (diffInDays === 1) return '१ दिन अघि';
    if (diffInDays < 7) return `${diffInDays} दिन अघि`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} हप्ता अघि`;
    return `${Math.floor(diffInDays / 30)} महिना अघि`;
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = article.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const navigateToArticle = (item) => {
    navigate(`/${item.category}/${item.id}`);
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1504711434969-e338f2762819?w=600';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      main: 'bg-indigo-600',
      news: 'bg-blue-600',
      society: 'bg-green-600',
      local: 'bg-purple-600',
      sports: 'bg-red-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">लोड गर्दै...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">समाचार भेटिएन</h2>
          <p className="text-gray-600 mb-6">{error || 'यो समाचार अवस्थित छैन वा हटाइएको छ।'}</p>
          <button
            onClick={() => navigate('/more')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            फिर्ता जानुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              {article.image && (
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-96 object-cover"
                />
              )}

              <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Subtitle */}
                {article.subtitle && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {article.subtitle}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-200">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={article.journalistImage 
                        ? getImageUrl(article.journalistImage)
                        : khulashaLogo
                      }
                      alt={article.journalistName || "Khulasha Nepal"}
                      className={article.journalistImage 
                        ? "w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                        : "w-12 h-12 object-contain"
                      }
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{article.journalistName || 'अज्ञात लेखक'}</p>
                      <p className="text-sm text-gray-500">पत्रकार</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>{formatDate(article.publishedDate)}</span>
                  </div>

                  {/* Time Ago */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span>{getTimeAgo(article.publishedDate)}</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-gray-600 font-medium">साझेदारी गर्नुहोस्:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    title="Facebook"
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                    title="Twitter"
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                    title="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </button>
                </div>

                {/* Content */}
                {article.paragraph && (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.paragraph }}
                  />
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">सम्बन्धित समाचार</h3>
                  <div className="space-y-6">
                    {relatedArticles.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/more/${item.id}`)}
                        className="flex gap-4 cursor-pointer group"
                      >
                        <img
                          src={getImageUrl(item.image)}
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
            </div>
          </aside>
        </div>

        {/* Mixed News from All Categories - Single Section */}
        {mixedNews.length > 0 && (
          <div className="mt-16">
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">थप समाचारहरू</h2>
                <p className="text-gray-600">सबै श्रेणीबाट छनोट गरिएका समाचारहरू</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mixedNews.map((item) => (
                  <div
                    key={`${item.category}-${item.id}`}
                    onClick={() => navigateToArticle(item)}
                    className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Category Badge */}
                      <div className={`absolute top-3 left-3 ${getCategoryColor(item.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {item.categoryNepali}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 mb-2 text-lg">
                        {item.title}
                      </h3>
                      
                      {item.subtitle && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {item.subtitle}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {item.journalistImage && (
                            <img 
                              src={getImageUrl(item.journalistImage)} 
                              alt={item.journalistName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <span className="truncate">{item.journalistName}</span>
                        </div>
                        <span>{getTimeAgo(item.publishedDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreDetail;