import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/local';

function LocalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticleDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      // Fetch the specific article
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Article not found');
      const data = await response.json();
      setArticle(data);

      // Fetch all articles for related news
      const allResponse = await fetch(API_BASE_URL);
      if (allResponse.ok) {
        const allArticles = await allResponse.json();
        // Get 3 random related articles (excluding current)
        const related = allArticles
          .filter(a => a.id !== parseInt(id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setRelatedArticles(related);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
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

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || 'Local News';
    
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
          <p className="text-gray-600 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Article not found'}</p>
          <button
            onClick={() => navigate('/local')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/local')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all hover:gap-3"
          >
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Local News</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content - Main Column */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Category Badge */}
              <div className="px-8 pt-8">
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full">
                  LOCAL NEWS
                </span>
              </div>

              {/* Title */}
              <div className="px-8 pt-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {article.title}
                </h1>

                {/* Subtitle */}
                {article.subtitle && (
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {article.subtitle}
                  </p>
                )}
              </div>

              {/* Author & Date Info */}
              <div className="px-8 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {article.journalistImage ? (
                      <img
                        src={`http://localhost:5000${article.journalistImage}`}
                        alt={article.journalistName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <User size={28} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {article.journalistName || 'Unknown Author'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(article.publishedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{getTimeAgo(article.publishedDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-semibold mr-2">Share:</span>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                      title="Share on Facebook"
                    >
                      <Facebook size={18} />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition"
                      title="Share on Twitter"
                    >
                      <Twitter size={18} />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition"
                      title="Share on LinkedIn"
                    >
                      <Linkedin size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {article.image && (
                <div className="px-8 pt-8">
                  <img
                    src={`http://localhost:5000${article.image}`}
                    alt={article.title}
                    className="w-full h-auto max-h-[600px] object-cover rounded-xl shadow-md"
                  />
                </div>
              )}

              {/* Article Body */}
              <div className="px-8 py-8">
                <div
                  className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.875rem'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: article.paragraph || '<p class="text-gray-500 italic">No content available.</p>'
                  }}
                />
              </div>
            </article>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/local')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                <ArrowLeft size={20} />
                Back to All News
              </button>
            </div>
          </div>

          {/* Sidebar - Related Articles */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
                Related Articles
              </h2>

              {relatedArticles.length > 0 ? (
                <div className="space-y-6">
                  {relatedArticles.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => navigate(`/local/${related.id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                        <img
                          src={related.image ? `http://localhost:5000${related.image}` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80'}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 mb-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getTimeAgo(related.publishedDate)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No related articles found</p>
              )}

              {/* Ad Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                  <p className="text-xs text-gray-500 mb-2">ADVERTISEMENT</p>
                  <div className="h-64 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-400">Ad Space</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocalDetail;