import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlowBackground from '../components/GlowBackground';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <GlowBackground />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
