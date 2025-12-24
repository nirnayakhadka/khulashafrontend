import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Newspaper, Users, Globe, MoreHorizontal, Trophy, MapPin, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMain: 0,
    totalNews: 0,
    totalSports: 0,
    totalSociety: 0,
    totalLocal: 0,
    totalMore: 0,
    totalArticles: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const categories = [
    { name: 'Main', endpoint: 'main', color: 'indigo', icon: Globe },
    { name: 'News', endpoint: 'news', color: 'blue', icon: Newspaper },
    { name: 'Sports', endpoint: 'sports', color: 'green', icon: Trophy },
    { name: 'Society', endpoint: 'society', color: 'purple', icon: Users },
    { name: 'Local', endpoint: 'local', color: 'emerald', icon: MapPin },
    { name: 'More', endpoint: 'more', color: 'pink', icon: MoreHorizontal }
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = categories.map(async (cat) => {
        const res = await fetch(`${API_URL}/${cat.endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          return { count: data.length, posts: data.map(post => ({ ...post, category: cat.name })) };
        } else {
          console.warn(`Failed to fetch ${cat.name} data`);
          return { count: 0, posts: [] };
        }
      });

      const results = await Promise.all(promises);
      const newStats = results.reduce((acc, { count }, idx) => {
        acc[`total${categories[idx].name}`] = count;
        return acc;
      }, {});
      newStats.totalArticles = Object.values(newStats).reduce((sum, val) => sum + val, 0);

      // Recent activities: combine all posts, sort by date, take top 5
      const allPosts = results.flatMap(res => res.posts);
      const sortedPosts = allPosts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
      setRecentActivities(sortedPosts.slice(0, 5));

      setStats(newStats);
    } catch (err) {
      setError('Failed to load dashboard data. Please try refreshing.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 60 seconds for real-time updates
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const quickStats = [
    ...categories.map(cat => ({
      title: `${cat.name} Articles`,
      value: stats[`total${cat.name}`],
      color: `bg-${cat.color}-500`,
      icon: <cat.icon className="w-6 h-6 text-white" />
    })),
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      color: 'bg-gray-500',
      icon: <Newspaper className="w-6 h-6 text-white" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl bg-red-600 text-white font-medium">
          {error}
        </div>
      )}

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions + Account Info + Refresh */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/news')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-medium">Manage News</span>
              </button>
              <button
                onClick={() => navigate('/admin/sports')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Manage Sports</span>
              </button>
              <button
                onClick={() => navigate('/admin/society')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Manage Society</span>
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Administrator
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">User ID:</span>
                  <span className="text-gray-900 font-medium text-sm">{user?.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Status:</span>
                  <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Last Login:</span>
                  <span className="text-gray-900 font-medium text-sm">Just now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Controls */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Real-Time Tracking</h2>
            <p className="text-gray-600 text-center mb-4">Data auto-refreshes every minute</p>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Now
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">New post in {activity.category}: "{activity.title}"</p>
                    <p className="text-gray-500 text-sm">{getTimeAgo(activity.publishedDate)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${categories.find(cat => cat.name === activity.category)?.color}-100 text-${categories.find(cat => cat.name === activity.category)?.color}-800`}>
                    {activity.category}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No recent activities</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;