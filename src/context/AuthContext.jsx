import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching session:", error);
        setLoading(false); // Prevents the blank screen issue
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  const login = (userData) => {
    // This function is kept for backward compatibility if needed locally,
    // but actual state is managed by Supabase onAuthStateChange
    setUser(userData);
    closeAuthModal();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isModalOpen, openAuthModal, closeAuthModal, user, login, logout, loading }}>
      {loading ? (
        <div className="fixed inset-0 bg-[#F8F9FA] dark:bg-[#0B0B0F] z-[9999] flex flex-col items-center justify-center transition-colors duration-500">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF1744]/10 dark:bg-[#FF1744]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[150px]" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative flex justify-center items-center">
              <div className="absolute w-24 h-24 border-4 border-[#FF1744]/20 border-t-[#FF1744] rounded-full animate-spin"></div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111111] to-[#333333] border-2 border-white dark:border-[#1A1A24] shadow-xl flex items-center justify-center">
                <span className="text-xl font-black text-white tracking-tighter">IT</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#111111] dark:text-white tracking-tight animate-pulse">
                InsightTube
              </h2>
              <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-2 tracking-widest uppercase font-semibold">
                Initializing Session...
              </p>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
