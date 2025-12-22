import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save, X, Edit, Trash2, Image, User } from 'lucide-react';
import AdminNav from '../components/AdminNav';
const API_BASE_URL = 'http://localhost:5000/api/news';

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
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Underline"
        >
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200 transition"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
        <button
          type="button"
          onClick={() => execCommand('undo')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('redo')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Redo"
        >
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
        style={{
          wordWrap: 'break-word',
        }}
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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const newsFileRef = useRef(null);
  const journalistFileRef = useRef(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setNewsList(response.data);
    } catch (err) {
      showToast('Failed to load news', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle || '');
      data.append('content', formData.content || '');
      data.append('publishedDate', formData.publishedDate || new Date().toISOString());
      data.append('journalistName', formData.journalistName || '');

      if (formData.newsImageFile) {
        data.append('image', formData.newsImageFile);
      } else if (formData.newsImageUrl) {
        data.append('imageUrl', formData.newsImageUrl);
      }

      if (formData.journalistImageFile) {
        data.append('journalistImageFile', formData.journalistImageFile);
      } else if (formData.journalistImageUrl) {
        data.append('journalistImageUrl', formData.journalistImageUrl);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, data, config);
        showToast('News updated successfully!');
      } else {
        await axios.post(API_BASE_URL, data, config);
        showToast('News created successfully!');
      }

      resetForm();
      setShowForm(false);
      fetchNews();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (news) => {
    setEditingId(news.id);
    setFormData({
      newsImageFile: null,
      newsImagePreview: news.image || '',
      newsImageUrl: news.image || '',
      journalistImageFile: null,
      journalistImagePreview: news.journalistImage || '',
      journalistImageUrl: news.journalistImage || '',
      title: news.title || '',
      subtitle: news.subtitle || '',
      content: news.content || '',
      publishedDate: news.publishedDate
        ? new Date(news.publishedDate).toISOString().slice(0, 16)
        : '',
      journalistName: news.journalistName || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/${id}`);
      showToast('News deleted successfully!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-blue-500' : 'bg-red-500'
        } text-white font-medium`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 mb-2">News Management</h1>
              <p className="text-blue-600 text-lg">Create and manage news articles with rich formatting</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              {showForm ? <X size={20} /> : <Save size={20} />}
              {showForm ? 'Close Form' : 'Create News'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border-t-4 border-blue-500 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Type className="text-blue-600" />
              {editingId ? 'Edit News Article' : 'Create New Article'}
            </h2>

            <div className="space-y-8">
              {/* Images Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* News Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Image size={18} className="text-blue-600" />
                    News Cover Image
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      formData.newsImagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onDrop={(e) => handleDrop(e, 'news')}
                    onDragOver={handleDragOver}
                    onClick={() => newsFileRef.current?.click()}
                  >
                    {formData.newsImagePreview ? (
                      <img
                        src={formData.newsImagePreview}
                        alt="News preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="space-y-2">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
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
                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={!!formData.newsImageFile}
                  />
                </div>

                {/* Journalist Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User size={18} className="text-indigo-600" />
                    Journalist Photo
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      formData.journalistImagePreview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                    onDrop={(e) => handleDrop(e, 'journalist')}
                    onDragOver={handleDragOver}
                    onClick={() => journalistFileRef.current?.click()}
                  >
                    {formData.journalistImagePreview ? (
                      <img
                        src={formData.journalistImagePreview}
                        alt="Journalist"
                        className="w-32 h-32 mx-auto rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="space-y-2">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
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
                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    disabled={!!formData.journalistImageFile}
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter news title..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Rich Text Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Content *</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article content here... Use the toolbar to format text, add lists, and more."
                />
              </div>

              {/* Author & Date */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Journalist Name</label>
                  <input
                    type="text"
                    name="journalistName"
                    value={formData.journalistName}
                    onChange={handleInputChange}
                    placeholder="Author name..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                  <input
                    type="datetime-local"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition flex items-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* News Grid */}
        {loading && !newsList.length ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Type size={64} className="mx-auto animate-pulse" />
            </div>
            <p className="text-xl text-gray-600">Loading news...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-400 group"
              >
                {news.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                    {news.title}
                  </h3>
                  {news.subtitle && (
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{news.subtitle}</p>
                  )}
                  {news.content && (
                    <div 
                      className="text-gray-700 text-sm mb-4 line-clamp-3" 
                      dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                  )}
                  <div className="flex items-center text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                    {news.journalistImage && (
                      <img
                        src={news.journalistImage}
                        alt={news.journalistName}
                        className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-200"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-700">{news.journalistName || 'Unknown'}</p>
                      <p className="text-xs">{new Date(news.publishedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(news)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition font-medium flex items-center justify-center gap-2 shadow-md"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition font-medium flex items-center justify-center gap-2 shadow-md"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {newsList.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Type size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No news articles yet</h3>
            <p className="text-gray-500 mb-6">Create your first news article to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg inline-flex items-center gap-2"
            >
              <Save size={20} />
              Create First Article
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      </div>
 
  );
};

export default NewsManagement;