import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideosHeader from '../components/videos/VideosHeader';
import VideoFilterBar from '../components/videos/VideoFilterBar';
import VideoGrid from '../components/videos/VideoGrid';
import AIInsightPanel from '../components/videos/AIInsightPanel';

const Videos = () => {
  const [activeFilter, setActiveFilter] = useState('All Content');

  return (
    <div className="max-w-[1400px] mx-auto space-y-0 pb-20 relative">
      {/* Floating ambient particles - dark mode only */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              width: i % 2 === 0 ? '3px' : '2px',
              height: i % 2 === 0 ? '3px' : '2px',
              background: i % 3 === 0
                ? 'rgba(255,23,68,0.4)'
                : 'rgba(255,255,255,0.15)',
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.15, 0.6, 0.15],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.6,
            }}
          />
        ))}

        {/* Ambient glow orbs */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-[#FF1744]/[0.04]"
          style={{ top: '20%', right: '5%' }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full blur-[100px] bg-[#FF3B3B]/[0.03]"
          style={{ bottom: '10%', left: '10%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative z-10">
        <VideosHeader />
        <VideoFilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <VideoGrid activeFilter={activeFilter} />
        <AIInsightPanel />
      </div>
    </div>
  );
};

export default Videos;
