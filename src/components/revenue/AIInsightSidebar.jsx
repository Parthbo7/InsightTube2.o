import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, TrendingUp, Target, Lightbulb, ChevronRight } from 'lucide-react';

const insights = [
  {
    type: 'Action Recommended',
    icon: Target,
    color: '#FF1744',
    bg: 'bg-[#FF1744]/10',
    text: 'Your RPM in "Technology" is 24% higher than your average. Increase posting frequency on these topics to maximize yield.',
    confidence: 92,
  },
  {
    type: 'Forecast Update',
    icon: TrendingUp,
    color: '#22c55e',
    bg: 'bg-green-500/10',
    text: 'Ad spend in Q4 is trending upward. We project an additional $2.4K in organic revenue based on historical peaks.',
    confidence: 87,
  },
  {
    type: 'Strategy',
    icon: Lightbulb,
    color: '#FFB400',
    bg: 'bg-yellow-500/10',
    text: 'Launch a channel membership tier at $4.99/mo — projected to add $1,800+ monthly revenue based on your engaged viewer base.',
    confidence: 78,
  },
];

const AIInsightSidebar = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden h-full"
  >
    {/* Ambient glow */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF1744]/5 dark:bg-[#FF1744]/8 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

    {/* Header */}
    <div className="flex items-center gap-2 mb-4 relative z-10">
      <div className="w-7 h-7 rounded-lg bg-[#FF1744]/10 flex items-center justify-center">
        <Cpu size={14} className="text-[#FF1744]" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#111] dark:text-white">AI Insight</h3>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744] animate-pulse" />
        <span className="text-[9px] font-bold text-[#FF1744] uppercase tracking-wide">Live</span>
      </div>
    </div>

    {/* Insight cards */}
    <div className="space-y-3 relative z-10">
      {insights.map((ins, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.12 }}
          className="group p-3.5 rounded-xl bg-black/3 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.04] hover:border-[#FF1744]/20 transition-all cursor-default"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-5 h-5 rounded-md ${ins.bg} flex items-center justify-center`}>
              <ins.icon size={11} style={{ color: ins.color }} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: ins.color }}>
              {ins.type}
            </span>
          </div>
          <p className="text-[11px] text-[#666] dark:text-[#A1A1AA] leading-relaxed">{ins.text}</p>

          {/* Confidence meter */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-[#888] dark:text-[#666] uppercase tracking-wide">AI Confidence</span>
              <span className="text-[9px] font-bold" style={{ color: ins.color }}>{ins.confidence}%</span>
            </div>
            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ins.confidence}%` }}
                transition={{ duration: 1.2, delay: 0.6 + i * 0.15 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${ins.color}, ${ins.color}99)` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Optimization Score */}
    <div className="mt-4 relative z-10">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-[#888] dark:text-[#666]">Optimization Score</span>
        <span className="text-lg font-black text-[#FF1744]">92<span className="text-xs">%</span></span>
      </div>
      <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '92%' }}
          transition={{ duration: 1.5, delay: 1 }}
          className="h-full bg-gradient-to-r from-[#FF1744] to-[#FF6B6B] rounded-full"
        />
      </div>
    </div>

    <button className="mt-4 w-full py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-[#111] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative z-10 flex items-center justify-center gap-1">
      Full Revenue Strategy
      <ChevronRight size={13} />
    </button>
  </motion.div>
);

export default AIInsightSidebar;
