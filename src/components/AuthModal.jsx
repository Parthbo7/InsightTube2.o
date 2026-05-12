import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { loginUser, signupUser } from '../lib/supabase';

const AuthModal = () => {
  const { isModalOpen, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = form.name?.value;

    try {
      if (activeTab === 'signup') {
        const user = await signupUser(name, email, password);
        // Supabase may require email confirmation — handle that case
        if (user && !user.confirmed_at && user.identities?.length === 0) {
          toast.success('Check your email to confirm your account!');
          setIsLoading(false);
          return;
        }
        toast.success('Account created! Welcome aboard!');
      } else {
        await loginUser(email, password);
        toast.success('Welcome back!');
      }

      closeAuthModal();
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
          onClick={closeAuthModal}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-md bg-white/80 dark:bg-[#0B0B0F]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-black/5 dark:border-white/10">
            <h2 className="text-xl font-bold text-[#111111] dark:text-white">
              Welcome to InsightTube
            </h2>
            <button 
              onClick={closeAuthModal}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl mb-8 relative">
              {['signin', 'signup'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg relative z-10 transition-colors ${activeTab === tab ? 'text-[#111111] dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white'}`}
                >
                  {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute inset-0 bg-white dark:bg-[#1A1A24] rounded-lg shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activeTab === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative group">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                      <input 
                        name="name" 
                        required 
                        type="text"
                        placeholder="Full Name" 
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                <input 
                  name="email" 
                  required 
                  type="email"
                  placeholder="Email Address" 
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
                />
              </div>

              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                <input 
                  name="password" 
                  required 
                  type="password"
                  placeholder="Password" 
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
                />
              </div>

              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full mt-6 bg-brand-red hover:bg-[#E0002A] text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    {activeTab === 'signin' ? 'Continue' : 'Create Account'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to our <a href="#" className="underline hover:text-brand-red">Terms of Service</a> and <a href="#" className="underline hover:text-brand-red">Privacy Policy</a>.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
