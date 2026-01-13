// src/pages/CategoryDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Eye, ArrowLeft, Share2 } from 'lucide-react';
import axiosInstance from '../api/axios';
const API_URL = import.meta.env.VITE_API_URL 
function CategoryDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
    fetchRelatedArticles();
  }, [id, category]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/news/${id}`);
      
      if (response.data.success) {
        setArticle(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await axiosInstance.get(`/news/category/${category}?limit=6&excludeIds=${id}`);
      
      if (response.data.success) {
        setRelatedArticles(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching related articles:', err);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Article not found'}</p>
          <button 
            onClick={() => navigate(`/${category}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to {category}
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = article.image?.startsWith('http') 
    ? article.image 
    : `${API_URL}${article.image}`;
    
  const journalistImageUrl = article.journalistImage?.startsWith('http')
    ? article.journalistImage
    : article.journalistImage 
      ? `${API_URL}${article.journalistImage}`
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/${category}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to {article.categoryMeta?.label || category}</span>
        </button>

        {/* Article Card */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            {article.categoryMeta && (
              <div className={`absolute top-4 left-4 px-4 py-2 bg-${article.categoryMeta.color}-600 text-white rounded-lg font-semibold`}>
                {article.categoryMeta.label}
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="p-6 sm:p-8 md:p-12">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="text-xl sm:text-2xl text-gray-600 mb-6 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-8 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  {new Date(article.publishedDate).toLocaleDateString('ne-NP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{getTimeAgo(article.publishedDate)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{article.views || 0} views</span>
              </div>

              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Journalist Info */}
            {article.journalistName && (
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                {journalistImageUrl ? (
                  <img
                    src={journalistImageUrl}
                    alt={article.journalistName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {article.journalistName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Written by</p>
                  <p className="text-lg font-semibold text-gray-900">{article.journalistName}</p>
                </div>
              </div>
            )}

            {/* Article Body */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.paragraph }}
            />
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              More from {article.categoryMeta?.label || category}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <article
                  key={related.id}
                  onClick={() => {
                    navigate(`/${category}/${related.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={related.image?.startsWith('http') ? related.image : `${API_URL}${related.image}`}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {related.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(related.publishedDate).toLocaleDateString('ne-NP', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {getTimeAgo(related.publishedDate)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryDetail;