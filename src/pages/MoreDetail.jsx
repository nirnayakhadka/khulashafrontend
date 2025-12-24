import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2, BookmarkPlus, Facebook, Twitter, Linkedin } from 'lucide-react';
import axiosInstance from '../api/axios';

const MoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/more/${id}`);
      setArticle(response.data);
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
    setShowShareMenu(false);
  };

  const handleBookmark = () => {
    // Add to localStorage or backend
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (!bookmarks.includes(id)) {
      bookmarks.push(id);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      alert('लेख बुकमार्क गरियो!');
    } else {
      alert('यो लेख पहिले नै बुकमार्क गरिएको छ।');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">लोड गर्दै...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">समाचार भेटिएन</h2>
          <p className="text-slate-600 mb-6">{error || 'यो समाचार अवस्थित छैन वा हटाइएको छ।'}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/more')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>सबै समाचार</span>
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Featured Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 h-96">
          <img
            src={article.image ? `http://localhost:5000${article.image}` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl text-slate-600 mb-6 leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={18} />
              <span className="text-sm">{formatDate(article.publishedDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={18} />
              <span className="text-sm">५ मिनेट पढ्न</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition font-medium"
              >
                <Share2 size={18} />
                <span>सेयर गर्नुहोस्</span>
              </button>

              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-10">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-blue-50 rounded-lg transition text-left"
                  >
                    <Facebook size={18} className="text-blue-600" />
                    <span className="text-slate-700">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-sky-50 rounded-lg transition text-left"
                  >
                    <Twitter size={18} className="text-sky-500" />
                    <span className="text-slate-700">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-indigo-50 rounded-lg transition text-left"
                  >
                    <Linkedin size={18} className="text-indigo-600" />
                    <span className="text-slate-700">LinkedIn</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition font-medium"
            >
              <BookmarkPlus size={18} />
              <span>बुकमार्क</span>
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.paragraph }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          />
        </div>

        {/* Journalist Info */}
        {article.journalistName && (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">लेखकको बारेमा</h3>
            <div className="flex items-center gap-6">
              {article.journalistImage ? (
                <img
                  src={`http://localhost:5000${article.journalistImage}`}
                  alt={article.journalistName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-1">{article.journalistName}</h4>
                <p className="text-slate-600">वरिष्ठ पत्रकार</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Articles Placeholder */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">सम्बन्धित समाचार</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300"></div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-800 mb-2 line-clamp-2">अन्य समाचार शीर्षक यहाँ</h4>
                  <p className="text-sm text-slate-600">२ घण्टा अगाडि</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowShareMenu(false)}
        ></div>
      )}

      <style>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #1e293b;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }
        .prose p {
          margin-bottom: 1.25em;
        }
        .prose ul, .prose ol {
          margin-left: 1.5em;
          margin-bottom: 1.25em;
        }
        .prose li {
          margin-bottom: 0.5em;
        }
        .prose strong {
          color: #1e293b;
          font-weight: 600;
        }
        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default MoreDetail;