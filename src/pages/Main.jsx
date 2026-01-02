// Main.jsx
import React, { useState, useEffect } from 'react';
import NewsHome from './NewsHome';
import MoreHome from './MoreHome';
import SocietyHome from './SocietyHome';
import LocalHome from './LocalHome';
import SportsHome from './SportsHome';
import MainHome from './MainHome';
import axiosInstance from '../api/axios';

function Main() {
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        // Single call - gets all sections with no duplicates
        const response = await axiosInstance.get('/news/homepage');
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
    return <div className="text-center py-20">Loading...</div>;
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