import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, TrendingUp, TrendingDown, Zap, Eye, Users, BarChart2, Sparkles } from 'lucide-react';

const competitors = [
  {
    name: 'TechFlow AI',
    tag: 'Top Rival in Automation',
    avatar: '🔴',
    subs: '2.1M',
    avgViews: '450K',
    viral: 'A+',
    viralColor: '#22c55e',
    frequency: '3x/week',
    insight: 'Viral Pattern: Posting 48h after you.',
    trend: 'up',
  },
  {
    name: 'CreatorHub Pro',
    tag: 'Fastest Growing Rival',
    avatar: '🟠',
    subs: '890K',
    avgViews: '1.2M',
    viral: 'S',
    viralColor: '#FF1744',
    frequency: '5x/week',
    insight: 'Insight: Outperforming on mobile CTR.',
    trend: 'up',
  },
];

const CompetitorSpy = () => {
  const [addInput, setAddInput] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#111] dark:text-white">Competitor Spy Tool</h2>
          <p className="text-xs text-[#888] dark:text-[#666]">Track and analyze competitor performance in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#888] dark:text-[#666]">
            <Filter size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#888] dark:text-[#666]">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {competitors.map((comp, i) => (
          <motion.div
            key={comp.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
            whileHover={{ y: -3 }}
            className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm hover:shadow-xl dark:hover:shadow-[#FF1744]/5 transition-all relative overflow-hidden group cursor-default"
          >
            {/* Bottom neon border */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF1744] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-lg">
                {comp.avatar}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111] dark:text-white">{comp.name}</h4>
                <p className="text-[10px] text-[#888] dark:text-[#666]">{comp.tag}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'SUBS', value: comp.subs },
                { label: 'AVG VIEW', value: comp.avgViews },
                { label: 'VIRAL', value: comp.viral, color: comp.viralColor },
              ].map((stat, si) => (
                <div key={si} className="text-center">
                  <div className="text-[9px] font-bold text-[#888] dark:text-[#666] tracking-wider uppercase mb-1">{stat.label}</div>
                  <div className={`text-sm font-black ${stat.color ? '' : 'text-[#111] dark:text-white'}`} style={stat.color ? { color: stat.color } : {}}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-2.5 flex items-start gap-2">
              <Sparkles size={12} className="text-[#FF1744] mt-0.5 shrink-0" />
              <p className="text-[10px] text-[#888] dark:text-[#A1A1AA] leading-relaxed">{comp.insight}</p>
            </div>
          </motion.div>
        ))}

        {/* Track New Channel Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          whileHover={{ y: -3 }}
          className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#FF1744]/30 transition-colors group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#FF1744]/10 transition-colors">
            <Plus size={24} className="text-[#888] dark:text-[#666] group-hover:text-[#FF1744] transition-colors" />
          </div>
          <p className="text-sm font-bold text-[#888] dark:text-[#666] group-hover:text-[#111] dark:group-hover:text-white transition-colors">Track New Channel</p>
          <p className="text-[10px] text-[#aaa] dark:text-[#555] mt-1">Add a YouTube channel to monitor</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompetitorSpy;
