import React from 'react';
import { motion } from 'framer-motion';

// Dummy data for global pulse pill grid
const generatePulseData = () => {
  const rows = 3;
  const cols = 8;
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      // 0: lowest (white/faded), 1: medium (light red), 2: high (dark red)
      const intensity = Math.random() > 0.7 ? 2 : Math.random() > 0.4 ? 1 : 0;
      row.push(intensity);
    }
    data.push(row);
  }
  return data;
};

const pulseData = generatePulseData();

const getPillColor = (intensity) => {
  if (intensity === 2) return 'bg-[#C10020] dark:bg-[#E0002A] shadow-[0_0_8px_rgba(255,23,68,0.4)] z-10';
  if (intensity === 1) return 'bg-[#FF1744]/40';
  return 'bg-[#FF1744]/10';
};

const AudienceHeatmap = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="bg-white/80 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-[24px] p-6 shadow-sm relative overflow-hidden h-full flex flex-col"
  >
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#FF1744]/10 rounded-full blur-[60px] pointer-events-none" />

    <div className="mb-6 relative z-10">
      <h2 className="text-xl font-bold text-[#111] dark:text-white mb-1">Global Pulse</h2>
      <div className="text-[10px] font-bold text-[#888] dark:text-[#A1A1AA] uppercase tracking-widest mt-1">Peak Viewing Times</div>
    </div>

    <div className="flex-1 flex flex-col justify-center gap-3 relative z-10">
      {pulseData.map((row, i) => (
        <div key={i} className="flex justify-between gap-2">
          {row.map((intensity, j) => (
            <motion.div
              key={j}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + (i * 0.1) + (j * 0.05) }}
              whileHover={{ scale: 1.2, zIndex: 20 }}
              className={`w-4 h-8 rounded-full cursor-pointer transition-colors duration-300 ${getPillColor(intensity)}`}
            />
          ))}
        </div>
      ))}
    </div>
    
    <div className="flex justify-between mt-6 pt-4 border-t border-black/5 dark:border-white/[0.06] relative z-10">
       <span className="text-[10px] font-bold text-[#888] dark:text-[#666]">12A</span>
       <span className="text-[10px] font-bold text-[#888] dark:text-[#666]">12P</span>
       <span className="text-[10px] font-bold text-[#888] dark:text-[#666]">11P</span>
    </div>
  </motion.div>
);

export default AudienceHeatmap;
