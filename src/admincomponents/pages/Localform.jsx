import React, { useState, useRef } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Type, Save, X, Image, User
} from 'lucide-react';
import axiosInstance from '../../api/axios'; // ← Import your axios instance with auth interceptors
import { useAuth } from '../../context/AuthContext'; // ← Import auth context

// RichTextEditor component (kept as-is)
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  React.useEffect(() => {
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
        <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded transition" title="Bold">
          <Bold size={18} />
        </button>
        <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded transition" title="Italic">
          <Italic size={18} />
        </button>
        <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded transition" title="Underline">
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded transition" title="Bullet List">
          <List size={18} />
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded transition" title="Numbered List">
          <ListOrdered size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Left">
          <AlignLeft size={18} />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Center">
          <AlignCenter size={18} />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded transition" title="Align Right">
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

// Main Form Component
const Localform = ({ onSuccess, onCancel }) => {
  const { isAuthenticated } = useAuth(); // Get auth status

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

  const [loading, setLoading] = useState(false);
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
          newsImageUrl: '', // Clear URL if file selected
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

    // Check authentication
    if (!isAuthenticated()) {
      showToast('Please login to publish articles', 'error');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Images: prefer file upload over URL
      if (formData.newsImageFile) {
        formDataToSend.append('image', formData.newsImageFile);
      } else if (formData.newsImageUrl) {
        formDataToSend.append('imageUrl', formData.newsImageUrl); // optional: if backend supports
      }

      if (formData.journalistImageFile) {
        formDataToSend.append('journalistImage', formData.journalistImageFile);
      } else if (formData.journalistImageUrl) {
        formDataToSend.append('journalistImageUrl', formData.journalistImageUrl);
      }

      // Match field names with your backend (from LocalManagement)
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle || '');
      formDataToSend.append('paragraph', formData.content || ''); // ← Important: use 'paragraph'
      formDataToSend.append('journalistName', formData.journalistName || '');
      formDataToSend.append('publishedDate', formData.publishedDate || new Date().toISOString());

      // Send authenticated request
      const response = await axiosInstance.post('/local', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('Local news article published successfully!');
      resetForm();

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error publishing news:', error);
      const message = error.response?.data?.message || 'Failed to publish article';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          } text-white font-medium`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-emerald-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Type className="text-emerald-600" />
            Create New Local News Article
          </h2>

          <div className="space-y-8">
            {/* Images Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* News Cover Image */}
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
                  placeholder="Or paste image URL (optional)"
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  disabled={!!formData.newsImageFile}
                />
              </div>

              {/* Journalist Photo */}
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
                  placeholder="Or paste photo URL (optional)"
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

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Article Content *</label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your article content here... Use the toolbar to format text, add lists, and more."
              />
            </div>

            {/* Journalist & Date */}
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

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Publish Article'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition flex items-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Localform;