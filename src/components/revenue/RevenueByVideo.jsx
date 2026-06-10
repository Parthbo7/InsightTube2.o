import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, AlertTriangle, Star, Zap, Flame } from 'lucide-react';

const videos = [
  {
    title: 'The Future of AI Architecture',
    date: 'Published 4 days ago',
    thumb: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=120&h=68&fit=crop',
    views: '42.4K',
    cpm: '$18.20',
    rpm: '$11.40',
    revenue: '$483',
    badge: 'High Monetization',
    badgeIcon: Star,
    badgeColor: 'text-yellow-600 dark:text-yellow-400',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-500/15',
    bar: 88,
    barColor: 'from-yellow-500 to-yellow-400',
  },
  {
    title: 'Prompt Engineering Masterclass',
    date: 'Published 1 week ago',
    thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&h=68&fit=crop',
    views: '118.9K',
    cpm: '$12.40',
    rpm: '$9.20',
    revenue: '$1,094',
    badge: 'RPM Booster',
    badgeIcon: TrendingUp,
    badgeColor: 'text-green-700 dark:text-green-400',
    badgeBg: 'bg-green-100 dark:bg-green-500/15',
    bar: 74,
    barColor: 'from-green-500 to-emerald-400',
  },
  {
    title: 'Securing Your AI Workflow',
    date: 'Published 2 weeks ago',
    thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&h=68&fit=crop',
    views: '24.2K',
    cpm: '$22.15',
    rpm: '$16.80',
    revenue: '$406',
    badge: 'Viral Revenue Spike',
    badgeIcon: Flame,
    badgeColor: 'text-orange-700 dark:text-orange-400',
    badgeBg: 'bg-orange-100 dark:bg-orange-500/15',
    bar: 92,
    barColor: 'from-orange-500 to-red-400',
  },
  {
    title: 'AI Tools for Creators 2024',
    date: 'Published 3 weeks ago',
    thumb: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&h=68&fit=crop',
    views: '8.1K',
    cpm: '$6.40',
    rpm: '$4.10',
    revenue: '$33',
    badge: 'Underperforming',
    badgeIcon: AlertTriangle,
    badgeColor: 'text-red-700 dark:text-red-400',
    badgeBg: 'bg-red-100 dark:bg-red-500/15',
    bar: 22,
    barColor: 'from-[#FF1744] to-[#FF6B6B]',
  },
  {
    title: 'Neural Networks Explained Simply',
    date: 'Published 1 month ago',
    thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120&h=68&fit=crop',
    views: '67.3K',
    cpm: '$14.20',
    rpm: '$10.50',
    revenue: '$706',
    badge: 'Membership Magnet',
    badgeIcon: Zap,
    badgeColor: 'text-purple-700 dark:text-purple-400',
    badgeBg: 'bg-purple-100 dark:bg-purple-500/15',
    bar: 81,
    barColor: 'from-purple-500 to-violet-400',
  },
];

const RevenueByVideo = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}
    className="bg-white/75 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm relative overflow-hidden"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-lg font-bold text-[#111] dark:text-white">Revenue by Video</h2>
        <p className="text-xs text-[#888] dark:text-[#666] mt-0.5">Monetization performance per upload</p>
      </div>
      <button className="flex items-center gap-1 text-xs font-bold text-[#FF1744] hover:underline">
        View Full Report
        <ExternalLink size={11} />
      </button>
    </div>

    {/* Table header */}
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-3 px-3 mb-2">
      <span className="text-[9px] font-bold text-[#888] dark:text-[#666] uppercase tracking-wider">Video Details</span>
      <span className="text-[9px] font-bold text-[#888] dark:text-[#666] uppercase tracking-wider w-14 text-right">Views</span>
      <span className="text-[9px] font-bold text-[#888] dark:text-[#666] uppercase tracking-wider w-12 text-right">CPM</span>
      <span className="text-[9px] font-bold text-[#888] dark:text-[#666] uppercase tracking-wider w-12 text-right">RPM</span>
      <span className="text-[9px] font-bold text-[#888] dark:text-[#666] uppercase tracking-wider w-16 text-right">Revenue</span>
      <span className="text-[9px] font-bold text-[#888] dark:text-[#666] uppercase tracking-wider w-20 text-right">Performance</span>
    </div>

    {/* Rows */}
    <div className="space-y-2">
      {videos.map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          whileHover={{ backgroundColor: 'rgba(255,23,68,0.03)', x: 2 }}
          className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-3 p-3 rounded-xl transition-all duration-200 group cursor-default border border-transparent hover:border-black/5 dark:hover:border-white/[0.04]"
        >
          {/* Thumbnail + title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative overflow-hidden rounded-lg shrink-0 group-hover:shadow-lg transition-shadow">
              <img
                src={v.thumb}
                alt={v.title}
                className="w-[60px] h-[34px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#111] dark:text-white truncate">{v.title}</div>
              <div className="text-[10px] text-[#888] dark:text-[#666]">{v.date}</div>
              {/* Performance bar */}
              <div className="mt-1 w-24 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${v.bar}%` }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                  className={`h-full bg-gradient-to-r ${v.barColor} rounded-full`}
                />
              </div>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#111] dark:text-white w-14 text-right">{v.views}</span>
          <span className="text-xs text-[#888] dark:text-[#666] w-12 text-right">{v.cpm}</span>
          <span className="text-xs text-[#888] dark:text-[#666] w-12 text-right">{v.rpm}</span>
          <span className="text-xs font-bold text-[#FF1744] dark:text-[#FF3B3B] w-16 text-right">{v.revenue}</span>

          {/* Badge */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${v.badgeBg} w-20 justify-center`}>
            <v.badgeIcon size={9} className={v.badgeColor} />
            <span className={`text-[8px] font-bold ${v.badgeColor} text-center leading-tight`}>{v.badge}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default RevenueByVideo;
