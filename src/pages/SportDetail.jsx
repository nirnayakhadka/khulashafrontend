import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ← ADD useParams + useNavigate
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, MessageCircle, TrendingUp, Flame, Eye } from 'lucide-react';

const SportDetail = () => { // ← Remove props (articleId, onBack)
  const { id } = useParams(); // ← GET ID from URL (/sports/123 → id = "123")
  const navigate = useNavigate(); // ← For back button
  const [article, setArticle] = useState(null);
  const [suggestedArticles, setSuggestedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchArticleAndSuggestions();
    }
  }, [id]); // ← Depend on id from URL

  const fetchArticleAndSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔍 Fetching sports article ID: ${id}`); // ← DEBUG

      // 1. Fetch SINGLE article (FAST + CORRECT)
      const articleResponse = await fetch(`http://localhost:5000/api/sports/${id}`);
      if (!articleResponse.ok) {
        throw new Error(`Article fetch failed: ${articleResponse.status}`);
      }
      const articleData = await articleResponse.json();
      console.log('📄 Article:', articleData); // ← DEBUG
      setArticle(articleData);

      // 2. Fetch suggestions (all sports except current)
      const suggestionsResponse = await fetch('http://localhost:5000/api/sports');
      if (!suggestionsResponse.ok) {
        throw new Error('Suggestions fetch failed');
      }
      const allArticles = await suggestionsResponse.json();
      const suggestions = allArticles
        .filter(item => item.id != id) // ← Use != for string/number safety
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      setSuggestedArticles(suggestions);

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'भर्खरै';
    if (diffInHours < 24) return `${diffInHours} घण्टा अगाडि`;
    if (diffInDays === 1) return '१ दिन अगाडि';
    return `${diffInDays} दिन अगाडि`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Back button handler
  const handleBack = () => navigate(-1); // ← Go back in history

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-4">समाचार लोड गर्न असफल भयो (ID: {id})</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            सबै खेलकुद समाचारमा फर्कनुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack} // ← Fixed back button
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">सबै खेलकुद समाचारमा फर्कनुहोस्</span>
              <span className="sm:hidden">फिर्ता</span>
            </button>
            
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">साझा गर्नुहोस्:</span>
              <button onClick={() => handleShare('facebook')} className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600" title="Facebook">
                <Facebook size={20} />
              </button>
              <button onClick={() => handleShare('twitter')} className="p-2 hover:bg-sky-50 rounded-lg transition text-sky-600" title="Twitter">
                <Twitter size={20} />
              </button>
              <button onClick={() => handleShare('whatsapp')} className="p-2 hover:bg-green-50 rounded-lg transition text-green-600" title="WhatsApp">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-8">
              {article.image && (
                <img
                  src={`http://localhost:5000${article.image}`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Article Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed border-l-4 border-blue-600 pl-4">
                  {article.subtitle}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  {article.journalistImage ? (
                    <img
                      src={`http://localhost:5000${article.journalistImage}`}
                      alt={article.journalistName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
                      <User size={28} className="text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">लेखक</p>
                    <p className="font-bold text-gray-900 text-lg">{article.journalistName || 'अज्ञात'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={20} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">प्रकाशित मिति</p>
                    <p className="font-semibold">{formatDate(article.publishedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={20} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">समय</p>
                    <p className="font-semibold">{getTimeAgo(article.publishedDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                style={{ lineHeight: '1.8', fontSize: '18px' }}
                dangerouslySetInnerHTML={{ __html: article.paragraph || article.content || '' }} // ← Fallback for content field
              />
            </div>

            {/* Share Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Share2 size={24} className="text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">यो समाचार साझा गर्नुहोस्</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleShare('facebook')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 shadow">
                    <Facebook size={18} /> Facebook
                  </button>
                  <button onClick={() => handleShare('twitter')} className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition flex items-center gap-2 shadow">
                    <Twitter size={18} /> Twitter
                  </button>
                  <button onClick={() => handleShare('whatsapp')} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition flex items-center gap-2 shadow">
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - Suggested Articles */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={24} />
                  <h3 className="text-xl font-bold">ट्रेन्डिङ समाचार</h3>
                </div>
                <p className="text-orange-100 text-sm">अहिले सबैभन्दा धेरै पढिएका खेलकुद समाचारहरू</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={20} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">अन्य समाचारहरू</h3>
                </div>
                <div className="space-y-4">
                  {suggestedArticles.map((suggested) => (
                    <button
                      key={suggested.id}
                      onClick={() => navigate(`/sports/${suggested.id}`)} // ← Use navigate
                      className="block w-full group text-left"
                    >
                      <div className="flex gap-3 p-3 rounded-lg hover:bg-blue-50 transition">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          {suggested.image ? (
                            <img
                              src={`http://localhost:5000${suggested.image}`}
                              alt={suggested.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Eye size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition mb-2">
                            {suggested.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{getTimeAgo(suggested.publishedDate)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {suggestedArticles.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">अन्य समाचार उपलब्ध छैन</p>
                )}
              </div>

              <div className="bg-gray-100 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
                <p className="text-gray-500 font-medium mb-2">विज्ञापन स्थान</p>
                <p className="text-gray-400 text-sm">300 x 250</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SportDetail;