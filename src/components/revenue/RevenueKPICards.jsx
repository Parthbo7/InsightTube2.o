import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Zap, Users, MessageCircle, Percent, Handshake } from 'lucide-react';

const kpiData = [
  { title: 'Est. Revenue', display: '$42,912', value: 42912, prefix: '$', trend: '+12%', up: true, icon: DollarSign, sparkline: [30,38,35,48,55,50,62,70] },
  { title: 'RPM', display: '$8.42', value: 8.42, prefix: '$', trend: '+4.1%', up: true, icon: TrendingUp, sparkline: [40,44,42,50,55,52,60,65] },
  { title: 'Avg CPM', display: '$14.20', value: 14.20, prefix: '$', trend: '-2.5%', up: false, icon: TrendingDown, sparkline: [60,58,55,52,50,48,46,44] },
  { title: 'AI Q4 Forecast', display: '$168,400', value: 168400, prefix: '$', trend: '89% confidence', up: true, icon: Zap, sparkline: [50,60,75,80,90,95,100,108], highlight: true },
  { title: 'Membership Rev', display: '$5,280', value: 5280, prefix: '$', trend: '+18.2%', up: true, icon: Users, sparkline: [20,25,28,32,38,42,48,54] },
  { title: 'Super Chat Rev', display: '$1,940', value: 1940, prefix: '$', trend: '+31.5%', up: true, icon: MessageCircle, sparkline: [15,18,22,28,32,35,40,46] },
  { title: 'Revenue Growth', display: '+24.8%', value: 24.8, suffix: '%', trend: '+6.2pp', up: true, icon: Percent, sparkline: [30,33,36,40,44,47,50,55] },
  { title: 'Sponsorship Est.', display: '$9,200', value: 9200, prefix: '$', trend: '+8.0%', up: true, icon: Handshake, sparkline: [25,28,32,35,40,38,45,50] },
];

const MiniSparkline = ({ data, color }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const id = `spark-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const AnimatedNumber = ({ target, prefix = '', suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const end = typeof target === 'number' ? target : parseFloat(target);
    if (isNaN(end)) { setVal(target); return; }
    const dur = 1400, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(eased * end);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  const fmt = (n) => {
    if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return n.toFixed(n < 100 ? 2 : 0);
  };
  return <span>{prefix}{fmt(val)}{suffix}</span>;
};

const RevenueKPICards = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
    {kpiData.map((kpi, i) => (
      <motion.div
        key={kpi.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.06 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className={`relative backdrop-blur-xl border rounded-2xl p-4 shadow-sm transition-all duration-300 group overflow-hidden cursor-default ${
          kpi.highlight
            ? 'bg-gradient-to-br from-[#FF1744]/15 to-[#8B0000]/10 dark:from-[#FF1744]/20 dark:to-[#8B0000]/15 border-[#FF1744]/30 dark:border-[#FF1744]/25 hover:shadow-[#FF1744]/20 hover:shadow-xl'
            : 'bg-white/75 dark:bg-[rgba(17,24,39,0.72)] border-black/5 dark:border-white/[0.06] hover:shadow-xl dark:hover:shadow-[#FF1744]/8'
        }`}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FF1744]/10 dark:bg-[#FF1744]/15 rounded-full blur-xl" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${kpi.highlight ? 'bg-[#FF1744]/20' : 'bg-[#FF1744]/10 dark:bg-[#FF1744]/15'}`}>
            <kpi.icon size={14} className={kpi.highlight ? 'text-[#FF1744]' : 'text-[#FF1744] dark:text-[#FF3B3B]'} />
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            kpi.highlight
              ? 'bg-[#FF1744]/20 text-[#FF1744]'
              : kpi.up
                ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400'
          }`}>
            {kpi.trend}
          </span>
        </div>

        <div className="text-[9px] font-bold text-[#888] dark:text-[#666] tracking-wider uppercase mb-1 relative z-10">{kpi.title}</div>
        <div className={`text-lg font-black tracking-tight mb-2 relative z-10 ${kpi.highlight ? 'text-[#FF1744]' : 'text-[#111] dark:text-white'}`}>
          <AnimatedNumber target={kpi.value} prefix={kpi.prefix || ''} suffix={kpi.suffix || ''} />
        </div>

        <div className="relative z-10">
          <MiniSparkline data={kpi.sparkline} color={kpi.highlight ? '#FF1744' : kpi.up ? '#22c55e' : '#ef4444'} />
        </div>
      </motion.div>
    ))}
  </div>
);

export default RevenueKPICards;
