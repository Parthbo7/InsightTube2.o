import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';

const sentimentBars = [
  { label: '"Absolute Fire"', sub: '(Hype)', value: 68, color: 'bg-gradient-to-r from-[#FF1744] to-[#E0002A]' },
  { label: '"Main Stream"', sub: '(Tech Help)', value: 22, color: 'bg-[#888] dark:bg-[#A1A1AA]' },
  { label: '"Mid"', sub: '(Neutral/Critique)', value: 10, color: 'bg-[#E5E5E5] dark:bg-[#333]' },
];

const keyPhrases = [
  '"Ye toh ultra clear hai!"',
  '"Straight W"',
  '"Bhai op analysis"',
  '"Vibe check passed"',
  '"Low-key obsessed"',
  '"Cap 🚫"',
];

const SentimentEngine = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="bg-white/80 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-[24px] p-8 shadow-sm relative overflow-hidden"
  >
    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF1744]/5 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-[#111] dark:text-white">Sentiment Engine</h2>
          <span className="px-2 py-0.5 rounded-full bg-[#FF1744]/10 text-[#FF1744] text-[10px] font-black uppercase tracking-wider border border-[#FF1744]/20 animate-pulse">
            Live
          </span>
        </div>
        <p className="text-sm text-[#888] dark:text-[#A1A1AA]">
          AI analysis of 12,403 comments (supporting Hinglish & Gen Z slang).
        </p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-black text-[#FF1744]">94.2%</div>
        <div className="text-[10px] font-bold text-[#111] dark:text-white uppercase tracking-wider mt-1">
          Community<br />Positivity
        </div>
      </div>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10 relative z-10">
      
      {/* Sentiment Bars */}
      <div className="space-y-6">
        {sentimentBars.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-[#111] dark:text-white">
                {item.label} <span className="text-[#888] dark:text-[#A1A1AA] font-normal">{item.sub}</span>
              </span>
              <span className="text-sm font-bold text-[#FF1744]">{item.value}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/5 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                className={`absolute top-0 left-0 h-full rounded-full ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Key Phrases */}
      <div>
        <h3 className="text-[11px] font-bold text-[#111] dark:text-white uppercase tracking-widest mb-4">Key Phrases Today</h3>
        <div className="flex flex-wrap gap-3">
          {keyPhrases.map((phrase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 rounded-full border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 shadow-sm text-xs font-medium text-[#444] dark:text-[#E0E0E0] cursor-pointer hover:border-[#FF1744]/30 hover:bg-[#FF1744]/5 transition-all"
            >
              {phrase}
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Intelligence Bottom Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="w-full rounded-[20px] border border-[#FF1744]/20 bg-gradient-to-r from-white to-red-50 dark:from-[#1A1A24] dark:to-[#1A1114] p-6 shadow-[0_8px_30px_rgba(255,23,68,0.08)] relative z-10 flex flex-col md:flex-row items-center gap-6 group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-[#FF1744]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
        <Sparkles size={20} className="text-[#FF1744]" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-[10px] font-black text-[#FF1744] tracking-wider uppercase">InsightTube<br />Intelligence</span>
           <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#FF1744] text-white">98% CONFIDENCE</span>
        </div>
        <p className="text-sm text-[#444] dark:text-[#D1D5DB] leading-relaxed">
          Community sentiment is spiking around the "Advanced Workflow" section. 
          Your audience is asking for <strong className="text-[#111] dark:text-white font-bold">a dedicated tutorial on API integration</strong>.
        </p>
      </div>

      <div className="shrink-0">
        <ChevronRight size={20} className="text-[#888] group-hover:text-[#FF1744] group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  </motion.div>
);

export default SentimentEngine;
