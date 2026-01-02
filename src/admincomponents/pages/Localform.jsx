import React, { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Type, Save, X, Image, Calendar, FileText, CheckCircle, Upload, Tag
} from 'lucide-react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ============================================
// RICH TEXT EDITOR
// ============================================
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
    <div className={`border-2 rounded-lg overflow-hidden transition-all ${
      isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'
    }`}>
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded" title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded" title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-white rounded" title="Underline">
          <Underline size={16} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded" title="Bullet List">
          <List size={16} />
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-white rounded" title="Numbered List">
          <ListOrdered size={16} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white rounded" title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-white rounded" title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-white rounded" title="Align Right">
          <AlignRight size={16} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-white"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-4 min-h-[250px] max-h-[500px] overflow-y-auto focus:outline-none bg-white"
        data-placeholder={placeholder}
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

// ============================================
// PROGRESS STEPS
// ============================================
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Basic Info', icon: FileText },
    { number: 2, label: 'Images', icon: Image },
    { number: 3, label: 'Content', icon: Type },
    { number: 4, label: 'Category', icon: Tag }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle size={24} />
                ) : (
                  <step.icon size={24} />
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 transition-all ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN DYNAMIC FORM COMPONENT
// ============================================
const UnifiedNewsForm = ({ 
  onSuccess, 
  onCancel,
  preselectedCategory = null,  // NEW: Pre-select a category
  categoryLocked = false,      // NEW: Lock category selection
  initialData = null           // NEW: For edit mode
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // STATE: Dynamic categories from backend
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // STATE: Form data
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: preselectedCategory || initialData?.category || '',
    newsImageFile: null,
    newsImagePreview: initialData?.image || '',
    newsImageUrl: initialData?.image || '',
    journalistImageFile: null,
    journalistImagePreview: initialData?.journalistImage || '',
    journalistImageUrl: initialData?.journalistImage || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    content: initialData?.paragraph || '',
    publishedDate: initialData?.publishedDate 
      ? new Date(initialData.publishedDate).toISOString().slice(0, 16) 
      : '',
    journalistName: initialData?.journalistName || '',
    isFeatured: initialData?.isFeatured || false,
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Drag state
  const [newsDragOver, setNewsDragOver] = useState(false);
  const [journalistDragOver, setJournalistDragOver] = useState(false);

  const newsFileRef = useRef(null);
  const journalistFileRef = useRef(null);

  // ============================================
  // FETCH CATEGORIES FROM BACKEND
  // ============================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/news/categories');
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('Failed to load categories', 'error');
        // Fallback to hardcoded categories if API fails
        setCategories([
          { value: 'news', label: 'समाचार (News)', icon: '📰', color: 'blue' },
          { value: 'local', label: 'स्थानीय (Local)', icon: '🏘️', color: 'green' },
          { value: 'society', label: 'समाज (Society)', icon: '👥', color: 'purple' },
          { value: 'sports', label: 'खेलकुद (Sports)', icon: '⚽', color: 'orange' },
          { value: 'more', label: 'थप (More)', icon: '📌', color: 'pink' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const getFormTitle = () => {
    if (initialData) return 'Edit Article';
    if (!preselectedCategory) return 'Create News Article';
    const cat = categories.find(c => c.value === preselectedCategory);
    return `Create ${cat?.label || 'Article'}`;
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'border-blue-500 bg-blue-50 ring-blue-200',
      green: 'border-green-500 bg-green-50 ring-green-200',
      purple: 'border-purple-500 bg-purple-50 ring-purple-200',
      orange: 'border-orange-500 bg-orange-50 ring-orange-200',
      pink: 'border-pink-500 bg-pink-50 ring-pink-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleFileSelect = (file, type) => {
    if (!file) return;
    if (file.type.startsWith('image/')) {
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
    type === 'news' ? setNewsDragOver(false) : setJournalistDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file, type);
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    type === 'news' ? setNewsDragOver(true) : setJournalistDragOver(true);
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    type === 'news' ? setNewsDragOver(false) : setJournalistDragOver(false);
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if (currentStep === 3 && !formData.content.trim().replace(/<[^>]*>/g, '').trim()) {
      showToast('Please write the article content', 'error');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      showToast('Please select a category', 'error');
      return;
    }

    if (!isAuthenticated()) {
      showToast('Please login to publish articles', 'error');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      if (formData.newsImageFile) {
        formDataToSend.append('image', formData.newsImageFile);
      } else if (formData.newsImageUrl) {
        formDataToSend.append('imageUrl', formData.newsImageUrl);
      }

      if (formData.journalistImageFile) {
        formDataToSend.append('journalistImage', formData.journalistImageFile);
      } else if (formData.journalistImageUrl) {
        formDataToSend.append('journalistImageUrl', formData.journalistImageUrl);
      }

      formDataToSend.append('category', formData.category);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle || '');
      formDataToSend.append('paragraph', formData.content || '');
      formDataToSend.append('journalistName', formData.journalistName || '');
      formDataToSend.append('publishedDate', formData.publishedDate || new Date().toISOString());
      formDataToSend.append('isFeatured', formData.isFeatured);

      const endpoint = initialData ? `/news/${initialData.id}` : '/news';
      const method = initialData ? 'put' : 'post';

      const response = await axiosInstance[method](endpoint, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const categoryLabel = categories.find(c => c.value === formData.category)?.label || formData.category;
      showToast(`Article ${initialData ? 'updated' : 'published'} successfully in ${categoryLabel}!`);

      // DYNAMIC NAVIGATION: Navigate to the category's admin page
      setTimeout(() => {
        navigate(`/admin/${formData.category}`);
      }, 1000);

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error('Error saving article:', error);
      const message = error.response?.data?.message || 'Failed to save article';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white font-medium`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{getFormTitle()}</h1>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            {categoryLocked && preselectedCategory 
              ? `Publishing to: ${categories.find(c => c.value === preselectedCategory)?.label}`
              : 'Fill in the details below to publish your article'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <ProgressSteps currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  Basic Information
                </h2>
                <p className="text-sm text-gray-600 mb-6">Enter the title and subtitle of your article</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling title for your article..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Add a brief description or summary..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Journalist/Author Name
                  </label>
                  <input
                    type="text"
                    name="journalistName"
                    value={formData.journalistName}
                    onChange={handleInputChange}
                    placeholder="Enter author's name..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Published Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Images */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Image className="text-blue-600" size={24} />
                  Images
                </h2>
                <p className="text-sm text-gray-600 mb-6">Upload cover image and journalist photo</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Cover Image
                  </label>
                  <div
                    onClick={() => newsFileRef.current?.click()}
                    onDrop={(e) => handleDrop(e, 'news')}
                    onDragOver={(e) => handleDragOver(e, 'news')}
                    onDragLeave={(e) => handleDragLeave(e, 'news')}
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all relative ${
                      newsDragOver 
                        ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-200' 
                        : formData.newsImagePreview 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                  >
                    {formData.newsImagePreview ? (
                      <img
                        src={formData.newsImagePreview}
                        alt="Cover preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                        <Upload size={48} className="mb-4" />
                        <p className="text-lg font-medium">Drop image here or click to upload</p>
                        <p className="text-sm mt-2">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    {newsDragOver && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <p className="text-2xl font-bold text-blue-700">Drop to upload</p>
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

                  <p className="text-xs text-gray-500 mt-3 text-center">Or paste image URL below</p>
                  <input
                    type="url"
                    name="newsImageUrl"
                    value={formData.newsImageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!formData.newsImageFile}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                {/* Journalist Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Journalist Photo (Optional)
                  </label>
                  <div
                    onClick={() => journalistFileRef.current?.click()}
                    onDrop={(e) => handleDrop(e, 'journalist')}
                    onDragOver={(e) => handleDragOver(e, 'journalist')}
                    onDragLeave={(e) => handleDragLeave(e, 'journalist')}
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all relative ${
                      journalistDragOver 
                        ? 'border-green-500 bg-green-50 ring-4 ring-green-200' 
                        : formData.journalistImagePreview 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                    }`}
                  >
                    {formData.journalistImagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={formData.journalistImagePreview}
                          alt="Journalist"
                          className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                        <Upload size={48} className="mb-4" />
                        <p className="text-lg font-medium">Drop photo here or click to upload</p>
                        <p className="text-sm mt-2">Square photo recommended</p>
                      </div>
                    )}
                    {journalistDragOver && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <p className="text-2xl font-bold text-green-700">Drop to upload</p>
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

                  <p className="text-xs text-gray-500 mt-3 text-center">Or paste photo URL below</p>
                  <input
                    type="url"
                    name="journalistImageUrl"
                    value={formData.journalistImageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/photo.jpg"
                    disabled={!!formData.journalistImageFile}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Content */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Type className="text-blue-600" size={24} />
                  Article Content
                </h2>
                <p className="text-sm text-gray-600 mb-6">Write your article content using the rich text editor</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article content here. Use the toolbar above to format your text..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Category Selection */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Tag className="text-blue-600" size={24} />
                  Select Category
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  {categoryLocked 
                    ? 'Category has been pre-selected for this section' 
                    : 'Choose where this article should be published'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Choose Category <span className="text-red-500">*</span>
                </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => !categoryLocked && setFormData(prev => ({ ...prev, category: category.value }))}
                disabled={categoryLocked && category.value !== formData.category}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                  formData.category === category.value
                    ? `${getColorClass(category.color)} shadow-lg ring-2`
                    : categoryLocked
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span className="text-3xl mb-2">{category.icon}</span>
                <p className="font-semibold text-gray-900">{category.label}</p>
                {formData.category === category.value && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-lg">
                    <CheckCircle size={20} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {formData.category && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm font-medium text-gray-700">
                <strong>Selected Category:</strong>{' '}
                <span className="text-blue-700">
                  {categories.find(c => c.value === formData.category)?.icon}{' '}
                  {categories.find(c => c.value === formData.category)?.label}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Back
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.category}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Publishing...' : initialData ? 'Update Article' : 'Publish Article'}
          </button>
        )}
      </div>
    </div>
   </div>