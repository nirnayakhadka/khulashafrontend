import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save, X, Edit, Trash2, Image, User, FileText, Eye } from 'lucide-react';
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
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${isFocused ? 'border-purple-500 shadow-lg' : 'border-gray-300'}`}>
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded transition" title="Bold">
          <Bold size={18} />
        </button>
        <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded transition" title="Italic">
          <Italic size={18} />
        </button>
        <button onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded transition" title="Underline">
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded transition" title="Bullet List">
          <List size={18} />
        </button>
        <button onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded transition" title="Numbered List">
          <ListOrdered size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Left">
          <AlignLeft size={18} />
        </button>
        <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Center">
          <AlignCenter size={18} />
        </button>
        <button onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Right">
          <AlignRight size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
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
        <button onClick={() => execCommand('undo')} className="p-2 hover:bg-gray-200 rounded transition" title="Undo">
          <Undo size={18} />
        </button>
        <button onClick={() => execCommand('redo')} className="p-2 hover:bg-gray-200 rounded transition" title="Redo">
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

const MoreManagement = () => {
  const { logout, isAuthenticated } = useAuth();
  const [articlesList, setArticlesList] = useState([]);
  const [formData, setFormData] = useState({
    imageFile: null,
    imagePreview: '',
    journalistImageFile: null,
    journalistImagePreview: '',
    title: '',
    subtitle: '',
    paragraph: '',
    publishedDate: '',
    journalistName: '',
  });
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const imageFileRef = useRef(null);
  const journalistFileRef = useRef(null);

  useEffect(() => {
    fetchArticles();
  }, []);

const fetchArticles = async () => {
  try {
    const response = await axiosInstance.get('/more');
    setArticlesList(response.data);
  } catch (error) {
    showToast('Error fetching articles', 'error');
    console.error('Fetch error:', error);
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

  const handleParagraphChange = (content) => {
    setFormData((prev) => ({ ...prev, paragraph: content }));
  };

  const handleFileSelect = (file, type) => {
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      if (type === 'article') {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: preview,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          journalistImageFile: file,
          journalistImagePreview: preview,
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

  if (!isAuthenticated()) {
    showToast('Please login first', 'error');
    return;
  }

  // Validation
  if (!formData.title.trim()) {
    showToast('Please enter a title', 'error');
    return;
  }

  if (!formData.journalistName.trim()) {
    showToast('Please enter journalist name', 'error');
    return;
  }

  if (!editingId && !formData.imageFile) {
    showToast('Please upload a cover image', 'error');
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();
    
    if (formData.imageFile) formDataToSend.append('image', formData.imageFile);
    if (formData.journalistImageFile) formDataToSend.append('journalistImage', formData.journalistImageFile);
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle || '');
    formDataToSend.append('paragraph', formData.paragraph || '');
    formDataToSend.append('journalistName', formData.journalistName || '');
    formDataToSend.append('publishedDate', formData.publishedDate || new Date().toISOString());

    if (editingId) {
      await axiosInstance.put(`/more/${editingId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Article updated successfully!');
    } else {
      await axiosInstance.post('/more', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Article created successfully!');
    }

    await fetchArticles();
    resetForm();
    setShowForm(false);
  } catch (error) {
    console.error('Submit error:', error);
    const message = error.response?.data?.message || error.message || 'Error saving article';
    showToast(message, 'error');
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (article) => {
      if (!isAuthenticated()) {
        showToast('Please login first', 'error');
        return;
      }
    setEditingId(article.id);
    setFormData({
      imageFile: null,
      imagePreview: article.image ? `http://localhost:5000${article.image}` : '',
      journalistImageFile: null,
      journalistImagePreview: article.journalistImage ? `http://localhost:5000${article.journalistImage}` : '',
      title: article.title || '',
      subtitle: article.subtitle || '',
      paragraph: article.paragraph || '',
      publishedDate: article.publishedDate
        ? new Date(article.publishedDate).toISOString().slice(0, 16)
        : '',
      journalistName: article.journalistName || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleDelete = async (id) => {
  if (!isAuthenticated()) {
    showToast('Please login first', 'error');
    return;
  }

  if (window.confirm('Are you sure you want to delete this article?')) {
    try {
      await axiosInstance.delete(`/more/${id}`);
      showToast('Article deleted successfully!');
      await fetchArticles();
    } catch (error) {
      console.error('Delete error:', error);
      const message = error.response?.data?.message || error.message || 'Error deleting article';
      showToast(message, 'error');
    }
  }
};

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      imageFile: null,
      imagePreview: '',
      journalistImageFile: null,
      journalistImagePreview: '',
      title: '',
      subtitle: '',
      paragraph: '',
      publishedDate: '',
      journalistName: '',
    });
    if (imageFileRef.current) imageFileRef.current.value = '';
    if (journalistFileRef.current) journalistFileRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
            toast.type === 'success' ? 'bg-purple-500' : 'bg-red-500'
          } text-white font-medium`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-purple-900 mb-2">More Articles Management</h1>
              <p className="text-purple-600 text-lg">Create and manage featured stories with rich formatting</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              {showForm ? <X size={20} /> : <FileText size={20} />}
              {showForm ? 'Close Form' : 'Create Article'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border-t-4 border-purple-500 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Type className="text-purple-600" />
              {editingId ? 'Edit Article' : 'Create New Article'}
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Image size={18} className="text-purple-600" />
                    Article Cover Image *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      formData.imagePreview ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                    onDrop={(e) => handleDrop(e, 'article')}
                    onDragOver={handleDragOver}
                    onClick={() => imageFileRef.current?.click()}
                  >
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="Article preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="space-y-2">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Drop image or click to upload</p>
                      </div>
                    )}
                    <input
                      ref={imageFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files[0], 'article')}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User size={18} className="text-pink-600" />
                    Journalist Photo
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      formData.journalistImagePreview ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
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
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter article title..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Content *</label>
                <RichTextEditor
                  value={formData.paragraph}
                  onChange={handleParagraphChange}
                  placeholder="Write your article content here... Use the toolbar to format text, add lists, and more."
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Journalist Name *</label>
                  <input
                    type="text"
                    name="journalistName"
                    value={formData.journalistName}
                    onChange={handleInputChange}
                    placeholder="Author name..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                  <input
                    type="datetime-local"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
                </button>
                <button
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
          </div>
        )}

        {/* Responsive Article Cards */}
        {articlesList.length > 0 ? (
          <div className="space-y-4">
            {articlesList.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-all border p-4"
              >
                {/* Desktop View - Full Horizontal Layout */}
                <div className="hidden xl:flex items-start gap-4">
                  {/* Small Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    {article.image ? (
                      <img
                        src={`http://localhost:5000${article.image}`}
                        alt={article.title}
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
                      className="text-base font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition line-clamp-2"
                      onClick={() => alert('View not implemented yet')} // You can add view modal later
                    >
                      {article.title}
                    </h3>
                  </div>
                  {/* Divider */}
                  <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>
                  {/* Description */}
                  <div className="flex-shrink-0 overflow-hidden" style={{ width: '500px' }}>
                    {article.subtitle && (
                      <p className="text-sm text-gray-600 line-clamp-2">{article.subtitle}</p>
                    )}
                  </div>
                  {/* Divider */}
                  <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>
                  {/* Journalist Info */}
                  <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '150px' }}>
                    {article.journalistImage ? (
                      <img
                        src={`http://localhost:5000${article.journalistImage}`}
                        alt={article.journalistName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{article.journalistName || 'Unknown'}</p>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => alert('View not implemented yet')} // Add view modal if needed
                      className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Tablet View - Compact Horizontal */}
                <div className="hidden md:block xl:hidden">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-20 flex-shrink-0">
                      {article.image ? (
                        <img
                          src={`http://localhost:5000${article.image}`}
                          alt={article.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3
                        className="text-base font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition line-clamp-2"
                        onClick={() => alert('View not implemented yet')}
                      >
                        {article.title}
                      </h3>
                      {article.subtitle && (
                        <p className="text-sm text-gray-600 line-clamp-2">{article.subtitle}</p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {article.journalistImage ? (
                            <img
                              src={`http://localhost:5000${article.journalistImage}`}
                              alt={article.journalistName}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User size={14} className="text-gray-400" />
                            </div>
                          )}
                          <p className="text-sm font-medium text-gray-900 truncate">{article.journalistName || 'Unknown'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => alert('View not implemented yet')}
                            className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
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
                  <div className="w-full h-48">
                    {article.image ? (
                      <img
                        src={`http://localhost:5000${article.image}`}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="h-px bg-gray-300"></div>
                  <h3
                    className="text-lg font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition"
                    onClick={() => alert('View not implemented yet')}
                  >
                    {article.title}
                  </h3>
                  <div className="h-px bg-gray-300"></div>
                  {article.subtitle && (
                    <>
                      <p className="text-sm text-gray-600">{article.subtitle}</p>
                      <div className="h-px bg-gray-300"></div>
                    </>
                  )}
                  <div className="flex items-center gap-3">
                    {article.journalistImage ? (
                      <img
                        src={`http://localhost:5000${article.journalistImage}`}
                        alt={article.journalistName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={20} className="text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-900">{article.journalistName || 'Unknown'}</p>
                  </div>
                  <div className="h-px bg-gray-300"></div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => alert('View not implemented yet')}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-purple-600 flex items-center gap-2"
                    >
                      <Eye size={18} />
                      <span className="text-sm font-medium">View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-purple-600 flex items-center gap-2"
                    >
                      <Edit size={18} />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
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
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <FileText size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No articles yet</h3>
            <p className="text-gray-500 mb-6">Create your first article to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg inline-flex items-center gap-2"
            >
              <FileText size={20} />
              Create First Article
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MoreManagement;