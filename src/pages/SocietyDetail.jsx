import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import axiosInstance from '../api/axios';

const SocietyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticleDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/society/${id}`);
      setArticle(response.data);
      
      // Fetch all articles for related content
      const allArticlesResponse = await axiosInstance.get('/society');
      const related = allArticlesResponse.data
        .filter(item => item.id !== parseInt(id))
        .slice(0, 4);
      setRelatedArticles(related);
      
      setError(null);
    } catch (err) {
      setError('Failed to load article details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInMs = now - publishedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInDays === 0) {
      if (diffInHours === 0) return 'Just now';
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
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
          <p className="text-gray-600">Loading article details...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Article not found'}</p>
          <button 
            onClick={() => navigate('/society')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Society
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
          onClick={() => navigate('/society')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Society</span>
        </button>

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
                    {article.journalistImage ? (
                      <img
                        src={getImageUrl(article.journalistImage)}
                        alt={article.journalistName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{article.journalistName || 'Unknown Author'}</p>
                      <p className="text-sm text-gray-500">Journalist</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>
                      {new Date(article.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Time Ago */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span>{getTimeAgo(article.publishedDate)}</span>
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
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Related Articles</h3>
                  <div className="space-y-6">
                    {relatedArticles.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/society/${item.id}`)}
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

              {/* Ad Space */}
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <p className="text-gray-600 font-medium text-lg">Advertisement</p>
                <p className="text-sm text-gray-500 mt-2">300 × 600</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetail;