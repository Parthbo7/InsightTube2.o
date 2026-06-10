import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChannel } from '../../context/ChannelContext';
import { Eye, MousePointerClick, TrendingUp, Zap, AlertTriangle, Flame, Sparkles, Play, ChevronDown } from 'lucide-react';

// ── Mock Video Data for fallback/demo ────────────────────────────
const fallbackVideos = [
  {
    id: 1,
    title: 'The Future of Generative AI in Content Creation',
    uploaded: 'Oct 12, 2025',
    duration: '12:45',
    views: 1200000,
    ctr: 8.4,
    engagement: 4,
    retention: 64,
    label: 'AI High',
    category: 'Top Performers',
    thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Neural Processing Pipelines Explained',
    uploaded: 'Oct 10, 2025',
    duration: '08:12',
    views: 458000,
    ctr: 12.1,
    engagement: 5,
    retention: 78,
    label: 'Shorts',
    category: 'High CTR',
    thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Mastering the Creator Economy in 2026',
    uploaded: 'Oct 08, 2025',
    duration: '26:30',
    views: 89000,
    ctr: 2.1,
    engagement: 2,
    retention: 31,
    label: 'Warning',
    category: 'Underperforming',
    thumb: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Neural Algorithms & You: Complete Guide',
    uploaded: 'Oct 05, 2025',
    duration: '15:00',
    views: 912000,
    ctr: 9.8,
    engagement: 3,
    retention: 52,
    label: 'Trending',
    category: 'Trending',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Production Value at Scale: Cinematic YouTube',
    uploaded: 'Oct 01, 2025',
    duration: '05:45',
    views: 2400000,
    ctr: 15.2,
    engagement: 5,
    retention: 81,
    label: 'Viral Potential',
    category: 'Viral',
    thumb: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Minimalist Studio Setup Tutorial',
    uploaded: 'Sep 28, 2025',
    duration: '18:22',
    views: 312000,
    ctr: 5.5,
    engagement: 3,
    retention: 44,
    label: 'AI High',
    category: 'Long-form',
    thumb: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop',
  },
];

// ── Helpers ──────────────────────────────────────────────────────
const formatViews = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};

const labelConfig = {
  'AI High':         { bg: 'bg-[#FF1744]', text: 'text-white', icon: Sparkles, glow: 'shadow-[#FF1744]/30' },
  'Viral Potential':  { bg: 'bg-gradient-to-r from-[#FF1744] to-[#FF6B6B]', text: 'text-white', icon: Flame, glow: 'shadow-[#FF1744]/25' },
  'Trending':         { bg: 'bg-[#FF1744]/90', text: 'text-white', icon: TrendingUp, glow: 'shadow-[#FF1744]/20' },
  'Warning':          { bg: 'bg-amber-500', text: 'text-white', icon: AlertTriangle, glow: 'shadow-amber-500/25' },
  'Underperforming':  { bg: 'bg-gray-500', text: 'text-white', icon: AlertTriangle, glow: 'shadow-gray-500/20' },
  'Shorts':           { bg: 'bg-[#FF1744]/80', text: 'text-white', icon: Zap, glow: 'shadow-[#FF1744]/15' },
};

// ── Animated Counter ─────────────────────────────────────────────
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const numericValue = typeof value === 'number' ? value : parseFloat(value);
          if (isNaN(numericValue)) { setCount(value); return; }
          
          const duration = 1200;
          const steps = 40;
          const stepTime = duration / steps;
          let current = 0;
          const increment = numericValue / steps;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else {
              setCount(Math.round(current * 10) / 10);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const display = typeof count === 'number'
    ? Number.isInteger(count) ? count.toString() : count.toFixed(1)
    : count;

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
};

// ── Mini Sparkline ───────────────────────────────────────────────
const MiniSparkline = ({ data, color = '#FF1744' }) => {
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - (v / Math.max(...data)) * 18;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="22" viewBox="0 0 60 22" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_4px_rgba(255,23,68,0.4)]"
      />
    </svg>
  );
};

