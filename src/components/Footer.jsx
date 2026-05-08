import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-brand-red/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="text-xl font-extrabold text-brand-red tracking-tight">
            InsightTube AI
          </Link>
          <span className="text-sm text-gray-500">© 2026 InsightTube AI. Precision Analytics.</span>
        </div>

        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-gray-500 hover:text-brand-red transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-gray-500 hover:text-brand-red transition-colors">Terms of Service</a>
          <a href="#" className="text-sm text-gray-500 hover:text-brand-red transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
