import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChannel } from '../../context/ChannelContext';
import { Eye, Clock, Users, MousePointerClick, Heart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const fallbackKpiData = [
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

const KPICards = () => {
  const { activeChannel, analytics, isLoading } = useChannel();

  const getKpiData = () => {
    // If no real database records or still in demo fallback channel, return mock
    if (!activeChannel || analytics.length < 5 || activeChannel?.id === 'mock-channel-id') {
      return fallbackKpiData;
    }

    const latest = analytics[analytics.length - 1];
    const prev = analytics[analytics.length - 2] || latest;

    const viewsVal = parseInt(activeChannel.view_count) || 0;
    const prevViews = parseInt(prev.total_views) || viewsVal;
    const viewsTrend = prevViews > 0 ? parseFloat((((viewsVal - prevViews) / prevViews) * 100).toFixed(1)) : 0;

    const subsVal = parseInt(activeChannel.subscriber_count) || 0;
    const prevSubs = parseInt(prev.total_subscribers) || subsVal;
    const subsTrend = prevSubs > 0 ? parseFloat((((subsVal - prevSubs) / prevSubs) * 100).toFixed(1)) : 0;

    const wtVal = latest ? latest.total_watch_time : Math.floor(viewsVal * 0.08);
    const prevWt = prev ? prev.total_watch_time : wtVal;
    const wtTrend = prevWt > 0 ? parseFloat((((wtVal - prevWt) / prevWt) * 100).toFixed(1)) : 0;

    const revVal = latest ? latest.revenue_estimate : viewsVal * 0.0031;
    const prevRev = prev ? prev.revenue_estimate : revVal;
    const revTrend = prevRev > 0 ? parseFloat((((revVal - prevRev) / prevRev) * 100).toFixed(1)) : 0;

    // Helper for formatting displays
    const displayNum = (num, isCurrency = false) => {
      let formatted = '';
      if (num >= 1000000) formatted = `${(num / 1000000).toFixed(1)}M`;
      else if (num >= 1000) formatted = `${(num / 1000).toFixed(1)}K`;
      else formatted = num.toLocaleString();
      
      return isCurrency ? `$${formatted}` : formatted;
    };

    // Grab sparklines from last 7 days history
    const getHistorySparkline = (key) => {
      const slice = analytics.slice(-7);
      return slice.map(item => parseInt(item[key]) || 0);
    };

    return [
      { 
        title: 'Total Views', 
        value: viewsVal, 
        display: displayNum(viewsVal), 
        trend: `${viewsTrend >= 0 ? '+' : ''}${viewsTrend}%`, 
        up: viewsTrend >= 0, 
        icon: Eye, 
        sparkline: getHistorySparkline('total_views') 
      },
      { 
        title: 'Watch Time (h)', 
        value: wtVal, 
        display: displayNum(wtVal), 
        trend: `${wtTrend >= 0 ? '+' : ''}${wtTrend}%`, 
        up: wtTrend >= 0, 
        icon: Clock, 
        sparkline: getHistorySparkline('total_watch_time') 
      },
      { 
        title: 'New Subs', 
        value: subsVal, 
        display: displayNum(subsVal), 
        trend: `${subsTrend >= 0 ? '+' : ''}${subsTrend}%`, 
        up: subsTrend >= 0, 
        icon: Users, 
        sparkline: getHistorySparkline('total_subscribers') 
      },
      { 
        title: 'Avg CTR', 
        value: latest ? latest.ctr : 6.8, 
        display: `${latest ? latest.ctr : 6.8}%`, 
        trend: `${latest && prev ? (latest.ctr - prev.ctr >= 0 ? '+' : '') : ''}${latest && prev ? (latest.ctr - prev.ctr).toFixed(1) : '0.0'}%`, 
        up: latest && prev ? (latest.ctr >= prev.ctr) : true, 
        icon: MousePointerClick, 
        sparkline: getHistorySparkline('ctr') 
      },
      { 
        title: 'Engagement', 
        value: latest ? latest.engagement_rate : 5.4, 
        display: `${latest ? latest.engagement_rate : 5.4}%`, 
        trend: `${latest && prev ? (latest.engagement_rate - prev.engagement_rate >= 0 ? '+' : '') : ''}${latest && prev ? (latest.engagement_rate - prev.engagement_rate).toFixed(1) : '0.0'}%`, 
        up: latest && prev ? (latest.engagement_rate >= prev.engagement_rate) : true, 
        icon: Heart, 
        sparkline: getHistorySparkline('engagement_rate') 
      },
      { 
        title: 'Est. Revenue', 
        value: revVal, 
        display: displayNum(Math.floor(revVal), true), 
        trend: `${revTrend >= 0 ? '+' : ''}${revTrend}%`, 
        up: revTrend >= 0, 
        icon: DollarSign, 
        sparkline: getHistorySparkline('revenue_estimate') 
      },
    ];
  };

  const kpiData = getKpiData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] border border-black/5 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm h-32 animate-pulse space-y-4">
            <div className="flex justify-between">
              <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-lg" />
              <div className="w-12 h-4 bg-black/10 dark:bg-white/10 rounded-full" />
            </div>
            <div className="w-2/3 h-4 bg-black/10 dark:bg-white/10 rounded" />
            <div className="w-1/2 h-3 bg-black/10 dark:bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
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
            {kpi.sparkline.length > 1 ? (
              <MiniSparkline data={kpi.sparkline} color={kpi.up ? '#22c55e' : '#ef4444'} />
            ) : (
              <div className="h-7 w-full border-t border-dashed border-black/5 dark:border-white/5" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KPICards;
