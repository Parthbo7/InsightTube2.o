import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, MessageCircle, Handshake, Link, Calendar } from 'lucide-react';

const sources = [
  { label: 'Ad Revenue', icon: DollarSign, pct: 82, amount: '$35,188', color: '#FF1744', gradient: 'from-[#FF1744] to-[#FF6B6B]' },
  { label: 'Memberships', icon: Users, pct: 12, amount: '$5,149', color: '#8B5CF6', gradient: 'from-purple-500 to-violet-400' },
  { label: 'Super Chat / Stickers', icon: MessageCircle, pct: 6, amount: '$1,940', color: '#FFB400', gradient: 'from-yellow-500 to-orange-400' },
  { label: 'Sponsorships', icon: Handshake, pct: 0, amount: '$—', color: '#22c55e', gradient: 'from-green-500 to-emerald-400' },
  { label: 'Affiliate', icon: Link, pct: 0, amount: '$635', color: '#0EA5E9', gradient: 'from-sky-500 to-blue-400' },
];

const RevenueSourcesPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.55 }}
    className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden"
  >
    {/* Ambient */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1744]/5 dark:bg-[#FF1744]/8 rounded-full blur-[50px] pointer-events-none" />

    <h2 className="text-sm font-bold text-[#111] dark:text-white mb-4 relative z-10">Revenue Sources</h2>

    {/* Bars */}
    <div className="space-y-4 relative z-10">
      {sources.map((s, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <s.icon size={12} style={{ color: s.color }} />
              <span className="text-xs text-[#666] dark:text-[#A1A1AA]">{s.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#111] dark:text-white">{s.amount}</span>
              <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.pct}%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-black/5 dark:bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 1.2, delay: 0.7 + i * 0.12 }}
              className={`h-full bg-gradient-to-r ${s.gradient} rounded-full`}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Divider */}
    <div className="border-t border-black/5 dark:border-white/[0.06] my-4 relative z-10" />

    {/* Next Payout card */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="relative z-10 p-4 rounded-2xl bg-gradient-to-br from-[#FF1744]/12 to-[#8B0000]/8 dark:from-[#FF1744]/18 dark:to-[#8B0000]/12 border border-[#FF1744]/20 dark:border-[#FF1744]/15"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-xl bg-[#FF1744]/15 flex items-center justify-center">
          <DollarSign size={14} className="text-[#FF1744]" />
        </div>
        <span className="text-[10px] font-bold text-[#888] dark:text-[#666] uppercase tracking-wider">Next Payout</span>
      </div>
      <div className="text-2xl font-black text-[#111] dark:text-white mb-1">$12,402<span className="text-lg">.11</span></div>
      <div className="flex items-center gap-1.5 text-[10px] text-[#888] dark:text-[#666]">
        <Calendar size={10} className="text-[#FF1744]" />
        <span>Scheduled for <span className="font-bold text-[#FF1744]">Nov 21</span></span>
      </div>
    </motion.div>
  </motion.div>
);

export default RevenueSourcesPanel;
