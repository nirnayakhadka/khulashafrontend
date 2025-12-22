// src/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';
import MiniNav from '../components/MiniNav';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <>
      <Nav />
      <MiniNav />
      <main className="min-h-screen bg-gray-100">
        <Outlet />
        <Footer />
      </main>
    </>
  );
};

export default PublicLayout;