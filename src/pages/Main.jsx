// Main.jsx - WITH CACHING
import React, { useState, useEffect } from 'react';
import NewsHome from './NewsHome';
import MoreHome from './MoreHome';
import SocietyHome from './SocietyHome';
import LocalHome from './LocalHome';
import SportsHome from './SportsHome';
import MainHome from './MainHome';
import axiosInstance from '../api/axios';

// ✅ CACHE OUTSIDE COMPONENT (persists between renders)
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

function Main() {
  const [sections, setSections] = useState(cachedData); // Start with cached data
  const [loading, setLoading] = useState(!cachedData); // No loading if cached

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        // Check if cache is still valid
        const now = Date.now();
        if (cachedData && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
          console.log('✅ Using cached data');
          return; // Use existing cache
        }

        console.log('🔄 Fetching fresh data');
        const response = await axiosInstance.get('/news/homepage');
        
        // Update cache
        cachedData = response.data;
        cacheTimestamp = Date.now();
        
        setSections(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomepage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-2">
      <MainHome news={sections?.main || []} />
      <NewsHome news={sections?.news || []} />
      <SocietyHome news={sections?.society || []} />
      <LocalHome news={sections?.local || []} />
      <SportsHome news={sections?.sports || []} />
      <MoreHome news={sections?.more || []} />
    </div>
  );
}

export default Main;