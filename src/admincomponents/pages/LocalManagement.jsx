import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save, X, Edit, Trash2, Image, User } from 'lucide-react';
import AdminNav from '../components/AdminNav';
// Mock API functions (replace with your actual API calls)
const API_BASE_URL = 'http://localhost:5000/api/local';

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
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${isFocused ? 'border-emerald-500 shadow-lg' : 'border-gray-300'}`}>

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

const LocalManagement = () => {
  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: 'Local Festival Draws Record Crowd',
      subtitle: 'Annual celebration brings community together',
      content: '<p>The <b>annual spring festival</b> attracted over <i>5,000 visitors</i> this weekend, making it the most successful event in the festival\'s 10-year history.</p>',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      journalistName: 'Sarah Johnson',
      journalistImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      publishedDate: new Date().toISOString(),
    },
  ]);
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (editingId) {
        setNewsList(prev => prev.map(news => 
          news.id === editingId 
            ? {
                ...news,
                ...formData,
                image: formData.newsImagePreview || formData.newsImageUrl,
                journalistImage: formData.journalistImagePreview || formData.journalistImageUrl,
              }
            : news
        ));
        showToast('Local news updated successfully!');
      } else {
        const newNews = {
          id: Date.now(),
          ...formData,
          image: formData.newsImagePreview || formData.newsImageUrl,
          journalistImage: formData.journalistImagePreview || formData.journalistImageUrl,
          publishedDate: formData.publishedDate || new Date().toISOString(),
        };
        setNewsList(prev => [newNews, ...prev]);
        showToast('Local news created successfully!');
      }
      
      resetForm();
      setShowForm(false);
      setLoading(false);
    }, 500);
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this local news?')) {
      setNewsList(prev => prev.filter(news => news.id !== id));
      showToast('Local news deleted successfully!');
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
   
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
  

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        } text-white font-medium`}>
          {toast.message}
        </div>
      )}
       
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-emerald-900 mb-2">Local News Management</h1>
              <p className="text-emerald-600 text-lg">Create and manage community stories with rich formatting</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
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
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border-t-4 border-emerald-500 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Type className="text-emerald-600" />
              {editingId ? 'Edit News Article' : 'Create New Article'}
            </h2>

            <div className="space-y-8">
              {/* Images Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* News Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Image size={18} className="text-emerald-600" />
                    News Cover Image
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      formData.newsImagePreview ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
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
                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                    disabled={!!formData.newsImageFile}
                  />
                </div>

                {/* Journalist Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User size={18} className="text-teal-600" />
                    Journalist Photo
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      formData.journalistImagePreview ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'
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
                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
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
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                  <input
                    type="datetime-local"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-t-4 border-emerald-400 group"
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
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition">
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
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-emerald-200"
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
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl transition font-medium flex items-center justify-center gap-2 shadow-md"
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

        {newsList.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Type size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No news articles yet</h3>
            <p className="text-gray-500 mb-6">Create your first local news article to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg inline-flex items-center gap-2"
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

export default LocalManagement;