import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, ChevronDown, BarChart2 } from 'lucide-react';

const RevenueHeader = () => {
  const [liveMetrics, setLiveMetrics] = useState(true);
  const [period, setPeriod] = useState('Oct 12 – Nov 12');

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
    >
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-[#111] dark:text-white tracking-tight">
          Revenue Intelligence
        </h1>
        <p className="text-sm text-[#888] dark:text-[#666] mt-1 max-w-md">
          Track monetization, forecast earnings, and optimize creator revenue with AI-powered financial intelligence.
        </p>
      </div>

      {/* Controls toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Live Metrics toggle */}
        <button
          onClick={() => setLiveMetrics(!liveMetrics)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
            liveMetrics
              ? 'bg-[#FF1744]/10 border-[#FF1744]/30 text-[#FF1744]'
              : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-[#888] dark:text-[#666]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${liveMetrics ? 'bg-[#FF1744] animate-pulse' : 'bg-[#888]'}`} />
          Live Metrics
        </button>

        {/* Market Benchmarks */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[#666] dark:text-[#999] hover:text-[#111] dark:hover:text-white hover:border-black/10 dark:hover:border-white/10 transition-all">
          <BarChart2 size={12} />
          Market Benchmarks
        </button>

        {/* Forecast period */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[#666] dark:text-[#999] hover:text-[#111] dark:hover:text-white transition-all">
          <Activity size={12} />
          {period}
          <ChevronDown size={10} />
        </button>

        {/* AI Forecast CTA */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(255,23,68,0.35)' }}
          whileTap={{ scale: 0.97 }}
          className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF1744] to-[#E0002A] text-white shadow-lg shadow-[#FF1744]/20 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/10 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          <Sparkles size={13} />
          AI Forecast
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RevenueHeader;
