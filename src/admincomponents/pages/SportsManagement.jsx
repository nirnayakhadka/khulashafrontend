import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save, X, Edit, Trash2, Image, User } from 'lucide-react';
import AdminNav from '../components/AdminNav';

const API_BASE_URL = 'http://localhost:5000/api/sports';

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

const SportsManagement = () => {
  const [sportsList, setSportsList] = useState([]);
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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fetch all sports articles
  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      const data = await response.json();
      setSportsList(data);
    } catch (error) {
      showToast('Error fetching sports articles', 'error');
      console.error('Error:', error);
    }
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
      if (type === 'image') {
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
      formDataToSend.append('publishedDate', formData.publishedDate || new Date().toISOString());
      formDataToSend.append('journalistName', formData.journalistName);

      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to save sports article');
      }

      showToast(editingId ? 'Sports article updated successfully!' : 'Sports article created successfully!');
      fetchSports();
      resetForm();
      setShowForm(false);
    } catch (error) {
      showToast('Error saving sports article', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (sports) => {
    setEditingId(sports.id);
    setFormData({
      imageFile: null,
      imagePreview: sports.image ? `http://localhost:5000${sports.image}` : '',
      journalistImageFile: null,
      journalistImagePreview: sports.journalistImage ? `http://localhost:5000${sports.journalistImage}` : '',
      title: sports.title || '',
      subtitle: sports.subtitle || '',
      paragraph: sports.paragraph || '',
      publishedDate: sports.publishedDate
        ? new Date(sports.publishedDate).toISOString().slice(0, 16)
        : '',
      journalistName: sports.journalistName || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sports article?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete sports article');
        }

        showToast('Sports article deleted successfully!');
        fetchSports();
      } catch (error) {
        showToast('Error deleting sports article', 'error');
        console.error('Error:', error);
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
                <h1 className="text-4xl font-bold text-blue-900 mb-2">Sports News Management</h1>
                <p className="text-blue-600 text-lg">Create and manage sports stories with rich formatting</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                {showForm ? <X size={20} /> : <Save size={20} />}
                {showForm ? 'Close Form' : 'Create Article'}
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
                {editingId ? 'Edit Sports Article' : 'Create New Article'}
              </h2>

              <div className="space-y-8">
                {/* Images Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Article Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Image size={18} className="text-blue-600" />
                      Article Cover Image *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        formData.imagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onDrop={(e) => handleDrop(e, 'image')}
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
                        onChange={(e) => handleFileSelect(e.target.files[0], 'image')}
                        className="hidden"
                      />
                    </div>
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
                      placeholder="Enter article title..."
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

                {/* Rich Text Paragraph Editor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Article Content</label>
                  <RichTextEditor
                    value={formData.paragraph}
                    onChange={handleParagraphChange}
                    placeholder="Write your article content here... Use the toolbar to format text, add lists, and more."
                  />
                </div>

                {/* Author & Date */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Journalist Name *</label>
                    <input
                      type="text"
                      name="journalistName"
                      value={formData.journalistName}
                      onChange={handleInputChange}
                      required
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

          {/* Sports Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportsList.map((sports) => (
              <div
                key={sports.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-400 group"
              >
                {sports.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:5000${sports.image}`}
                      alt={sports.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                    {sports.title}
                  </h3>
                  {sports.subtitle && (
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{sports.subtitle}</p>
                  )}
                  {sports.paragraph && (
                    <div 
                      className="text-gray-700 text-sm mb-4 line-clamp-3" 
                      dangerouslySetInnerHTML={{ __html: sports.paragraph }}
                    />
                  )}
                  <div className="flex items-center text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                    {sports.journalistImage && (
                      <img
                        src={`http://localhost:5000${sports.journalistImage}`}
                        alt={sports.journalistName}
                        className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-200"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-700">{sports.journalistName || 'Unknown'}</p>
                      <p className="text-xs">{new Date(sports.publishedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(sports)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition font-medium flex items-center justify-center gap-2 shadow-md"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sports.id)}
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

          {sportsList.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Type size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No sports articles yet</h3>
              <p className="text-gray-500 mb-6">Create your first sports article to get started</p>
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

export default SportsManagement;