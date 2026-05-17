import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const viewsData = {
  daily: [
    { name: 'Mon', shorts: 12000, longform: 8000, live: 2000 },
    { name: 'Tue', shorts: 15000, longform: 9500, live: 1800 },
    { name: 'Wed', shorts: 11000, longform: 12000, live: 3200 },
    { name: 'Thu', shorts: 18000, longform: 11000, live: 2800 },
    { name: 'Fri', shorts: 25000, longform: 15000, live: 5500 },
    { name: 'Sat', shorts: 22000, longform: 18000, live: 4200 },
    { name: 'Sun', shorts: 28000, longform: 20000, live: 3800 },
  ],
  weekly: [
    { name: 'W1', shorts: 85000, longform: 62000, live: 15000 },
    { name: 'W2', shorts: 92000, longform: 70000, live: 18000 },
    { name: 'W3', shorts: 78000, longform: 85000, live: 22000 },
    { name: 'W4', shorts: 110000, longform: 95000, live: 25000 },
  ],
  monthly: [
    { name: 'Jan', shorts: 320000, longform: 280000, live: 65000 },
    { name: 'Feb', shorts: 350000, longform: 310000, live: 72000 },
    { name: 'Mar', shorts: 410000, longform: 290000, live: 80000 },
    { name: 'Apr', shorts: 380000, longform: 350000, live: 95000 },
    { name: 'May', shorts: 450000, longform: 400000, live: 110000 },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 dark:bg-[#1A1F2E]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl p-3 shadow-2xl">
      <div className="text-xs font-bold text-[#111] dark:text-white mb-2">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#666] dark:text-[#A1A1AA] capitalize">{p.dataKey}:</span>
          <span className="font-bold text-[#111] dark:text-white">{(p.value / 1000).toFixed(1)}K</span>
        </div>
      ))}
    </div>
  );
};

const ViewsChart = () => {
  const [period, setPeriod] = useState('daily');
  const periods = ['daily', 'weekly', 'monthly'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#FF1744]/5 dark:bg-[#FF1744]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-[#111] dark:text-white mb-1">Views Over Time</h2>
          <p className="text-xs text-[#888] dark:text-[#666]">Real-time audience retention and traffic source analysis.</p>
        </div>
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${p === period ? 'bg-white dark:bg-[#2A2A35] text-[#FF1744] shadow-sm' : 'text-[#888] dark:text-[#666] hover:text-[#111] dark:hover:text-white'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        {[
          { label: 'Shorts', color: '#FF1744' },
          { label: 'Long-form', color: '#FF6B6B' },
          { label: 'Live', color: '#FF1744' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color, opacity: l.label === 'Live' ? 0.4 : 1 }} />
            <span className="text-[10px] font-semibold text-[#888] dark:text-[#666]">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={viewsData[period]} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gShorts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1744" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FF1744" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gLong" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gLive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1744" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#FF1744" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="shorts" stroke="#FF1744" strokeWidth={3} fill="url(#gShorts)" animationDuration={2000} />
            <Area type="monotone" dataKey="longform" stroke="#FF6B6B" strokeWidth={2} fill="url(#gLong)" animationDuration={2200} />
            <Area type="monotone" dataKey="live" stroke="#FF1744" strokeWidth={1.5} strokeOpacity={0.4} fill="url(#gLive)" animationDuration={2400} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ViewsChart;
