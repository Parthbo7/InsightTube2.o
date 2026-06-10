import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ChevronDown, CalendarDays } from 'lucide-react';

const AudienceHeader = () => {
  const [period, setPeriod] = useState('Standard');

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
    >
      {/* Title */}
      <div>
        <h1 className="text-4xl font-black text-[#111] dark:text-white tracking-tight leading-tight">
          Audience <br />
          <span className="text-[#FF1744] dark:text-[#FF3B3B] italic">Intelligence</span>
        </h1>
        <p className="text-sm text-[#888] dark:text-[#666] mt-3 max-w-lg leading-relaxed">
          Understand your viewers deeply with AI-powered demographic, behavioral, and sentiment intelligence.
        </p>
      </div>

      {/* Controls toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        
        {/* Toggle standard/lifetime */}
        <div className="flex items-center bg-white/40 dark:bg-[#121218]/40 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-xl p-1 shadow-sm">
           <button 
             onClick={() => setPeriod('Standard')}
             className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'Standard' ? 'bg-white dark:bg-[#2A2A35] shadow-sm text-[#111] dark:text-white' : 'text-[#666] dark:text-[#999] hover:text-[#111] dark:hover:text-white'}`}
           >
             Standard
           </button>
           <button 
             onClick={() => setPeriod('Lifetime')}
             className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 'Lifetime' ? 'bg-white dark:bg-[#2A2A35] shadow-sm text-[#111] dark:text-white' : 'text-[#666] dark:text-[#999] hover:text-[#111] dark:hover:text-white'}`}
           >
             Lifetime
           </button>
        </div>

        {/* Date period picker */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 dark:bg-[#121218]/40 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] shadow-sm text-[#111] dark:text-white hover:bg-white dark:hover:bg-[#1A1A24] transition-all">
          <CalendarDays size={14} className="text-[#888] dark:text-[#A1A1AA]" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold text-[#888] dark:text-[#666] uppercase">May 1 - May 31</span>
            <span className="text-xs font-bold">Last 30 Days</span>
          </div>
        </button>

        {/* AI Assistant CTA */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(255,23,68,0.35)' }}
          whileTap={{ scale: 0.97 }}
          className="relative flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#FF1744] to-[#E0002A] text-white shadow-lg shadow-[#FF1744]/20 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/10 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          <Sparkles size={14} />
          AI Assistant
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AudienceHeader;
