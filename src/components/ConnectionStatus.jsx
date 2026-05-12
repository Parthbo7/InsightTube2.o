import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const { error } = await supabase.from('projects').select('id').limit(1);
      if (error) {
        console.error('Supabase connection error:', error.message);
        setStatus('failed');
      } else {
        console.log('Supabase Connected ✅');
        setStatus('connected');
      }
    } catch (err) {
      console.error('Supabase connection exception:', err);
      setStatus('failed');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#121218]/90 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg text-xs font-medium transition-all duration-300 hover:scale-105">
      {status === 'checking' && (
        <>
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          <span className="text-[#666666] dark:text-[#A1A1AA]">Checking...</span>
        </>
      )}
      {status === 'connected' && (
        <>
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-green-600 dark:text-green-400">Supabase Connected ✅</span>
        </>
      )}
      {status === 'failed' && (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-red-600 dark:text-red-400">Connection Failed ❌</span>
          <button 
            onClick={checkConnection}
            className="ml-2 px-2 py-0.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded text-[10px] uppercase font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
