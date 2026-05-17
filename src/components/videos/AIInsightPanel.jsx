import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, Target, Lightbulb, ChevronRight, X } from 'lucide-react';

const insights = [
  {
    id: 1,
    icon: Target,
    title: 'Thumbnail Color Analysis',
    desc: 'Videos with red accent thumbnails are seeing 24% higher CTR this week. Recommended: Update "Mastering the Creator Economy" thumbnail.',
    confidence: 92,
    action: 'Apply AI Suggestion',
    type: 'optimization',
  },
  {
    id: 2,
    icon: TrendingUp,
    title: 'Upload Schedule Insight',
    desc: 'Your audience peaks on Tuesday 7PM and Saturday 10AM. Publishing at these times increases views by 31% on average.',
    confidence: 87,
    action: 'Schedule Video',
    type: 'timing',
  },
  {
    id: 3,
    icon: Lightbulb,
    title: 'Content Gap Detected',
    desc: 'Your niche has growing interest in "AI agents" content (+180% search volume). Only 2 competitors cover this topic.',
    confidence: 78,
    action: 'Explore Topic',
    type: 'content',
  },
];

const ConfidenceMeter = ({ value }) => {
  const segments = 10;
  const filled = Math.round((value / 100) * segments);
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(segments)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
            className={`w-1 h-3 rounded-full origin-bottom ${
              i < filled
                ? 'bg-[#FF1744] dark:bg-[#FF3B3B]'
                : 'bg-black/10 dark:bg-white/10'
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-[#FF1744] dark:text-[#FF3B3B] tabular-nums">{value}%</span>
    </div>
  );
};

const AIInsightPanel = () => {
  const [dismissed, setDismissed] = useState([]);

  const visibleInsights = insights.filter((i) => !dismissed.includes(i.id));

  if (visibleInsights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-2"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 flex items-center justify-center">
            <Brain size={18} className="text-[#FF1744] dark:text-[#FF3B3B]" />
          </div>
          {/* AI pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#FF1744]/30 dark:border-[#FF3B3B]/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#111111] dark:text-white flex items-center gap-2">
            Neural Insights
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1744] dark:bg-[#FF3B3B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1744] dark:bg-[#FF3B3B]" />
            </span>
          </h3>
          <p className="text-[11px] text-[#666666] dark:text-[#A1A1AA]">
            AI-powered recommendations based on your video performance
          </p>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {visibleInsights.map((insight, i) => {
            const InsightIcon = insight.icon;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative group bg-white/70 dark:bg-[#121218]/70 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm hover:shadow-xl dark:hover:shadow-[0_15px_40px_-10px_rgba(255,23,68,0.08)] transition-all duration-500 overflow-hidden"
              >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF1744]/5 dark:bg-[#FF3B3B]/8 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Dismiss button */}
                <button
                  onClick={() => setDismissed([...dismissed, insight.id])}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[#999] dark:text-[#666] hover:text-[#FF1744] dark:hover:text-[#FF3B3B] hover:bg-[#FF1744]/10 dark:hover:bg-[#FF3B3B]/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 flex items-center justify-center shrink-0">
                    <InsightIcon size={16} className="text-[#FF1744] dark:text-[#FF3B3B]" />
                  </div>
                  <h4 className="text-xs font-bold text-[#111111] dark:text-white leading-tight">
                    {insight.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#666666] dark:text-[#A1A1AA] leading-relaxed mb-4">
                  {insight.desc}
                </p>

                {/* Confidence */}
                <div className="mb-4">
                  <span className="text-[9px] font-bold text-[#999] dark:text-[#666] uppercase tracking-widest block mb-1.5">
                    AI Confidence
                  </span>
                  <ConfidenceMeter value={insight.confidence} />
                </div>

                {/* Action Button */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 text-[#FF1744] dark:text-[#FF3B3B] hover:bg-[#FF1744]/20 dark:hover:bg-[#FF3B3B]/20 transition-colors group/btn">
                  {insight.action}
                  <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AIInsightPanel;
