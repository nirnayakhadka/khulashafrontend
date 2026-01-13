import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, MessageCircle, Share, MessageCircleCode} from 'lucide-react';
import khulashaLogo from '../assets/image/khulashalogo.png';
import { FaTiktok } from 'react-icons/fa';
import NepaliDate from 'nepali-date-converter';

const API_BASE_URL = 'http://localhost:5000/api';
function LocalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [mixedNews, setMixedNews] = useState([]);

  useEffect(() => {
    fetchArticleDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

const fetchArticleDetail = async () => {
  try {
    setLoading(true);
    
    // Fetch main article
    const response = await fetch(`${API_BASE_URL}/news/${id}`);
    if (!response.ok) throw new Error('Article not found');
    const data = await response.json();
    
    // Extract article data
    const articleData = data.success && data.data ? data.data : data;
    setArticle(articleData);

    // Fetch related and mixed news in parallel
    const [relatedRes, mixedRes] = await Promise.all([
      fetch(`${API_BASE_URL}/news/category/local?limit=8`),
      fetch(`${API_BASE_URL}/news/mixed-feed/${id}?limit=18`)
    ]);

    if (relatedRes.ok) {
      const relatedData = await relatedRes.json();
      // Extract array from response
      const allArticles = relatedData.success && Array.isArray(relatedData.data)
        ? relatedData.data
        : Array.isArray(relatedData)
          ? relatedData
          : [];
      
      const related = allArticles
        .filter(a => a.id !== parseInt(id))
        .slice(0, 8);
      setRelatedArticles(related);
    }

    if (mixedRes.ok) {
      const mixedData = await mixedRes.json();
      // Extract array from response
      const mixed = mixedData.success && Array.isArray(mixedData.data)
        ? mixedData.data
        : Array.isArray(mixedData)
          ? mixedData
          : [];
      setMixedNews(mixed);
    }

    setError(null);
  } catch (err) {
    setError('Failed to load article');
    console.error(err);
  } finally {
    setLoading(false);
  }
};



const toNepaliNumber = (num) => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().split('').map(digit => nepaliDigits[digit]).join('');
};

const getTimeAgo = (dateString) => {
  const now = new Date();
  const published = new Date(dateString);
  const seconds = Math.floor((now - published) / 1000);

  if (seconds < 45) return "भर्खरै";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${toNepaliNumber(minutes)} ${minutes === 1 ? 'मिनेट' : 'मिनेट'} अघि`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${toNepaliNumber(hours)} ${hours === 1 ? 'घण्टा' : 'घण्टा'} अघि`;
  }

  // After 1 day, show the Nepali date with day and time
  const nepaliMonths = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
  ];

  const nepaliDays = [
    'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'
  ];

  const nepaliDate = new NepaliDate(published);
  const month = nepaliMonths[nepaliDate.getMonth()];
  const day = toNepaliNumber(nepaliDate.getDate());
  const dayOfWeek = nepaliDays[published.getDay()];

  // Get the time in 12-hour format
  let hours12 = published.getHours();
  const mins = published.getMinutes();
  const ampm = hours12 >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
  hours12 = hours12 % 12;
  hours12 = hours12 ? hours12 : 12; // Convert 0 to 12

  const formattedTime = `${toNepaliNumber(hours12)}:${toNepaliNumber(mins.toString().padStart(2, '0'))} ${ampm}`;

  return `${month} ${day} ${dayOfWeek}, ${formattedTime}`;
};

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || 'Local News';
    
  let shareUrl = '';
  let useClipboard = false;

  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n\n' + url)}`;
      break;
    case 'viber':
      shareUrl = `viber://forward?text=${encodeURIComponent(title + '\n\n' + url)}`;
      break;
    case 'tiktok':
      shareUrl = `https://www.tiktok.com/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      break;

    case 'share': 
      useClipboard = true;
      break;

    default:
      return;
  }

  if (useClipboard) {
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('लिङ्क क्लिपबोर्डमा कपी गरियो!'); 
        // Optional: You can also try Web Share API first
        if (navigator.share) {
          navigator.share({
            title: title,
            text: title,
            url: url
          }).catch(err => {
            console.log('Web Share failed:', err);
          });
        }
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('लिङ्क कपी गर्न सकिएन। कृपया म्यानुअल रूपमा कपी गर्नुहोस्।');
      });
  } else if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=500,noreferrer');
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
      sports: 'bg-red-600',
      more: 'bg-orange-600'
    };
    return colors[category] || 'bg-gray-600';
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
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content - Main Column */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}


              <div className="p-8">
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-normal md:text-4xl">
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
                            ? "w-10 h-10 rounded-full object-cover border border-blue-600 border-3" 
                            : "w-12 h-12 object-contain rounded-full object-contain border border-blue-600 border-3"
                      }
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{article.journalistName || 'अज्ञात लेखक'}</p>
                      <p className="text-sm text-gray-500"></p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>
                      {new Date(article.publishedDate).toLocaleDateString('ne-NP', {
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
                {article.image && (
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-96 object-cover"
                />
              )}
                {/* Share Buttons */}
                <div className="flex items-center gap-4 mb-5 mt-5">
                  <span className="text-gray-600 font-medium">सेयर:</span>
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
                 onClick={() => handleShare('whatsapp')}
                 className="p-2  text-white bg-green-500  rounded-lg hover:bg-green-800 transition"
                 title="share on Whatsapp"
                 >
                 <MessageCircle size={20}/>
                 </button>
                 <button
                 onClick={() => handleShare('viber')}
                 className="p-2  text-white bg-purple-500  rounded-lg hover:bg-purple-800 transition"
                 title="share on viber"
                 >
                 <MessageCircle size={20}/>
                 </button>
                 <button
                 onClick={() => handleShare('tiktok')}
                 className="p-2 bg-gray-900 text-white rounded-lg"
                 title="share on tiktok"
                 >
                 <FaTiktok size={20}/>
                 </button>
                 <button
                 onClick={() => handleShare('share')}
                 className="p-2 bg-gray-300 text-black-950 hover:bg-gray-600 transition rounded-lg"
                 title="share"
                 >
                 <Share size={20}/>
                                
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

                    {relatedArticles.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/local/${item.id}`)}
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
}

export default LocalDetail;