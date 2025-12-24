import React, { useState, useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Image, User, Eye, Plus, Calendar, Clock, ChevronLeft, ChevronRight,
  Save, X, Edit, Trash2, Type
} from 'lucide-react';

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
        <button type="button" onClick={() => execCommand('bold')} title="Bold">
          <Bold size={18} />
        </button>
        <button type="button" onClick={() => execCommand('italic')} title="Italic">
          <Italic size={18} />
        </button>
        <button type="button" onClick={() => execCommand('underline')} title="Underline">
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <List size={18} />
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <ListOrdered size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('justifyLeft')} title="Align Left">
          <AlignLeft size={18} />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} title="Align Center">
          <AlignCenter size={18} />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} title="Align Right">
          <AlignRight size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
        <button type="button" onClick={() => execCommand('undo')} title="Undo">
          <Undo size={18} />
        </button>
        <button type="button" onClick={() => execCommand('redo')} title="Redo">
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

const SocietyManagement = () => {
  const { logout, isAuthenticated } = useAuth();
  const [societyList, setSocietyList] = useState([]);
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingNews, setViewingNews] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [fetchingData, setFetchingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const imageFileRef = useRef(null);
  const journalistFileRef = useRef(null);

  useEffect(() => {
    fetchSociety();
  }, []);

const fetchSociety = async () => {
  try {
    setFetchingData(true);
    const response = await axiosInstance.get('/society');
    setSocietyList(response.data);
  } catch (err) {
    showToast('Failed to load society articles', 'error');
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

const handleSubmit = async () => {
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
    formDataToSend.append('publishedDate', formData.publishedDate || new Date().toISOString());
    formDataToSend.append('journalistName', formData.journalistName || '');

    if (editingId) {
      await axiosInstance.put(`/society/${editingId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Society article updated successfully!');
    } else {
      await axiosInstance.post('/society', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Society article created successfully!');
    }

    resetForm();
    setShowForm(false);
    setShowEditModal(false);
    fetchSociety();
  } catch (err) {
    console.error('Submit error:', err);
    const message = err.response?.data?.message || err.message || 'Operation failed';
    showToast(message, 'error');
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (society) => {
  if (!isAuthenticated()) {
    showToast('Please login first', 'error');
    return;
  }

    setEditingId(society.id);
    setFormData({
      imageFile: null,
      imagePreview: society.image ? `http://localhost:5000${society.image}` : '',
      journalistImageFile: null,
      journalistImagePreview: society.journalistImage ? `http://localhost:5000${society.journalistImage}` : '',
      title: society.title || '',
      subtitle: society.subtitle || '',
      paragraph: society.paragraph || '',
      publishedDate: society.publishedDate ? new Date(society.publishedDate).toISOString().slice(0, 16) : '',
      journalistName: society.journalistName || '',
    });
    setShowEditModal(true);
    setViewingNews(null);
  };

const handleDelete = async (id) => {
  if (!isAuthenticated()) {
    showToast('Please login first', 'error');
    return;
  }

  if (!window.confirm('Are you sure you want to delete this society article?')) return;

  try {
    setLoading(true);
    await axiosInstance.delete(`/society/${id}`);
    showToast('Society article deleted successfully!');
    setViewingNews(null);
    fetchSociety();
  } catch (err) {
    showToast('Failed to delete society article', 'error');
  } finally {
    setLoading(false);
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

  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInMs = now - published;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'आज';
    if (diffInDays === 1) return '१ दिन अघि';
    return `${diffInDays} दिन अघि`;
  };

  const totalPages = Math.ceil(societyList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSociety = societyList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
            toast.type === 'success' ? 'bg-purple-600' : 'bg-red-600'
          } text-white font-medium`}
        >
          {toast.message}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800">Edit Society Article</h2>
              <button onClick={() => { setShowEditModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Images */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Cover Image</h3>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                        formData.imagePreview ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'image')}
                      onDragOver={handleDragOver}
                      onClick={() => imageFileRef.current?.click()}
                    >
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center">
                          <Image size={48} className="text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600">Drop or click to upload</p>
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

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Journalist Photo</h3>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                        formData.journalistImagePreview ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'journalist')}
                      onDragOver={handleDragOver}
                      onClick={() => journalistFileRef.current?.click()}
                    >
                      {formData.journalistImagePreview ? (
                        <img
                          src={formData.journalistImagePreview}
                          alt="Journalist"
                          className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-gray-200"
                        />
                      ) : (
                        <div className="py-10 flex flex-col items-center justify-center">
                          <User size={48} className="text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600">Drop or click to upload</p>
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

                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter article title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Journalist Name</label>
                      <input
                        type="text"
                        name="journalistName"
                        value={formData.journalistName}
                        onChange={handleInputChange}
                        placeholder="Author name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                      <input
                        type="datetime-local"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                    <RichTextEditor
                      value={formData.paragraph}
                      onChange={handleParagraphChange}
                      placeholder="Write your article here..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Update Article'}
                    </button>
                    <button
                      onClick={() => { setShowEditModal(false); resetForm(); }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800">View Society Article</h2>
              <button onClick={() => setViewingNews(null)} className="p-2 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-8">
                  {viewingNews.image && (
                    <img
                      src={`http://localhost:5000${viewingNews.image}`}
                      alt={viewingNews.title}
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  )}
                  {viewingNews.journalistImage && (
                    <img
                      src={`http://localhost:5000${viewingNews.journalistImage}`}
                      alt={viewingNews.journalistName}
                      className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-gray-200 shadow"
                    />
                  )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">{viewingNews.title}</h1>
                  {viewingNews.subtitle && <p className="text-xl text-gray-700">{viewingNews.subtitle}</p>}

                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(viewingNews.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{getTimeAgo(viewingNews.publishedDate)}</span>
                    </div>
                  </div>

                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: viewingNews.paragraph }} />

                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => { handleEdit(viewingNews); setViewingNews(null); }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(viewingNews.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Society Management</h1>
              <p className="text-gray-600">Manage society news articles</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? 'Close Form' : 'Add New Article'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-xl border mb-10">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Create New Society Article</h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="p-2 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Images */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                        formData.imagePreview ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'image')}
                      onDragOver={handleDragOver}
                      onClick={() => imageFileRef.current?.click()}
                    >
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center">
                          <Image size={48} className="text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600">Drop or click to upload</p>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Journalist Photo</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                        formData.journalistImagePreview ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      onDrop={(e) => handleDrop(e, 'journalist')}
                      onDragOver={handleDragOver}
                      onClick={() => journalistFileRef.current?.click()}
                    >
                      {formData.journalistImagePreview ? (
                        <img
                          src={formData.journalistImagePreview}
                          alt="Journalist"
                          className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-gray-200"
                        />
                      ) : (
                        <div className="py-10 flex flex-col items-center justify-center">
                          <User size={48} className="text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600">Drop or click to upload</p>
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

                {/* Fields */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter article title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Journalist Name</label>
                      <input
                        type="text"
                        name="journalistName"
                        value={formData.journalistName}
                        onChange={handleInputChange}
                        placeholder="Author name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                      <input
                        type="datetime-local"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                    <RichTextEditor
                      value={formData.paragraph}
                      onChange={handleParagraphChange}
                      placeholder="Write your article here..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Publish Article'}
                    </button>
                    <button
                      onClick={() => { resetForm(); setShowForm(false); }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {fetchingData && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading articles...</p>
          </div>
        )}

        {/* Articles List - Responsive Card Format */}
        {!fetchingData && currentSociety.length > 0 && (
          <div className="space-y-4">
            {currentSociety.map((society) => (
              <article
                key={society.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-all border p-4"
              >
                {/* Desktop View - Full Horizontal Layout (xl and above) */}
                <div className="hidden xl:flex items-start gap-4">
                  {/* Small Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    {society.image ? (
                      <img
                        src={`http://localhost:5000${society.image}`}
                        alt={society.title}
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
                      onClick={() => setViewingNews(society)}
                    >
                      {society.title}
                    </h3>
                  </div>
                  {/* Divider */}
                  <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>
                  {/* Description */}
                  <div className="flex-shrink-0 overflow-hidden" style={{ width: '500px' }}>
                    {society.subtitle && (
                      <p className="text-sm text-gray-600 line-clamp-2">{society.subtitle}</p>
                    )}
                  </div>
                  {/* Divider */}
                  <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>
                  {/* Journalist Info */}
                  <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '150px' }}>
                    {society.journalistImage ? (
                      <img
                        src={`http://localhost:5000${society.journalistImage}`}
                        alt={society.journalistName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{society.journalistName || 'Unknown'}</p>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="w-px h-20 bg-gray-300 flex-shrink-0"></div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setViewingNews(society)}
                      className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(society)}
                      className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(society.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Tablet View - Compact Horizontal Layout (md to xl) */}
                <div className="hidden md:block xl:hidden">
                  <div className="flex items-start gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      {society.image ? (
                        <img
                          src={`http://localhost:5000${society.image}`}
                          alt={society.title}
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
                        className="text-base font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition line-clamp-2"
                        onClick={() => setViewingNews(society)}
                      >
                        {society.title}
                      </h3>
                      {society.subtitle && (
                        <p className="text-sm text-gray-600 line-clamp-2">{society.subtitle}</p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        {/* Journalist Info */}
                        <div className="flex items-center gap-2">
                          {society.journalistImage ? (
                            <img
                              src={`http://localhost:5000${society.journalistImage}`}
                              alt={society.journalistName}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User size={14} className="text-gray-400" />
                            </div>
                          )}
                          <p className="text-sm font-medium text-gray-900 truncate">{society.journalistName || 'Unknown'}</p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingNews(society)}
                            className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(society)}
                            className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(society.id)}
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
                    {society.image ? (
                      <img
                        src={`http://localhost:5000${society.image}`}
                        alt={society.title}
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
                    className="text-lg font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition"
                    onClick={() => setViewingNews(society)}
                  >
                    {society.title}
                  </h3>
                  {/* Horizontal Divider */}
                  <div className="h-px bg-gray-300"></div>
                  {/* Description */}
                  {society.subtitle && (
                    <>
                      <p className="text-sm text-gray-600">{society.subtitle}</p>
                      {/* Horizontal Divider */}
                      <div className="h-px bg-gray-300"></div>
                    </>
                  )}
                  {/* Journalist Info */}
                  <div className="flex items-center gap-3">
                    {society.journalistImage ? (
                      <img
                        src={`http://localhost:5000${society.journalistImage}`}
                        alt={society.journalistName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={20} className="text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-900">{society.journalistName || 'Unknown'}</p>
                  </div>
                  {/* Horizontal Divider */}
                  <div className="h-px bg-gray-300"></div>
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setViewingNews(society)}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-purple-600 flex items-center gap-2"
                    >
                      <Eye size={18} />
                      <span className="text-sm font-medium">View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(society)}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-purple-600 flex items-center gap-2"
                    >
                      <Edit size={18} />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(society.id)}
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

        {/* Pagination */}
        {!fetchingData && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'border hover:bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Empty State */}
        {!fetchingData && societyList.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <Type size={80} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No articles yet</h3>
            <p className="text-gray-500 mb-8">Start by creating your first society article</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create First Article
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SocietyManagement;