import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Download, Sparkles, Bell } from 'lucide-react';

const AnalyticsHeader = () => {
  const [dateRange, setDateRange] = useState('Last 28 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const ranges = ['Last 7 Days', 'Last 28 Days', 'Last 90 Days', 'Last Year'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#111111] dark:text-white tracking-tight mb-2">
            Analytics
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] max-w-xl leading-relaxed">
            Track growth, decode patterns, and outperform competitors with AI-driven insights.
          </p>
        </div>

        {/* Controls toolbar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 bg-white/60 dark:bg-[#111827]/60 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl px-4 py-2.5 shadow-sm"
        >
          <div className="relative group">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] dark:text-[#666] group-focus-within:text-[#FF1744]" />
            <input
              type="text"
              placeholder="Search Insights..."
              className="w-40 bg-black/5 dark:bg-white/5 border-none rounded-lg py-2 pl-9 pr-3 text-xs text-[#111] dark:text-white placeholder-[#999] dark:placeholder-[#666] focus:outline-none focus:ring-1 focus:ring-[#FF1744]/30"
            />
          </div>

          <div className="w-px h-6 bg-black/10 dark:bg-white/10" />

          {/* Date Range */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#555] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Calendar size={14} className="text-[#FF1744]" />
              {dateRange}
            </button>
            {showDateDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-1 bg-white dark:bg-[#1A1F2E] border border-black/10 dark:border-white/10 rounded-xl shadow-xl z-50 min-w-[160px] py-1 overflow-hidden"
              >
                {ranges.map(r => (
                  <button
                    key={r}
                    onClick={() => { setDateRange(r); setShowDateDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${r === dateRange ? 'bg-[#FF1744]/10 text-[#FF1744]' : 'text-[#555] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/5'}`}
                  >
                    {r}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#555] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Download size={14} />
            Export
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF1744] to-[#E0002A] text-white shadow-lg shadow-[#FF1744]/25 hover:shadow-[#FF1744]/40 hover:-translate-y-0.5 active:scale-95 transition-all">
            <Sparkles size={14} />
            AI Insights
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsHeader;
