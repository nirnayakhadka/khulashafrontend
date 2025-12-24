import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save, X, Image, User } from 'lucide-react';

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

const Moreform = ({ onSuccess, onCancel }) => {
  const { isAuthenticated } = useAuth();
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
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const imageFileRef = useRef(null);
  const journalistFileRef = useRef(null);

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

// Replace the entire handleSubmit function with this:
const handleSubmit = async (e) => {
  e.preventDefault();

  // Add authentication check
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

  if (!formData.imageFile) {
    showToast('Please upload a cover image', 'error');
    return;
  }

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
    formDataToSend.append('subtitle', formData.subtitle || '');
    formDataToSend.append('paragraph', formData.paragraph || '');
    formDataToSend.append('journalistName', formData.journalistName || '');
    formDataToSend.append('publishedDate', formData.publishedDate || new Date().toISOString());

    await axiosInstance.post('/more', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    showToast('Article created successfully!');
    resetForm();
    
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.error('Submit error:', err);
    const message = err.response?.data?.message || err.message || 'Error saving article';
    showToast(message, 'error');
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-purple-500' : 'bg-red-500'
        } text-white font-medium`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-purple-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Type className="text-purple-600" />
            Create New Article
          </h2>

          <div className="space-y-8">
            {/* Images Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Article Image */}
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

              {/* Journalist Image */}
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

            {/* Rich Text Content Editor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Article Content *</label>
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
        </div>
      </div>
    </div>
  );
};

export default Moreform;