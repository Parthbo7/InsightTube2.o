import React from 'react';
import { motion } from 'framer-motion';

const retentionBars = [
  { val1: 45, val2: 60, val3: 75, val4: 88 },
  { val1: 40, val2: 55, val3: 70, val4: 92 },
  { val1: 35, val2: 50, val3: 65, val4: 85 },
  { val1: 50, val2: 65, val3: 80, val4: 98 },
  { val1: 45, val2: 60, val3: 75, val4: 88 },
  { val1: 48, val2: 63, val3: 78, val4: 95 },
];

const RetentionLoyalty = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white/80 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-[24px] p-6 shadow-sm relative overflow-hidden"
  >
    <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-[#FF1744]/10 dark:bg-[#FF1744]/8 rounded-full blur-[80px] pointer-events-none" />

    <div className="flex items-start justify-between mb-8 relative z-10">
      <div>
        <h2 className="text-xl font-bold text-[#111] dark:text-white mb-1">Retention & Loyalty</h2>
        <p className="text-[11px] text-[#888] dark:text-[#666] max-w-[180px] leading-relaxed">Tracking viewer return rates over a 90-day cycle.</p>
      </div>
      <div className="text-right">
        <div className="text-4xl font-black text-[#FF1744]">88.4</div>
        <div className="text-[8px] font-bold text-[#888] dark:text-[#A1A1AA] uppercase tracking-widest mt-1">Loyalty Score</div>
      </div>
    </div>

    {/* Layered Bar Chart Visual */}
    <div className="h-[140px] flex items-end gap-3 md:gap-6 relative z-10 mt-6">
      {retentionBars.map((col, i) => (
        <div key={i} className="flex-1 flex justify-center h-full relative items-end group cursor-crosshair">
          {/* Base Lightest */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${col.val4}%` }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
            className="absolute bottom-0 w-full md:w-3/4 rounded-t-lg bg-[#FF1744]/10 dark:bg-[#FF1744]/15"
          />
          {/* Layer 2 */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${col.val3}%` }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
            className="absolute bottom-0 w-full md:w-3/4 rounded-t-lg bg-[#FF1744]/20 dark:bg-[#FF1744]/25"
          />
          {/* Layer 3 */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${col.val2}%` }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
            className="absolute bottom-0 w-full md:w-3/4 rounded-t-lg bg-[#FF1744]/40 dark:bg-[#FF1744]/50"
          />
          {/* Solid Core */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${col.val1}%` }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            className="absolute bottom-0 w-full md:w-3/4 rounded-t-lg bg-[#E0002A] shadow-[0_0_15px_rgba(255,23,68,0.3)] group-hover:bg-[#FF1744] transition-colors"
          />
        </div>
      ))}
    </div>
  </motion.div>
);

export default RetentionLoyalty;
