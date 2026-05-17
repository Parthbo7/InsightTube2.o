import React from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Sparkles, LayoutGrid, List } from 'lucide-react';

const VideosHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black text-[#111111] dark:text-white tracking-tight mb-2"
          >
            Videos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-[#666666] dark:text-[#A1A1AA] max-w-xl leading-relaxed"
          >
            Analyze every video deeply with AI-powered performance intelligence and neural retention insights.
          </motion.p>
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
              placeholder="Search videos..."
              className="w-44 bg-black/5 dark:bg-white/5 border-none rounded-lg py-2 pl-9 pr-3 text-xs text-[#111] dark:text-white placeholder-[#999] dark:placeholder-[#666] focus:outline-none focus:ring-1 focus:ring-[#FF1744]/30"
            />
          </div>

          <div className="w-px h-6 bg-black/10 dark:bg-white/10" />

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#555] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
            <Upload size={14} className="group-hover:text-[#FF1744] transition-colors" />
            Upload New
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF1744] to-[#E0002A] text-white shadow-lg shadow-[#FF1744]/25 hover:shadow-[#FF1744]/40 hover:-translate-y-0.5 active:scale-95 transition-all relative overflow-hidden group">
            <Sparkles size={14} />
            Neural Analysis
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VideosHeader;
