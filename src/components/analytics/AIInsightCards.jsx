import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Activity, Lightbulb, CheckCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

const shortsData = [
  { name: 'W1', shorts: 42, long: 28 },
  { name: 'W2', shorts: 48, long: 32 },
  { name: 'W3', shorts: 55, long: 30 },
  { name: 'W4', shorts: 62, long: 35 },
  { name: 'W5', shorts: 58, long: 40 },
  { name: 'W6', shorts: 70, long: 38 },
  { name: 'W7', shorts: 78, long: 42 },
  { name: 'W8', shorts: 85, long: 45 },
];

const AIInsightCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {/* Shorts vs Long-form Growth */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 size={16} className="text-[#FF1744]" />
        <h3 className="text-sm font-bold text-[#111] dark:text-white">Shorts vs Long Growth</h3>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} className="text-green-500" />
        <span className="text-lg font-black text-[#111] dark:text-white">+12.4K</span>
        <span className="text-xs text-[#888] dark:text-[#666]">subs this month</span>
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={shortsData} barGap={2}>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(18,18,24,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
            />
            <Bar dataKey="shorts" fill="#FF1744" radius={[3,3,0,0]} animationDuration={1500} />
            <Bar dataKey="long" fill="rgba(255,23,68,0.3)" radius={[3,3,0,0]} animationDuration={1700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

    {/* Neural Spike Detection */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF1744]/5 dark:bg-[#FF1744]/8 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FF1744]/10 rounded-full">
          <Zap size={12} className="text-[#FF1744]" />
          <span className="text-[10px] font-bold text-[#FF1744]">Neural Spike Detected</span>
        </div>
      </div>

      <p className="text-sm text-[#111] dark:text-white font-medium mb-4 leading-relaxed">
        Your views spike every <span className="text-[#FF1744] font-bold">Friday between 7–10 PM</span>.
        Consider scheduling uploads 2 hours before peak.
      </p>

      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF1744]/10 text-[#FF1744] border border-[#FF1744]/20">
          Actionable
        </span>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/5 text-[#888] dark:text-[#666] border border-black/5 dark:border-white/10">
          High Probability
        </span>
      </div>
    </motion.div>

    {/* Audience Momentum */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity size={16} className="text-[#FF1744]" />
        <h3 className="text-sm font-bold text-[#111] dark:text-white">Audience Momentum</h3>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Returning viewers', value: '68%', bar: 68, trend: '+5.2%' },
          { label: 'New discovery rate', value: '32%', bar: 32, trend: '+12.1%' },
          { label: 'Avg session depth', value: '3.4 videos', bar: 72, trend: '+0.8' },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#888] dark:text-[#666]">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111] dark:text-white">{item.value}</span>
                <span className="text-[10px] text-green-500 font-bold">{item.trend}</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.bar}%` }}
                transition={{ duration: 1, delay: 1 + i * 0.15 }}
                className="h-full bg-gradient-to-r from-[#FF1744] to-[#FF6B6B] rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>

    {/* AI Recommendation */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-[#FF1744]" />
        <h3 className="text-sm font-bold text-[#111] dark:text-white">AI Recommendations</h3>
      </div>
      <div className="space-y-3">
        {[
          { text: 'Increase Shorts output by 40% — algorithm favoring short content', confidence: 94 },
          { text: 'Collaborate with channels in "AI Tools" niche for cross-pollination', confidence: 87 },
          { text: 'Add chapters to videos over 10 min for 23% retention boost', confidence: 91 },
        ].map((rec, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-black/3 dark:hover:bg-white/3 transition-colors">
            <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-[#111] dark:text-white leading-relaxed">{rec.text}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-12 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${rec.confidence}%` }} />
                </div>
                <span className="text-[9px] font-bold text-green-500">{rec.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default AIInsightCards;
