import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save, X, Edit, Trash2, Image, User, FileText } from 'lucide-react';
import AdminNav from '../components/AdminNav';

const API_BASE_URL = 'http://localhost:5000/api/more';

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
        <button
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Underline"
        >
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          onClick={() => execCommand('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => execCommand('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button
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
          onClick={() => execCommand('undo')}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
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

const MoreManagement = () => {
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
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setArticlesList(data);
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
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }
      if (formData.journalistImageFile) {
        formDataToSend.append('journalistImage', formData.journalistImageFile);
      }
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('paragraph', formData.paragraph);
      formDataToSend.append('journalistName', formData.journalistName);
      
      if (formData.publishedDate) {
        formDataToSend.append('publishedDate', formData.publishedDate);
      }

      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      showToast(editingId ? 'Article updated successfully!' : 'Article created successfully!');
      await fetchArticles();
      resetForm();
      setShowForm(false);
    } catch (error) {
      showToast(error.message || 'Error saving article', 'error');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
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
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete article');
        }

        showToast('Article deleted successfully!');
        await fetchArticles();
      } catch (error) {
        showToast(error.message || 'Error deleting article', 'error');
        console.error('Delete error:', error);
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

      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-purple-500' : 'bg-red-500'
        } text-white font-medium`}>
          {toast.message}
        </div>
      )}
       
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesList.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-400 group"
            >
              {article.image && (
                <div className="relative overflow-hidden">
                  <img
                    src={`http://localhost:5000${article.image}`}
                    alt={article.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                  {article.title}
                </h3>
                {article.subtitle && (
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">{article.subtitle}</p>
                )}
                {article.paragraph && (
                  <div 
                    className="text-gray-700 text-sm mb-4 line-clamp-3" 
                    dangerouslySetInnerHTML={{ __html: article.paragraph }}
                  />
                )}
                <div className="flex items-center text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                  {article.journalistImage && (
                    <img
                      src={`http://localhost:5000${article.journalistImage}`}
                      alt={article.journalistName}
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-purple-200"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-700">{article.journalistName || 'Unknown'}</p>
                    <p className="text-xs">{new Date(article.publishedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(article)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl transition font-medium flex items-center justify-center gap-2 shadow-md"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
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

        {articlesList.length === 0 && (
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

export default MoreManagement;