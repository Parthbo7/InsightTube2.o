import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ComposedChart
} from 'recharts';
import { TrendingUp, Zap } from 'lucide-react';

const revenueData = {
  '7D': [
    { name: 'Mon', adsense: 820, membership: 140, superChat: 60, sponsorship: 0 },
    { name: 'Tue', adsense: 1040, membership: 155, superChat: 85, sponsorship: 0 },
    { name: 'Wed', adsense: 960, membership: 138, superChat: 72, sponsorship: 1200 },
    { name: 'Thu', adsense: 1380, membership: 168, superChat: 95, sponsorship: 0 },
    { name: 'Fri', adsense: 1642, membership: 192, superChat: 140, sponsorship: 0 },
    { name: 'Sat', adsense: 1280, membership: 175, superChat: 110, sponsorship: 0 },
    { name: 'Sun', adsense: 1520, membership: 185, superChat: 125, sponsorship: 2200 },
  ],
  '30D': [
    { name: 'W1', adsense: 6200, membership: 920, superChat: 380, sponsorship: 1200 },
    { name: 'W2', adsense: 7800, membership: 1050, superChat: 420, sponsorship: 0 },
    { name: 'W3', adsense: 8400, membership: 1180, superChat: 510, sponsorship: 3500 },
    { name: 'W4', adsense: 9200, membership: 1290, superChat: 580, sponsorship: 2200 },
    { name: 'W5', adsense: 11100, membership: 1420, superChat: 640, sponsorship: 0 },
  ],
};

const aiInsights = [
  { text: 'Technology videos generate 24% higher RPM than your channel average.', icon: TrendingUp, badge: 'Revenue Tip' },
  { text: 'Q4 advertiser demand is trending upward — expect 18–32% RPM increase in Dec.', icon: Zap, badge: 'Forecast' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-white/95 dark:bg-[#1A1F2E]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl p-3 shadow-2xl min-w-[160px]">
      <div className="text-xs font-bold text-[#111] dark:text-white mb-2 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[#FF1744]">${total.toLocaleString()}</span>
      </div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3 text-[11px] mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[#888] dark:text-[#A1A1AA] capitalize">{p.dataKey}</span>
          </div>
          <span className="font-bold text-[#111] dark:text-white">${p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const RevenuePerformanceChart = () => {
  const [period, setPeriod] = useState('7D');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#FF1744]/5 dark:bg-[#FF1744]/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-[#111] dark:text-white mb-1">Revenue Performance</h2>
          <p className="text-xs text-[#888] dark:text-[#666]">Daily earnings compared to 30-day average</p>
        </div>
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
          {['7D', '30D'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                p === period
                  ? 'bg-white dark:bg-[#2A2A35] text-[#FF1744] shadow-sm'
                  : 'text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 relative z-10 flex-wrap">
        {[
          { label: 'AdSense', color: '#FF1744' },
          { label: 'Membership', color: '#FF6B6B' },
          { label: 'Super Chat', color: 'rgba(255,23,68,0.4)' },
          { label: 'Sponsorship', color: '#FFB400' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
            <span className="text-[10px] font-semibold text-[#888] dark:text-[#666]">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[280px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={revenueData[period]} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1744" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FF1744" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'K' : v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sponsorship" fill="#FFB400" radius={[3,3,0,0]} animationDuration={1600} opacity={0.7} />
            <Bar dataKey="superChat" stackId="stack" fill="rgba(255,23,68,0.35)" radius={[0,0,0,0]} animationDuration={1800} />
            <Bar dataKey="membership" stackId="stack" fill="#FF6B6B" radius={[0,0,0,0]} animationDuration={1900} />
            <Bar dataKey="adsense" stackId="stack" fill="#FF1744" radius={[3,3,0,0]} animationDuration={2000} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights strip */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        {aiInsights.map((ins, i) => (
          <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/3 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.04]">
            <div className="w-6 h-6 rounded-lg bg-[#FF1744]/10 flex items-center justify-center shrink-0 mt-0.5">
              <ins.icon size={12} className="text-[#FF1744]" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#FF1744] uppercase tracking-wide">{ins.badge}</span>
              <p className="text-[11px] text-[#666] dark:text-[#A1A1AA] leading-relaxed mt-0.5">{ins.text}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RevenuePerformanceChart;
