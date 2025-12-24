import React, { useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  // Mock user 
  const user = { email: 'admin' };

  const handleLogout = useCallback(() => {
    // TODO: real logout logic (clear token, redirect, etc.)
    alert('Logging out...');
    navigate('/login');
  }, [navigate]);

  const toggleMenu = useCallback((menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  }, []);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const menuItems = useMemo(
    () => [
      {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        subItems: [],
      },
      {
        name: 'News',
        path: '/admin/news',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
        subItems: [
          { name: 'View All', path: '/admin/news' },
          { name: 'Add New', path: '/admin/news/add' },
        ],
      },
      {
        name: 'Sports',
        path: '/admin/sports',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        subItems: [
          { name: 'View All', path: '/admin/sports' },
          { name: 'Add New', path: '/admin/sports/add' },
        ],
      },
      {
        name: 'Society',
        path: '/admin/society',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        subItems: [
          { name: 'View All', path: '/admin/society' },
          { name: 'Add New', path: '/admin/society/add' },
        ],
      },
      {
        name: 'Local',
        path: '/admin/local',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        subItems: [
          { name: 'View All', path: '/admin/local' },
          { name: 'Add New', path: '/admin/local/add' },
        ],
      },
      {
        name: 'Main',
        path: '/admin/main',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        ),
        subItems: [
          { name: 'View All', path: '/admin/main' },
          { name: 'Add New', path: '/admin/main/add' },
        ],
      },
      {
        name: 'More',
        path: '/admin/more',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        ),
        subItems: [
          { name: 'View All', path: '/admin/more' },
          { name: 'Add New', path: '/admin/more/add' },
        ],
      },
    ],
    []
  );

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const renderMenuItem = useCallback(
    (item, isMobile = false) => {
      const hasSubItems = item.subItems?.length > 0;
      const isExpanded = expandedMenus[item.name];

      return (
        <div key={item.path} className="relative">
          {/* Main item button */}
          <button
            onClick={() => (hasSubItems ? toggleMenu(item.name) : handleNavigation(item.path))}
            className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-white/20 backdrop-blur-sm shadow-lg border border-white/30 bg-gradient-to-r from-blue-400/30 to-purple-400/30'
                : 'hover:bg-white/10 hover:shadow-md hover:translate-x-1'
            }`}
            title={item.name}
          >
            <div className="flex-shrink-0 p-2 rounded-lg group-hover:bg-white/20 transition-colors">{item.icon}</div>

            {(!isCollapsed || isMobile) && (
              <>
                <span className="font-medium text-sm tracking-wide whitespace-nowrap flex-1 text-left">{item.name}</span>
                {hasSubItems && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </>
            )}
          </button>

          {/* Sub-items */}
          {hasSubItems && (!isCollapsed || isMobile) && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="ml-6 space-y-1 border-l-2 border-white/20 pl-4">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.path}
                    onClick={() => handleNavigation(subItem.path)}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      isActive(subItem.path)
                        ? 'bg-white/15 text-white shadow-md border border-white/20'
                        : 'text-purple-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <span className="font-medium">{subItem.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    },
    [expandedMenus, isCollapsed, location.pathname, toggleMenu, handleNavigation]
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-purple-700 via-indigo-800 to-purple-900 text-white shadow-2xl backdrop-blur-sm border-r border-white/10 transform transition-all duration-300 ease-in-out hidden md:block ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-white/10">
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto p-2 rounded-lg hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'}
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 h-[calc(100vh-128px)] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</div>
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-purple-900/50 to-transparent backdrop-blur-sm">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center font-bold shadow-lg ring-2 ring-white/30">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.email || 'Admin'}</p>
                  <p className="text-xs text-purple-200">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 mb-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center font-bold shadow-lg ring-2 ring-white/30">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 rounded-xl transition-all shadow-lg hover:shadow-xl border border-white/20"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-40 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-2xl border border-white/20 md:hidden transition-all duration-200 hover:scale-110"
        title="Open Menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-purple-700 via-indigo-800 to-purple-900 text-white shadow-2xl backdrop-blur-sm border-r border-white/10 md:hidden transform transition-transform duration-300 ease-in-out">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Admin Panel
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <div className="space-y-1">{menuItems.map((item) => renderMenuItem(item, true))}</div>
            </nav>

            {/* Mobile User & Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-purple-900/50 to-transparent backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center font-bold shadow-lg ring-2 ring-white/30">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.email || 'Admin'}</p>
                  <p className="text-xs text-purple-200">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </aside>
        </>
      )}
    
    </>
  );
};

export default AdminNav;