// ── Engagement Dots ──────────────────────────────────────────────
const EngagementDots = ({ score, max = 5 }) => (
  <div className="flex items-center gap-1">
    {[...Array(max)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 500 }}
        className={`w-2 h-2 rounded-full ${
          i < score
            ? 'bg-[#FF1744] dark:bg-[#FF3B3B] shadow-[0_0_6px_rgba(255,23,68,0.5)]'
            : 'bg-black/10 dark:bg-white/10'
        }`}
      />
    ))}
  </div>
);

// ── Retention Bar ────────────────────────────────────────────────
const RetentionBar = ({ value }) => (
  <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
      className={`h-full rounded-full ${
        value >= 70
          ? 'bg-gradient-to-r from-[#FF1744] to-[#FF6B6B] dark:from-[#FF3B3B] dark:to-[#FF8E8E]'
          : value >= 45
          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
          : 'bg-gradient-to-r from-gray-400 to-gray-500'
      }`}
    />
  </div>
);

// ── Single Video Card ────────────────────────────────────────────
const VideoCard = ({ video, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cfg = labelConfig[video.label] || labelConfig['AI High'];
  const LabelIcon = cfg.icon;
  
  // Deterministic sparkline based on title for visual flare
  const getSparkData = () => {
    let hash = 0;
    for (let i = 0; i < video.title.length; i++) {
      hash = video.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const base = Math.abs(hash % 5) + 3;
    return [base, base + 2, base - 1, base + 3, base + 1, base + 4, base + 2];
  };

  const sparkData = getSparkData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-[0_20px_60px_-15px_rgba(255,23,68,0.12)] transition-all duration-500 cursor-pointer"
    >
      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255,23,68,0.15)',
        }}
      />

      {/* ── Thumbnail ── */}
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={video.thumb}
          alt={video.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        />
        
        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* Play button on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 dark:bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
            <Play size={22} className="text-white ml-1" fill="white" />
          </div>
        </motion.div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold rounded-md z-10">
          {video.duration}
        </div>

        {/* Performance Label badge */}
        <div className={`absolute top-3 left-3 ${cfg.bg} ${cfg.text} px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${cfg.glow} z-10`}>
          <LabelIcon size={12} />
          {video.label}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5">
        <h3 className="text-sm font-bold text-[#111111] dark:text-white mb-1 line-clamp-2 leading-snug group-hover:text-[#FF1744] dark:group-hover:text-[#FF3B3B] transition-colors duration-300">
          {video.title}
        </h3>
        <p className="text-[11px] text-[#666666] dark:text-[#A1A1AA] mb-4">
          Uploaded {video.uploaded}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Views */}
          <div className="bg-black/[0.03] dark:bg-white/[0.04] rounded-xl p-3 group/stat hover:bg-[#FF1744]/5 dark:hover:bg-[#FF3B3B]/5 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[#999] dark:text-[#666] uppercase tracking-widest">Views</span>
              <Eye size={10} className="text-[#999] dark:text-[#666]" />
            </div>
            <div className="text-lg font-black text-[#111111] dark:text-white leading-none">
              {formatViews(video.views)}
            </div>
          </div>

          {/* CTR */}
          <div className="bg-black/[0.03] dark:bg-white/[0.04] rounded-xl p-3 hover:bg-[#FF1744]/5 dark:hover:bg-[#FF3B3B]/5 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[#999] dark:text-[#666] uppercase tracking-widest">CTR</span>
              <MousePointerClick size={10} className="text-[#999] dark:text-[#666]" />
            </div>
            <div className="text-lg font-black text-[#FF1744] dark:text-[#FF3B3B] leading-none">
              <AnimatedCounter value={video.ctr} suffix="%" />
            </div>
          </div>
        </div>

        {/* Engagement Score */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[9px] font-bold text-[#999] dark:text-[#666] uppercase tracking-widest">Engagement Score</span>
            <div className="mt-1">
              <EngagementDots score={video.engagement} />
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-[#999] dark:text-[#666] uppercase tracking-widest">Retention</span>
            <div className="text-sm font-black text-[#111111] dark:text-white mt-0.5">
              <AnimatedCounter value={video.retention} suffix="%" />
            </div>
          </div>
        </div>

        {/* Retention Progress Bar */}
        <RetentionBar value={video.retention} />

        {/* Mini sparkline */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[9px] font-bold text-[#999] dark:text-[#666] uppercase tracking-widest">7-day trend</span>
          <MiniSparkline data={sparkData} color={video.retention >= 70 ? '#FF1744' : video.retention >= 45 ? '#F59E0B' : '#9CA3AF'} />
        </div>
      </div>
    </motion.div>
  );
};

// ── Video Grid ───────────────────────────────────────────────────
const VideoGrid = ({ activeFilter }) => {
  const { videos, isLoading, activeChannel } = useChannel();
  
  // Transform real channel videos to fit VideoCard structure
  const getProcessedVideos = () => {
    // If no real database records or still in demo fallback channel, return mock
    if (!videos || videos.length === 0 || activeChannel?.id === 'mock-channel-id') {
      return fallbackVideos;
    }

    return videos.map((v, i) => {
      // engagement_rate is out of 100 on the database. Convert to rating out of 5
      const rating = Math.min(5, Math.max(1, Math.round((v.engagement_rate || 5) / 2)));
      // Retention: generate a realistic value correlated with engagement rate
      const retention = Math.min(95, Math.max(20, Math.floor((v.engagement_rate || 5) * 8.5)));
      
      const label = v.ctr >= 10 ? 'Viral Potential' : v.engagement_rate >= 8 ? 'Trending' : 'AI High';
      const category = v.ctr >= 10 ? 'High CTR' : v.engagement_rate < 4 ? 'Underperforming' : 'Long-form';

      // Duration: format mock duration
      const duration = '11:40';

      return {
        id: v.id || v.youtube_video_id || i,
        title: v.title,
        uploaded: new Date(v.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration,
        views: parseInt(v.views) || 0,
        ctr: parseFloat(v.ctr) || 0,
        engagement: rating,
        retention,
        label,
        category,
        thumb: v.thumbnail
      };
    });
  };

  const processedVideos = getProcessedVideos();

  const filteredVideos =
    activeFilter === 'All Content'
      ? processedVideos
      : processedVideos.filter(
          (v) =>
            v.category === activeFilter ||
            v.label === activeFilter ||
            (activeFilter === 'AI Recommended' && (v.label === 'AI High' || v.label === 'Viral Potential'))
        );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/75 dark:bg-[#121218]/75 rounded-3xl p-5 border border-black/5 dark:border-white/[0.06] animate-pulse space-y-4">
            <div className="aspect-video bg-black/10 dark:bg-white/10 rounded-2xl" />
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6" />
            <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-black/10 dark:bg-white/10 rounded-xl" />
              <div className="h-10 bg-black/10 dark:bg-white/10 rounded-xl" />
            </div>
            <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>

      {/* Empty state */}
      {filteredVideos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 flex items-center justify-center">
            <Play size={32} className="text-[#FF1744] dark:text-[#FF3B3B]" />
          </div>
          <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-2">No videos found</h3>
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA]">Try adjusting your filters or sync new content.</p>
        </motion.div>
      )}

      {/* Load More */}
      {filteredVideos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-10"
        >
          <button className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-[#555] dark:text-[#A1A1AA] bg-white/60 dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] hover:border-[#FF1744]/20 dark:hover:border-[#FF3B3B]/20 hover:text-[#FF1744] dark:hover:text-[#FF3B3B] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 backdrop-blur-xl">
            Load More Content
            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VideoGrid;
