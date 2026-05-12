import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { openAuthModal } = useAuth();

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 transition-all duration-500 ${isScrolled ? 'top-2' : 'top-4'}`}>
      <div className="nav-blur glass-card px-6 h-16 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-brand-red tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2">
          InsightTube
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group"
              >
                <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-brand-red' : 'text-[#555555] dark:text-gray-400 group-hover:text-[#111111] dark:group-hover:text-white'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-brand-red/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-brand-red/5 transition-colors text-[#555555] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white overflow-hidden"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <button onClick={openAuthModal} className="hidden sm:block text-sm font-semibold text-[#555555] hover:text-[#111111] dark:text-gray-400 dark:hover:text-white px-4 py-2 transition-colors cursor-pointer">
            Sign In
          </button>
          
          <button onClick={openAuthModal} className="btn-primary text-sm !px-5 !py-2 cursor-pointer">
            Get Started
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[#555555] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-brand-red/5 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -20, scaleY: 0.9 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-20 left-0 w-full glass-card p-4 flex flex-col gap-2 origin-top"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-colors font-medium ${
                  location.pathname === link.path ? 'bg-brand-red/10 text-brand-red' : 'text-[#555555] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-brand-red/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-black/5 dark:border-white/10 my-2" />
            <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal(); }} className="w-full text-left px-4 py-3 text-[#555555] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-brand-red/5 rounded-xl font-medium cursor-pointer">Sign In</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
