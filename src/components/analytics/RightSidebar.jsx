import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Target, Scissors, ChevronRight, Flame, Zap } from 'lucide-react';

const heatmapData = [
  [0.2,0.3,0.4,0.5,0.3,0.2,0.1], // Mon
  [0.3,0.4,0.6,0.7,0.5,0.3,0.2], // Tue
  [0.2,0.3,0.5,0.8,0.6,0.4,0.2], // Wed
  [0.3,0.5,0.7,0.9,0.7,0.5,0.3], // Thu
  [0.4,0.6,0.8,1.0,0.9,0.7,0.4], // Fri
  [0.3,0.5,0.7,0.8,0.7,0.5,0.3], // Sat
  [0.2,0.4,0.5,0.6,0.5,0.3,0.2], // Sun
];
const days = ['M','T','W','T','F','S','S'];
const hours = ['6a','9a','12p','3p','6p','9p','12a'];

const RightSidebar = () => (
  <div className="space-y-4">
    {/* Peak Audience Heatmap */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm"
    >
      <h3 className="text-sm font-bold text-[#111] dark:text-white mb-3">Peak Audience Hours</h3>
      <div className="grid gap-1">
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div />
          {days.map((d,i) => <div key={i} className="text-[9px] font-bold text-center text-[#888] dark:text-[#666]">{d}</div>)}
        </div>
        {hours.map((h, hi) => (
          <div key={hi} className="grid grid-cols-8 gap-1">
            <div className="text-[9px] font-bold text-[#888] dark:text-[#666] flex items-center">{h}</div>
            {days.map((_, di) => {
              const intensity = heatmapData[di]?.[hi] || 0;
              return (
                <motion.div
                  key={di}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + (di * 7 + hi) * 0.02 }}
                  className="aspect-square rounded-sm cursor-pointer hover:scale-125 transition-transform"
                  style={{ backgroundColor: `rgba(255,23,68,${intensity * 0.8})` }}
                  title={`${days[di]} ${h}: ${Math.round(intensity * 100)}%`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[#888] dark:text-[#666] mt-3">
        Peak activity detected at <span className="text-[#FF1744] font-bold">9:00 PM Thursday</span>
      </p>
    </motion.div>

    {/* AI Command Panel */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1744]/5 dark:bg-[#FF1744]/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Cpu size={16} className="text-[#FF1744]" />
        <h3 className="text-sm font-bold text-[#111] dark:text-white">AI Command</h3>
      </div>

      {/* Viral Score */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-xs text-[#888] dark:text-[#666]">Viral Probability Score</span>
        <span className="text-2xl font-black text-[#FF1744]">89<span className="text-sm">%</span></span>
      </div>
      <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mb-4 relative z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '89%' }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="h-full bg-gradient-to-r from-[#FF1744] to-[#FF6B6B] rounded-full"
        />
      </div>

      {/* Keyword opportunity */}
      <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 mb-3 relative z-10">
        <div className="flex items-start gap-2">
          <Target size={14} className="text-[#FF1744] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#111] dark:text-white mb-0.5">Target "AI Automation" keywords.</p>
            <p className="text-[10px] text-[#888] dark:text-[#666]">Difficulty: Low | Traffic: High</p>
          </div>
        </div>
      </div>

      {/* Upload timing */}
      <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 mb-4 relative z-10">
        <div className="flex items-start gap-2">
          <Scissors size={14} className="text-[#FF1744] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#111] dark:text-white mb-0.5">Shorten intro by 4.2 seconds.</p>
            <p className="text-[10px] text-[#888] dark:text-[#666]">Reduces initial bounce rate.</p>
          </div>
        </div>
      </div>

      <button className="w-full py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-[#111] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative z-10 flex items-center justify-center gap-1">
        View Full Content Strategy
        <ChevronRight size={14} />
      </button>
    </motion.div>
  </div>
);

export default RightSidebar;
