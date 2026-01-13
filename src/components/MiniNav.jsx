import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, X, ChevronDown, Home, Sparkles } from 'lucide-react';
import axiosInstance from '../api/axios';

// CACHE OUTSIDE COMPONENT - Persists across navigations
let cachedCategories = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function MiniNav() {
  const [categories, setCategories] = useState(cachedCategories || []);
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const moreDropdownRef = useRef(null);

  const PROTECTED_CATEGORIES = ['news', 'local', 'sports', 'society', 'more'];

  // Memoized filtered categories
  const mainCategories = useMemo(() =>
    categories.filter(cat =>
      PROTECTED_CATEGORIES.includes(cat.value) && cat.value !== 'more'
    ),
  [categories]);

  const additionalCategories = useMemo(() =>
    categories.filter(cat => !PROTECTED_CATEGORIES.includes(cat.value)),
  [categories]);

  const moreCategory = useMemo(() =>
    categories.find(cat => cat.value === 'more'),
  [categories]);

  const menuItems = useMemo(() => [
    { name: 'मुखपृष्ठ', path: '/', value: 'home', icon: Home },
    ...mainCategories.map(cat => ({
      name: cat.label,
      path: `/${cat.value}`,
      value: cat.value
    })),
    ...(moreCategory ? [{ name: moreCategory.label, path: '/more', value: 'more' }] : [])
  ], [mainCategories, moreCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const now = Date.now();
      if (cachedCategories && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('✅ Nav: Using cached categories');
        return;
      }

      try {
        console.log('🔄 Nav: Fetching categories');
        const response = await axiosInstance.get('/api/categories');
        const fetched = response.data.categories || [];

        cachedCategories = fetched;
        cacheTimestamp = Date.now();
        setCategories(fetched);
      } catch (error) {
        console.error('Error fetching categories:', error);

        const defaults = [
          { value: 'news', label: 'समाचार' },
          { value: 'local', label: 'स्थानीय' },
          { value: 'sports', label: 'खेलखबर' },
          { value: 'society', label: 'समाज' },
          { value: 'more', label: 'थप' }
        ];

        cachedCategories = defaults;
        cacheTimestamp = Date.now();
        setCategories(defaults);
      }
    };

    fetchCategories();

    // Set active category from URL
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      setActiveCategory('home');
    } else {
      const pathCategory = currentPath.split('/')[1];
      setActiveCategory(pathCategory || 'home');
    }

    // Throttled scroll handler
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    };
  }, []);

  // Click outside to close "थप" dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMoreOpen]);

  return (
    <div className={`sticky top-0 z-[100] transition-all duration-300 ${
      scrolled
        ? 'bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 shadow-2xl'
        : 'bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 shadow-md'
    } border-t border-blue-800/50 backdrop-blur-sm`}>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-75"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex py-4">
          <ul className="flex flex-row justify-center items-center gap-8 text-xl font-bold text-white w-full">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.value}
                  className="text-center relative group"
                  style={{ animation: `fadeInDown 0.5s ease-out ${index * 0.1}s both` }}
                >
                  <a
                    href={item.path}
                    onClick={() => setActiveCategory(item.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                      activeCategory === item.value
                        ? 'text-orange-300 bg-blue-800/50'
                        : 'text-white hover:text-orange-300'
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                    <span className="relative z-10">{item.name}</span>

                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-600/20 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {activeCategory === item.value && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-700 rounded-full shadow-lg shadow-red-500/50"></div>
                    )}
                  </a>

                  {activeCategory !== item.value && (
                    <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-orange-400 to-pink-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
                  )}
                </li>
              );
            })}

            {/* "थप" Dropdown - Desktop */}
            {additionalCategories.length > 0 && (
              <li className="text-center relative group" ref={moreDropdownRef}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg hover:text-orange-300 hover:bg-blue-800/50 transition-all duration-300 relative overflow-hidden"
                >
                  <Sparkles size={20} className="animate-pulse" />
                  <span>थप</span>
                  <ChevronDown
                    size={20}
                    className={`transition-all duration-300 ${isMoreOpen ? 'rotate-180 text-orange-300' : ''}`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {isMoreOpen && (
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl shadow-2xl border border-blue-700/50 min-w-[220px] py-2 backdrop-blur-md"
                    style={{ animation: 'dropdownSlide 0.3s ease-out' }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-900 rotate-45 border-l border-t border-blue-700/50"></div>

                    {additionalCategories.map((cat, index) => (
                      <a
                        key={cat.value}
                        href={`/${cat.value}`}
                        onClick={() => {
                          setIsMoreOpen(false);
                          setActiveCategory(cat.value);
                        }}
                        className="block px-6 py-3 text-lg hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-700 hover:text-orange-300 transition-all duration-200 relative group/item"
                        style={{ animation: `fadeInLeft 0.3s ease-out ${index * 0.05}s both` }}
                      >
                        <span className="relative z-10">{cat.label}</span>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-pink-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></div>
                      </a>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 text-white focus:outline-none w-full flex justify-end hover:text-orange-300 transition-colors duration-300 relative group"
            aria-label="Toggle menu"
          >
            <div className="relative">
              {isOpen ? (
                <X size={32} className="animate-spin-once" />
              ) : (
                <Menu size={32} className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          </button>

          {isOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-gradient-to-b from-blue-950 to-blue-900 border-t border-blue-800/50 z-50 shadow-2xl backdrop-blur-md"
              style={{ animation: 'slideDown 0.4s ease-out' }}
            >
              <ul className="flex flex-col items-center py-6 space-y-4 text-lg font-bold text-white">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.value}
                      className="w-full text-center px-4"
                      style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both` }}
                    >
                      <a
                        href={item.path}
                        onClick={() => {
                          setIsOpen(false);
                          setActiveCategory(item.value);
                        }}
                        className={`flex items-center justify-center gap-3 py-3 px-6 rounded-lg transition-all duration-300 ${
                          activeCategory === item.value
                            ? 'bg-gradient-to-r from-blue-800 to-blue-700 text-orange-300 shadow-lg'
                            : 'hover:bg-blue-800/50 hover:text-orange-300'
                        }`}
                      >
                        {Icon && <Icon size={20} />}
                        <span>{item.name}</span>
                      </a>
                    </li>
                  );
                })}

                {additionalCategories.length > 0 && (
                  <>
                    <li className="w-full text-center border-t border-blue-800/50 pt-6 mt-4">
                      <span className="text-orange-300 text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-2">
                        <Sparkles size={16} />
                        थप
                      </span>
                    </li>
                    {additionalCategories.map((cat, index) => (
                      <li
                        key={cat.value}
                        className="w-full text-center px-4"
                        style={{ animation: `fadeInUp 0.4s ease-out ${(menuItems.length + index) * 0.08}s both` }}
                      >
                        <a
                          href={`/${cat.value}`}
                          onClick={() => {
                            setIsOpen(false);
                            setActiveCategory(cat.value);
                          }}
                          className="block py-3 px-6 rounded-lg hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-700 hover:text-orange-300 transition-all duration-300 hover:shadow-lg"
                        >
                          {cat.label}
                        </a>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(180deg); }
        }
        .animate-spin-once {
          animation: spin-once 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MiniNav;