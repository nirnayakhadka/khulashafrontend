import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save, X, Edit, Trash2, Image, User, Eye, Plus, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-300'}`}>
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded transition" title="Bold">
          <Bold size={18} />
        </button>
        <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded transition" title="Italic">
          <Italic size={18} />
        </button>
        <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded transition" title="Underline">
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded transition" title="Bullet List">
          <List size={18} />
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded transition" title="Numbered List">
          <ListOrdered size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Left">
          <AlignLeft size={18} />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Center">
          <AlignCenter size={18} />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Right">
          <AlignRight size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <select onChange={(e) => execCommand('fontSize', e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200 transition" defaultValue="3">
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
        <button type="button" onClick={() => execCommand('undo')} className="p-2 hover:bg-gray-200 rounded transition" title="Undo">
          <Undo size={18} />
        </button>
        <button type="button" onClick={() => execCommand('redo')} className="p-2 hover:bg-gray-200 rounded transition" title="Redo">
          <Redo size={18} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none bg-white"
        data-placeholder={placeholder}
        style={{ wordWrap: 'break-word' }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

const NewsManagement = () => {
  const { logout, isAuthenticated } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    newsImageFile: null,
    newsImagePreview: '',
    newsImageUrl: '',
    journalistImageFile: null,
    journalistImagePreview: '',
    journalistImageUrl: '',
    title: '',
    subtitle: '',
    content: '',
    publishedDate: '',
    journalistName: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingNews, setViewingNews] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [fetchingData, setFetchingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const newsFileRef = useRef(null);
  const journalistFileRef = useRef(null);

  useEffect(() => {
    fetchNews();
  }, []);

const fetchNews = async () => {
  try {
    setFetchingData(true);
    const response = await axiosInstance.get('/news');
    setNewsList(response.data);
  } catch (err) {
    showToast('Failed to load news', 'error');
    console.error(err);
  } finally {
    setFetchingData(false);
  }
};
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleFileSelect = (file, type) => {
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      if (type === 'news') {
        setFormData((prev) => ({
          ...prev,
          newsImageFile: file,
          newsImagePreview: preview,
          newsImageUrl: '',
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          journalistImageFile: file,
          journalistImagePreview: preview,
          journalistImageUrl: '',
        }));
      }
    } else {
      showToast('Please select a valid image file', 'error');
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file, type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

const handleSubmit = async () => {
  if (!isAuthenticated()) {
    showToast('Please login first', 'error');
    return;
  }

  // Validation: Check if at least title and image are provided
  if (!formData.title.trim()) {
    showToast('Please enter a title', 'error');
    return;
  }

  if (!formData.journalistName.trim()) {
    showToast('Please enter journalist name', 'error');
    return;
  }

  // For new articles, require an image
  if (!editingId && !formData.newsImageFile && !formData.newsImageUrl) {
    showToast('Please upload a news cover image', 'error');
    return;
  }

  setLoading(true);
  try {
    const formDataToSend = new FormData();
    
    // Add image file if uploaded
    if (formData.newsImageFile) {
      formDataToSend.append('image', formData.newsImageFile);
    }
    
    // Add image URL if provided (and no file uploaded)
    if (!formData.newsImageFile && formData.newsImageUrl) {
      formDataToSend.append('imageUrl', formData.newsImageUrl);
    }
    
    // Add journalist image file if uploaded
    if (formData.journalistImageFile) {
      formDataToSend.append('journalistImageFile', formData.journalistImageFile);
    }
    
    // Add journalist image URL if provided (and no file uploaded)
    if (!formData.journalistImageFile && formData.journalistImageUrl) {
      formDataToSend.append('journalistImageUrl', formData.journalistImageUrl);
    }

    // Add all text fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle || '');
    formDataToSend.append('paragraph', formData.content || '');
    formDataToSend.append('publishedDate', formData.publishedDate || new Date().toISOString());
    formDataToSend.append('journalistName', formData.journalistName || '');

    // Debug: Log what we're sending
    console.log('Submitting form data:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
    }

    if (editingId) {
      await axiosInstance.put(`/news/${editingId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('News updated successfully!');
    } else {
      await axiosInstance.post('/news', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('News created successfully!');
    }

    resetForm();
    setShowForm(false);
    setShowEditModal(false);
    fetchNews();
  } catch (err) {
    console.error('Submit error:', err);
    const message = err.response?.data?.message || err.message || 'Operation failed';
    showToast(message, 'error');
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (news) => {
      if (!isAuthenticated()) {
    showToast('Please login first', 'error');
    return;
   }
    setEditingId(news.id);
    setFormData({
      newsImageFile: null,
      newsImagePreview: news.image ? (news.image.startsWith('http') ? news.image : `http://localhost:5000${news.image}`) : '',
      newsImageUrl: news.image || '',
      journalistImageFile: null,
      journalistImagePreview: news.journalistImage ? (news.journalistImage.startsWith('http') ? news.journalistImage : `http://localhost:5000${news.journalistImage}`) : '',
      journalistImageUrl: news.journalistImage || '',
      title: news.title || '',
      subtitle: news.subtitle || '',
      content: news.paragraph || '',
      publishedDate: news.publishedDate
        ? new Date(news.publishedDate).toISOString().slice(0, 16)
        : '',
      journalistName: news.journalistName || '',
    });
    setShowEditModal(true);
    setViewingNews(null);
  };

const handleDelete = async (id) => {
  if (!isAuthenticated()) {
    showToast('Please login first', 'error');
    return;
  }

  if (!window.confirm('Are you sure you want to delete this news?')) return;

  try {
    setLoading(true);
    await axiosInstance.delete(`/news/${id}`);
    showToast('News deleted successfully!');
    setViewingNews(null);
    fetchNews();
  } catch (err) {
    showToast('Failed to delete news', 'error');
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      newsImageFile: null,
      newsImagePreview: '',
      newsImageUrl: '',
      journalistImageFile: null,
      journalistImagePreview: '',
      journalistImageUrl: '',
      title: '',
      subtitle: '',
      content: '',
      publishedDate: '',
      journalistName: '',
    });
    if (newsFileRef.current) newsFileRef.current.value = '';
    if (journalistFileRef.current) journalistFileRef.current.value = '';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInMs = now - publishedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'आज';
    if (diffInDays === 1) return '१ दिन अघि';
    return `${diffInDays} दिन अघि`;
  };

  // Pagination
  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = newsList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium`}>
          {toast.message}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800">Edit Article</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">News Cover Image</h3>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                        formData.newsImagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'news')}
                      onDragOver={handleDragOver}
                      onClick={() => newsFileRef.current?.click()}
                    >
                      {formData.newsImagePreview ? (
                        <img
                          src={formData.newsImagePreview}
                          alt="News preview"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center">
                          <Image className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Drop image or click to upload</p>
                        </div>
                      )}
                      <input
                        ref={newsFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files[0], 'news')}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="url"
                      name="newsImageUrl"
                      value={formData.newsImageUrl}
                      onChange={handleInputChange}
                      placeholder="Or paste image URL"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={!!formData.newsImageFile}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Journalist Photo</h3>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                        formData.journalistImagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'journalist')}
                      onDragOver={handleDragOver}
                      onClick={() => journalistFileRef.current?.click()}
                    >
                      {formData.journalistImagePreview ? (
                        <img
                          src={formData.journalistImagePreview}
                          alt="Journalist"
                          className="w-40 h-40 mx-auto rounded-full object-cover shadow-md border-4 border-gray-200"
                        />
                      ) : (
                        <div className="py-8 flex flex-col items-center justify-center">
                          <User className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Drop photo or click to upload</p>
                        </div>
                      )}
                      <input
                        ref={journalistFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files[0], 'journalist')}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="url"
                      name="journalistImageUrl"
                      value={formData.journalistImageUrl}
                      onChange={handleInputChange}
                      placeholder="Or paste photo URL"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={!!formData.journalistImageFile}
                    />
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Title</h3>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter news title..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-semibold"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Subtitle</h3>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Brief description..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Journalist Name</h3>
                      <input
                        type="text"
                        name="journalistName"
                        value={formData.journalistName}
                        onChange={handleInputChange}
                        placeholder="Author name..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Published Date</h3>
                      <input
                        type="datetime-local"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Article Content</h3>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Write your article content here... Use the toolbar to format text."
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save size={18} />
                      {loading ? 'Updating...' : 'Update Article'}
                    </button>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800">View Article Details</h2>
              <button
                onClick={() => setViewingNews(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">News Cover Image</h3>
                    {viewingNews.image ? (
                      <img
                        src={viewingNews.image.startsWith('http') ? viewingNews.image : `http://localhost:5000${viewingNews.image}`}
                        alt={viewingNews.title}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Journalist Photo</h3>
                    {viewingNews.journalistImage ? (
                      <img
                        src={viewingNews.journalistImage.startsWith('http') ? viewingNews.journalistImage : `http://localhost:5000${viewingNews.journalistImage}`}
                        alt={viewingNews.journalistName}
                        className="w-40 h-40 mx-auto rounded-full object-cover shadow-md border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Title</h3>
                    <p className="text-2xl font-bold text-gray-900">{viewingNews.title}</p>
                  </div>

                  {viewingNews.subtitle && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Subtitle</h3>
                      <p className="text-lg text-gray-700">{viewingNews.subtitle}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Journalist Name</h3>
                      <p className="text-gray-900 font-medium">{viewingNews.journalistName || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Published Date</h3>
                      <p className="text-gray-900 font-medium">
                        {new Date(viewingNews.publishedDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {viewingNews.paragraph && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-3">Article Content</h3>
                      <div 
                        className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200"
                        dangerouslySetInnerHTML={{ __html: viewingNews.paragraph }}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleEdit(viewingNews);
                        setViewingNews(null);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      Edit Article
                    </button>
                    <button
                      onClick={() => handleDelete(viewingNews.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
              <p className="text-gray-600 mt-1">Manage your news articles</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? 'Close' : 'Add News'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl mx-auto border">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">News Cover Image *</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                        formData.newsImagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'news')}
                      onDragOver={handleDragOver}
                      onClick={() => newsFileRef.current?.click()}
                    >
                      {formData.newsImagePreview ? (
                        <img
                          src={formData.newsImagePreview}
                          alt="News preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="py-12">
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-sm text-gray-600 mt-2">Drop image or click to upload</p>
                        </div>
                      )}
                      <input
                        ref={newsFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files[0], 'news')}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="url"
                      name="newsImageUrl"
                      value={formData.newsImageUrl}
                      onChange={handleInputChange}
                      placeholder="Or paste image URL"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={!!formData.newsImageFile}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Journalist Photo</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                        formData.journalistImagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'journalist')}
                      onDragOver={handleDragOver}
                      onClick={() => journalistFileRef.current?.click()}
                    >
                      {formData.journalistImagePreview ? (
                        <img
                          src={formData.journalistImagePreview}
                          alt="Journalist"
                          className="w-40 h-40 mx-auto rounded-full object-cover shadow-md border-4 border-gray-200"
                        />
                      ) : (
                        <div className="py-8">
                          <User className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-sm text-gray-600 mt-2">Drop photo or click to upload</p>
                        </div>
                      )}
                      <input
                        ref={journalistFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files[0], 'journalist')}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="url"
                      name="journalistImageUrl"
                      value={formData.journalistImageUrl}
                      onChange={handleInputChange}
                      placeholder="Or paste photo URL"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={!!formData.journalistImageFile}
                    />
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter news title..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Brief description..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Journalist Name</label>
                      <input
                        type="text"
                        name="journalistName"
                        value={formData.journalistName}
                        onChange={handleInputChange}
                        placeholder="Author name..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                      <input
                        type="datetime-local"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Article Content *</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Write your article content here... Use the toolbar to format text."
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      {loading ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                      className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {fetchingData && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news articles...</p>
          </div>
        )}

        {/* News List - Horizontal Cards */}
{!fetchingData && currentNews.length > 0 && (
  <div className="space-y-4">
    {currentNews.map((news) => (
      <article
        key={news.id}
        className="bg-white rounded-lg shadow hover:shadow-md transition-all border p-4"
      >
        {/* Desktop View - Full Horizontal Layout */}
        <div className="hidden xl:flex items-start gap-4">
          {/* Small Image */}
          <div className="w-24 h-24 flex-shrink-0">
            {news.image ? (
              <img
                src={`http://localhost:5000${news.image}`}
                alt={news.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <Image size={32} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>

          {/* Title */}
          <div className="flex-shrink-0 overflow-hidden" style={{ width: '200px' }}>
            <h3
              className="text-base font-bold text-gray-900 cursor-pointer hover:text-emerald-600 transition line-clamp-2"
              onClick={() => setViewingNews(news)}
            >
              {news.title}
            </h3>
          </div>

          {/* Divider */}
          <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>

          {/* Description */}
          <div className="flex-shrink-0 overflow-hidden" style={{ width: '500px' }}>
            {news.subtitle && (
              <p className="text-sm text-gray-600 line-clamp-2">{news.subtitle}</p>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>

          {/* Journalist Info */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '150px' }}>
            {news.journalistImage ? (
              <img
                src={`http://localhost:5000${news.journalistImage}`}
                alt={news.journalistName}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-400" />
              </div>
            )}
            <div className="min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{news.journalistName || 'Unknown'}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setViewingNews(news)}
              className="p-2 hover:bg-emerald-50 rounded-lg transition text-emerald-600"
              title="View"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(news)}
              className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(news.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Tablet View - Compact Horizontal Layout */}
        <div className="hidden md:xl:hidden md:block">
          <div className="flex items-start gap-3">
            {/* Image */}
            <div className="w-20 h-20 flex-shrink-0">
              {news.image ? (
                <img
                  src={`http://localhost:5000${news.image}`}
                  alt={news.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image size={24} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <h3
                className="text-base font-bold text-gray-900 cursor-pointer hover:text-emerald-600 transition line-clamp-2"
                onClick={() => setViewingNews(news)}
              >
                {news.title}
              </h3>
              {news.subtitle && (
                <p className="text-sm text-gray-600 line-clamp-2">{news.subtitle}</p>
              )}
              
              <div className="flex items-center justify-between pt-2">
                {/* Journalist Info */}
                <div className="flex items-center gap-2">
                  {news.journalistImage ? (
                    <img
                      src={`http://localhost:5000${news.journalistImage}`}
                      alt={news.journalistName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={14} className="text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900 truncate">{news.journalistName || 'Unknown'}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingNews(news)}
                    className="p-2 hover:bg-emerald-50 rounded-lg transition text-emerald-600"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(news)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Vertical Layout */}
        <div className="md:hidden space-y-3">
          {/* Image at Top */}
          <div className="w-full h-48">
            {news.image ? (
              <img
                src={`http://localhost:5000${news.image}`}
                alt={news.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <Image size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Horizontal Divider */}
          <div className="h-px bg-gray-300"></div>

          {/* Title */}
          <h3
            className="text-lg font-bold text-gray-900 cursor-pointer hover:text-emerald-600 transition"
            onClick={() => setViewingNews(news)}
          >
            {news.title}
          </h3>

          {/* Horizontal Divider */}
          <div className="h-px bg-gray-300"></div>

          {/* Description */}
          {news.subtitle && (
            <>
              <p className="text-sm text-gray-600">{news.subtitle}</p>
              {/* Horizontal Divider */}
              <div className="h-px bg-gray-300"></div>
            </>
          )}

          {/* Journalist Info */}
          <div className="flex items-center gap-3">
            {news.journalistImage ? (
              <img
                src={`http://localhost:5000${news.journalistImage}`}
                alt={news.journalistName}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={20} className="text-gray-400" />
              </div>
            )}
            <p className="text-sm font-medium text-gray-900">{news.journalistName || 'Unknown'}</p>
          </div>

          {/* Horizontal Divider */}
          <div className="h-px bg-gray-300"></div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setViewingNews(news)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition text-emerald-600 flex items-center gap-2"
            >
              <Eye size={18} />
              <span className="text-sm font-medium">View</span>
            </button>
            <button
              onClick={() => handleEdit(news)}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-blue-600 flex items-center gap-2"
            >
              <Edit size={18} />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button
              onClick={() => handleDelete(news.id)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition text-red-600 flex items-center gap-2"
            >
              <Trash2 size={18} />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </article>
    ))}
  </div>
)}
        {/* Empty State */}
        {!fetchingData && newsList.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <Type size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No news articles yet</h3>
            <p className="text-gray-500 mb-6">Create your first news article to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create First Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;