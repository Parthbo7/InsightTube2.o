import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, LayoutGrid } from 'lucide-react';

const filters = [
  'All Content',
  'Top Performers',
  'Underperforming',
  'Shorts',
  'Long-form',
  'High CTR',
  'Viral',
  'Trending',
  'AI Recommended',
];

const VideoFilterBar = ({ activeFilter, setActiveFilter }) => {
  const scrollRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3">
        {/* Scrollable filter pills */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 py-1"
        >
          {filters.map((filter, i) => {
            const isActive = activeFilter === filter;
            return (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white bg-white/60 dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] hover:border-[#FF1744]/20 dark:hover:border-[#FF3B3B]/20'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="filter-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-[#FF1744] to-[#E0002A] dark:from-[#FF3B3B] dark:to-[#FF1744] rounded-full shadow-[0_4px_20px_rgba(255,23,68,0.35)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </motion.button>
            );
          })}
        </div>

        {/* View controls */}
        <div className="flex items-center gap-1 bg-white/50 dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] rounded-xl p-1 shrink-0">
          <button className="p-2 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <SlidersHorizontal size={16} />
          </button>
          <button className="p-2 rounded-lg bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 text-[#FF1744] dark:text-[#FF3B3B] transition-colors">
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoFilterBar;
