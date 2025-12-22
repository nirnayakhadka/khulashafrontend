import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
 
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalNews: 0,
    totalSports: 0,
    totalSociety: 0,
    totalLocal: 0
  });
  const [loading, setLoading] = useState(true);

  // API Base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // Use mock data if API fails
          setStats({
            totalNews: 156,
            totalSports: 89,
            totalSociety: 124,
            totalLocal: 67
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Use mock data on error
        setStats({
          totalNews: 156,
          totalSports: 89,
          totalSociety: 124,
          totalLocal: 67
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickStats = [
    {
      title: 'Total News Articles',
      value: stats.totalNews,
      change: '+12%',
      color: 'bg-blue-500',
      icon: '📰'
    },
    {
      title: 'Sports Articles',
      value: stats.totalSports,
      change: '+8%',
      color: 'bg-green-500',
      icon: '⚽'
    },
    {
      title: 'Society Articles',
      value: stats.totalSociety,
      change: '+15%',
      color: 'bg-purple-500',
      icon: '👥'
    },
    {
      title: 'Local News',
      value: stats.totalLocal,
      change: '+5%',
      color: 'bg-orange-500',
      icon: '📍'
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
      


     
      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
       
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions + Account Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/news')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Create News Article</span>
              </button>
              <button
                onClick={() => navigate('/admin/sports')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Sports Update</span>
              </button>
              <button
                onClick={() => navigate('/admin/society')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Post Society Content</span>
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
                  <span className="text-gray-900 font-medium text-sm">{user?.id}</span>
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
            {[
              { action: 'Created new article', category: 'News', time: '2 hours ago', color: 'bg-blue-100 text-blue-800' },
              { action: 'Updated sports content', category: 'Sports', time: '5 hours ago', color: 'bg-green-100 text-green-800' },
              { action: 'Published society post', category: 'Society', time: '1 day ago', color: 'bg-purple-100 text-purple-800' },
              { action: 'Added local news', category: 'Local', time: '2 days ago', color: 'bg-orange-100 text-orange-800' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                  {activity.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>

  );
};

export default Dashboard;