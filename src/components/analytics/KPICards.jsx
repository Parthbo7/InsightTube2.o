import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Clock, Users, MousePointerClick, Heart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const kpiData = [
  { title: 'Total Views', value: 1400000, display: '1.4M', trend: '+12.4%', up: true, icon: Eye, sparkline: [30,45,38,52,48,60,75] },
  { title: 'Watch Time (h)', value: 82500, display: '82.5K', trend: '+8.2%', up: true, icon: Clock, sparkline: [20,35,30,42,38,50,55] },
  { title: 'New Subs', value: 12800, display: '12.8K', trend: '+24.1%', up: true, icon: Users, sparkline: [15,25,35,30,45,55,70] },
  { title: 'Avg CTR', value: 7.4, display: '7.4%', trend: '-0.5%', up: false, icon: MousePointerClick, sparkline: [50,48,45,42,40,38,35] },
  { title: 'Engagement', value: 15.2, display: '15.2%', trend: '+4.3%', up: true, icon: Heart, sparkline: [25,30,28,35,40,45,52] },
  { title: 'Est. Revenue', value: 14200, display: '$14.2K', trend: '+18.5%', up: true, icon: DollarSign, sparkline: [20,28,32,38,42,50,62] },
];

const MiniSparkline = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#spark-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    if (isNaN(end)) { setDisplayed(value); return; }
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayed(end);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{prefix}{typeof displayed === 'number' ? displayed.toLocaleString() : displayed}{suffix}</span>;
};

const KPICards = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
    {kpiData.map((kpi, i) => (
      <motion.div
        key={kpi.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.07 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="relative bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm hover:shadow-xl dark:hover:shadow-[#FF1744]/8 transition-all duration-300 group overflow-hidden cursor-default"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#FF1744]/10 dark:bg-[#FF1744]/15 rounded-full blur-2xl" />
        </div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-[#FF1744]/10 dark:bg-[#FF1744]/15 flex items-center justify-center">
            <kpi.icon size={16} className="text-[#FF1744] dark:text-[#FF3B3B]" />
          </div>
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${kpi.up ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400'}`}>
            {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {kpi.trend}
          </div>
        </div>

        <div className="text-[10px] font-bold text-[#888] dark:text-[#666] tracking-wider uppercase mb-1 relative z-10">{kpi.title}</div>
        <div className="text-xl font-black text-[#111] dark:text-white tracking-tight mb-2 relative z-10">{kpi.display}</div>

        <div className="relative z-10">
          <MiniSparkline data={kpi.sparkline} color={kpi.up ? '#22c55e' : '#ef4444'} />
        </div>
      </motion.div>
    ))}
  </div>
);

export default KPICards;
