import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChannel } from '../context/ChannelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Eye, Clock, DollarSign, Activity, 
  Circle, RefreshCw, CheckCircle, AlertCircle, Key, Link2, 
  ArrowUpRight, BarChart2
} from 'lucide-react';

const YoutubeIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width={props.size || 24} 
    height={props.size || 24} 
    fill="currentColor" 
    {...props}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.522 3.543 12 3.543 12 3.543s-7.522 0-9.388.513a3.003 3.003 0 0 0-2.11 2.107C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.866.513 9.388.513 9.388.513s7.522 0 9.388-.513a3.003 3.003 0 0 0 2.11-2.107C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const ChannelHeaderAvatar = ({ src, name, sizeClass = "w-[100px] h-[100px]" }) => {
  const [error, setError] = useState(false);
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'YT';

  if (error || !src) {
    return (
      <div 
        className={`${sizeClass} rounded-full flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br from-[#FF1744] to-[#B00020] border-4 border-white dark:border-[#121218] flex-shrink-0 select-none shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,60,0.4)]`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 border-4 border-white dark:border-[#121218] shadow-lg transition-transform duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,60,0.4)]`}>
      <img 
        src={src} 
        alt={name} 
        onError={() => setError(true)}
        className="w-full h-full object-cover object-center" 
      />
    </div>
  );
};

const ChannelHeaderSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Profile Header Card Skeleton */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-black/5 dark:border-white/[0.06] bg-white/40 dark:bg-[#121218]/30 shadow-sm animate-pulse">
        {/* Banner Placeholder */}
        <div className="h-44 sm:h-52 w-full bg-gray-200 dark:bg-[#1E1E26]" />
        
        {/* Profile Content Placeholder */}
        <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
            {/* Avatar Circle */}
            <div className="w-[100px] h-[100px] rounded-full bg-gray-300 dark:bg-[#2A2A35] border-4 border-white dark:border-[#121218] flex-shrink-0" />
            
            {/* Text details */}
            <div className="mb-1 space-y-2">
              <div className="h-7 w-48 bg-gray-300 dark:bg-[#2A2A35] rounded-lg mx-auto md:mx-0" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-[#22222E] rounded mx-auto md:mx-0" />
              
              {/* Badges placeholder */}
              <div className="flex justify-center md:justify-start gap-2 pt-2">
                <div className="h-6 w-20 bg-gray-200 dark:bg-[#22222E] rounded-full" />
                <div className="h-6 w-36 bg-gray-200 dark:bg-[#22222E] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/75 dark:bg-[#121218]/75 border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm min-h-[120px] animate-pulse flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-[#22222E] rounded" />
              <div className="h-8 w-32 bg-gray-300 dark:bg-[#2A2A35] rounded-lg" />
            </div>
            <div className="h-3 w-40 bg-gray-200 dark:bg-[#22222E] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendValue, icon: Icon, delay, isLoading }) => {
  const isUp = trend === 'up';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[#FF3B3B]/10 transition-all group relative overflow-hidden"
    >
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 bg-black/10 dark:bg-white/10 rounded-full" />
            <div className="w-12 h-5 bg-black/10 dark:bg-white/10 rounded-full" />
          </div>
          <div className="w-24 h-4 bg-black/10 dark:bg-white/10 rounded" />
          <div className="w-20 h-8 bg-black/10 dark:bg-white/10 rounded" />
          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
        </div>
      ) : (
        <>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={80} className="text-[#FF1744] dark:text-[#FF3B3B] -rotate-12 translate-x-4 -translate-y-4" />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 flex items-center justify-center">
              <Icon size={20} className="text-[#FF1744] dark:text-[#FF3B3B]" />
            </div>
            <div className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5 ${
              isUp 
                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
            }`}>
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {trendValue}
            </div>
          </div>
          
          <h3 className="text-xs font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">{title}</h3>
          <div className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">{value}</div>
          
          <div className="mt-4 h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1, delay: delay + 0.2 }}
              className="h-full bg-gradient-to-r from-[#FF1744] to-[#ff6b6b] dark:from-[#FF3B3B] dark:to-[#ff8e8e] rounded-full"
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <div className="w-24 h-14 bg-black/10 dark:bg-white/10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="w-2/3 h-4 bg-black/10 dark:bg-white/10 rounded" />
          <div className="w-1/3 h-3 bg-black/10 dark:bg-white/10 rounded" />
        </div>
        <div className="w-12 h-4 bg-black/10 dark:bg-white/10 rounded" />
        <div className="w-12 h-4 bg-black/10 dark:bg-white/10 rounded" />
      </div>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center animate-pulse">
    <div className="w-full h-[80%] bg-black/5 dark:bg-white/5 rounded-2xl flex items-end p-4 gap-4">
      <div className="w-full h-[30%] bg-black/10 dark:bg-white/10 rounded" />
      <div className="w-full h-[50%] bg-black/10 dark:bg-white/10 rounded" />
      <div className="w-full h-[40%] bg-black/10 dark:bg-white/10 rounded" />
      <div className="w-full h-[70%] bg-black/10 dark:bg-white/10 rounded" />
      <div className="w-full h-[60%] bg-black/10 dark:bg-white/10 rounded" />
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    activeChannel, 
    videos, 
    analytics, 
    isLoading, 
    isSyncing, 
    verifyChannel, 
    saveChannel, 
    syncChannel,
    channels,
    inspectorData,
    lastSyncedText
  } = useChannel();

  // Onboarding Modal States
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingInput, setOnboardingInput] = useState('');
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState(0); // 0: Input, 1-5: Steps, 6: Error
  const [onboardingError, setOnboardingError] = useState(null);
  
  // Chart tab toggle: Views, Subscribers, WatchTime
  const [chartTab, setChartTab] = useState('Views'); 

  // Check if a real channel is connected for logged-in users
  const hasNoChannel = user && (!activeChannel || activeChannel.id === 'mock-channel-id');

  // Trigger auto-open onboarding modal on load for first-time users
  useEffect(() => {
    if (hasNoChannel && !isLoading) {
      setIsOnboardingOpen(true);
    }
  }, [hasNoChannel, isLoading]);

  const handleOnboardingConnect = async (e) => {
    if (e) e.preventDefault();
    if (!onboardingInput.trim()) return;

    setOnboardingError(null);
    setOnboardingProgress(0);
    setOnboardingStep(1); // 🔍 Searching YouTube channel...
    
    try {
      // Step 1: Searching YouTube channel
      setOnboardingProgress(20);
      
      const verified = await verifyChannel(onboardingInput);
      
      // Step 2: Fetching channel details
      setOnboardingStep(2);
      setOnboardingProgress(40);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Importing analytics
      setOnboardingStep(3);
      setOnboardingProgress(60);
      await new Promise(r => setTimeout(r, 600));

      // Step 4: Saving channel to database
      setOnboardingStep(4);
      setOnboardingProgress(80);
      
      await saveChannel(verified);

      // Step 5: Dashboard ready!
      setOnboardingStep(5);
      setOnboardingProgress(100);
      
      toast.success('YouTube Channel connected successfully!');
      
      await new Promise(r => setTimeout(r, 1000));
      setIsOnboardingOpen(false);
      setOnboardingStep(0);
      setOnboardingInput('');
    } catch (err) {
      console.error("Onboarding failed:", err);
      setOnboardingStep(6);
      setOnboardingError(err.message || 'Failed to connect channel');
      toast.error(err.message || 'Failed to connect channel');
    }
  };

  const handleSync = async () => {
    if (!activeChannel) return;
    try {
      await syncChannel(activeChannel.id);
    } catch (err) {
      toast.error(err.message || 'Failed to sync channel');
      console.error(err);
    }
  };

  // Process data for Recharts area graph
  const getChartData = () => {
    if (!analytics || analytics.length === 0) return [];
    
    return analytics.map(day => {
      const dateObj = new Date(day.analytics_date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      
      let val = 0;
      if (chartTab === 'Views') val = parseInt(day.total_views) || 0;
      else if (chartTab === 'Subscribers') val = parseInt(day.total_subscribers) || 0;
      else if (chartTab === 'Watch Time') val = parseInt(day.total_watch_time) || 0;

      return {
        name: formattedDate,
        value: val
      };
    });
  };

  const chartData = getChartData();

  // Helper to format values for cards
  const formatStat = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Get active stats snapshots
  const latestAnalytics = analytics.length > 0 ? analytics[analytics.length - 1] : null;
  const previousAnalytics = analytics.length > 1 ? analytics[analytics.length - 2] : null;

  // Calculate dynamic card metrics
  const getMetricData = (type) => {
    if (!activeChannel) return { value: '0', trend: 'up', trendValue: '0' };
    
    const isMock = activeChannel.id === 'mock-channel-id';

    switch (type) {
      case 'Views':
        return {
          value: formatStat(activeChannel.view_count),
          trend: isMock ? 'up' : (latestAnalytics?.total_views >= (previousAnalytics?.total_views || 0) ? 'up' : 'down'),
          trendValue: isMock 
            ? '120k' 
            : formatStat(Math.abs((latestAnalytics?.total_views || 0) - (previousAnalytics?.total_views || 0)))
        };
      case 'Subscribers':
        return {
          value: formatStat(activeChannel.subscriber_count),
          trend: isMock ? 'up' : (latestAnalytics?.total_subscribers >= (previousAnalytics?.total_subscribers || 0) ? 'up' : 'down'),
          trendValue: isMock 
            ? '2.4k' 
            : formatStat(Math.abs((latestAnalytics?.total_subscribers || 0) - (previousAnalytics?.total_subscribers || 0)))
        };
      case 'Watch Time':
        const wtValue = latestAnalytics ? latestAnalytics.total_watch_time : Math.floor(activeChannel.view_count * 0.08);
        const prevWt = previousAnalytics ? previousAnalytics.total_watch_time : wtValue;
        return {
          value: `${formatStat(wtValue)}h`,
          trend: isMock ? 'down' : (wtValue >= prevWt ? 'up' : 'down'),
          trendValue: isMock 
            ? '1.2k' 
            : `${formatStat(Math.abs(wtValue - prevWt))}h`
        };
      case 'Revenue':
        const revVal = latestAnalytics ? latestAnalytics.revenue_estimate : activeChannel.view_count * 0.0031;
        const prevRev = previousAnalytics ? previousAnalytics.revenue_estimate : revVal;
        return {
          value: `$${formatStat(Math.floor(revVal))}`,
          trend: isMock ? 'up' : (revVal >= prevRev ? 'up' : 'down'),
          trendValue: isMock 
            ? '$840' 
            : `$${formatStat(Math.floor(Math.abs(revVal - prevRev)))}`
        };
      default:
        return { value: '0', trend: 'up', trendValue: '0' };
    }
  };

  // Pie chart demographic items
  const demographicData = [
    { name: 'Age 18-24', value: 70, color: '#FF1744' },
    { name: 'Age 25-34', value: 20, color: '#00B4D8' },
    { name: 'Other', value: 10, color: '#E0E0E0' }
  ];

  // Helper for banner message if demo
  const isDemoMode = activeChannel?.id === 'mock-channel-id';

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        <ChannelHeaderSkeleton />
        
        {/* Metric Cards placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/75 dark:bg-[#121218]/75 border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 h-36 animate-pulse" />
          ))}
        </div>

        {/* Charts & Tables placeholders */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white/75 dark:bg-[#121218]/75 rounded-3xl p-8 border border-black/5 dark:border-white/[0.06] h-[450px]">
            <ChartSkeleton />
          </div>
          <div className="bg-white/75 dark:bg-[#121218]/75 rounded-3xl p-8 border border-black/5 dark:border-white/[0.06] h-[450px]">
            <TableSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Onboarding Banner Alert */}
      {isDemoMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-gradient-to-r from-[#FF1744]/10 to-amber-500/10 border border-[#FF1744]/20 rounded-2xl p-4 text-sm text-[#FF1744] dark:text-[#ff5575] font-semibold animate-pulse"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>You are currently viewing <strong>Demo Mode Data</strong>. Connect a real YouTube channel to sync analytics and videos dynamically.</span>
        </motion.div>
      )}

      {hasNoChannel ? (
        /* Empty State Design with Animated YouTube Icon */
        <div className="flex flex-col items-center justify-center min-h-[55vh] p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 shadow-xl text-center flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute top-[-20%] left-[-20%] w-[200px] h-[200px] bg-[#FF1744]/10 dark:bg-[#FF3B3B]/5 rounded-full blur-[60px]" />
            
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
              className="w-20 h-20 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 mb-6"
            >
              <YoutubeIcon size={40} className="animate-pulse" />
            </motion.div>

            <h2 className="text-xl font-bold text-black dark:text-white mb-2">No Channel Connected Yet</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Connect your YouTube channel to fetch live metrics, growth velocity graphs, video CTR performance, and audience demographics.
            </p>

            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full bg-[#FF1744] hover:bg-[#D90429] dark:bg-[#FF3B3B] dark:hover:bg-[#E62E2E] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/20 hover:scale-102 active:scale-98 cursor-pointer"
            >
              Connect Channel
            </button>
          </motion.div>
        </div>
      ) : (
        /* Returning Users / Active Dashboard View */
        <>
          {/* SECTION 11: Dynamic Channel Header */}
          {activeChannel && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Profile Card Container with Banner */}
              <div className="relative w-full rounded-3xl overflow-hidden border border-black/5 dark:border-white/[0.06] bg-white/40 dark:bg-[#121218]/30 shadow-sm">
                {/* Banner Container */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-[#FF1744]/20 via-black to-[#0B0B0F]">
                  {activeChannel.banner_url ? (
                    <img 
                      src={activeChannel.banner_url} 
                      alt="Channel Banner" 
                      className="w-full h-full object-cover object-center opacity-90"
                    />
                  ) : (
                    // Fallback sleek dark-red gradient
                    <div className="w-full h-full bg-gradient-to-r from-[#FF1744]/30 via-slate-900 to-black relative">
                      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  )}
                  {/* Dark bottom gradient overlay to blend banner to container background */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F5F5F7] dark:from-[#0B0B0F] to-transparent pointer-events-none" />
                </div>

                {/* Profile details section */}
                <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left w-full">
                    <div className="relative shrink-0">
                      <ChannelHeaderAvatar 
                        src={activeChannel.thumbnail_url} 
                        name={activeChannel.channel_name} 
                      />
                      {isSyncing && (
                        <span className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin pointer-events-none" />
                      )}
                    </div>
                    
                    <div className="mb-1 flex-1 min-w-0">
                      <h2 className="text-2xl font-black text-black dark:text-white flex items-center justify-center md:justify-start gap-2 truncate">
                        {activeChannel.channel_name}
                        {!isDemoMode && <CheckCircle className="text-green-500 fill-green-500/10 shrink-0" size={18} />}
                      </h2>
                      <p className="text-sm font-semibold text-[#666] dark:text-[#A1A1AA] mt-0.5">{activeChannel.youtube_handle || '@channel'}</p>
                      
                      {/* Status row inside details card */}
                      <div className="mt-3 flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Connected
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 font-semibold bg-white/50 dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/[0.05]">
                          Last Synced: {lastSyncedText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive Cards for Statistics Row (Subscribers, Total Views, Total Videos) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subscribers Card */}
                <div className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[#FF3B3B]/10 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  <div>
                    <h3 className="text-xs font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">Subscribers</h3>
                    <div className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">
                      {formatStat(activeChannel.subscriber_count)}
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-2">
                    Live subscribers from API
                  </div>
                </div>

                {/* Total Views Card */}
                <div className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[#FF3B3B]/10 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  <div>
                    <h3 className="text-xs font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">Total Views</h3>
                    <div className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">
                      {formatStat(activeChannel.view_count)}
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-2">
                    Lifetime views across channel
                  </div>
                </div>

                {/* Total Videos Card */}
                <div className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[#FF3B3B]/10 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  <div>
                    <h3 className="text-xs font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">Total Videos</h3>
                    <div className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">
                      {formatStat(activeChannel.video_count)}
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-2">
                    Uploaded video count
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dynamic Metrics Cards (Subscribers, Views, WatchTime, Revenue) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Subscribers', type: 'Subscribers', icon: Users, delay: 0.1 },
              { title: 'Total Views', type: 'Views', icon: Eye, delay: 0.2 },
              { title: 'Watch Time', type: 'Watch Time', icon: Clock, delay: 0.3 },
              { title: 'Est. Revenue', type: 'Revenue', icon: DollarSign, delay: 0.4 }
            ].map((card) => {
              const stats = getMetricData(card.type);
              return (
                <StatCard 
                  key={card.title} 
                  title={card.title} 
                  value={stats.value} 
                  trend={stats.trend} 
                  trendValue={stats.trendValue} 
                  icon={card.icon} 
                  delay={card.delay} 
                  isLoading={isLoading} 
                />
              );
            })}
          </div>

          {/* SECTION 6: UPDATE GRAPHS (Growth Velocity) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main Graph Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="xl:col-span-2 bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 shadow-sm flex flex-col"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-1 flex items-center gap-2">
                    <BarChart2 size={22} className="text-[#FF1744]" />
                    Channel Growth Velocity
                  </h2>
                  <p className="text-[#666666] dark:text-[#A1A1AA] text-xs">Visualizing dynamic analytics from database records</p>
                </div>
                
                {/* Chart toggle tabs */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/10 shrink-0">
                  {['Views', 'Subscribers', 'Watch Time'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setChartTab(tab)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                        chartTab === tab 
                          ? 'bg-white dark:bg-[#2A2A35] text-[#FF1744] dark:text-[#FF3B3B] shadow-sm' 
                          : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 min-h-[300px] w-full relative">
                {isLoading ? (
                  <ChartSkeleton />
                ) : (user && (!activeChannel || activeChannel.id === 'mock-channel-id')) ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <AlertCircle className="text-gray-400 dark:text-gray-600 mb-3" size={32} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md font-semibold">
                      No analytics data available. Connect and sync a YouTube channel to begin.
                    </p>
                  </div>
                ) : chartData.length > 0 ? (
                  <>
                    {/* Custom Grid lines */}
                    <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
                      <div className="border-r border-black/5 dark:border-white/5 h-full" />
                      <div className="border-r border-black/5 dark:border-white/5 h-full" />
                      <div className="h-full" />
                    </div>
                    
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF1744" stopOpacity={0.3} className="dark:stopOpacity-40"/>
                            <stop offset="95%" stopColor="#FF1744" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          stroke="#888888" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          dy={10}
                        />
                        <YAxis 
                          stroke="#888888" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => formatStat(value)}
                          dx={-5}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(18,18,24,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', padding: '12px' }}
                          itemStyle={{ color: '#FF3B3B', fontWeight: 'bold' }}
                          labelStyle={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}
                          cursor={{ stroke: 'rgba(255,23,68,0.2)', strokeWidth: 2, strokeDasharray: '5 5' }}
                          formatter={(value) => [value.toLocaleString(), chartTab]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#FF1744" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                          animationDuration={1500}
                          className="drop-shadow-[0_0_10px_rgba(255,23,68,0.5)] dark:drop-shadow-[0_0_15px_rgba(255,59,59,0.8)]"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <AlertCircle className="text-gray-400 dark:text-gray-600 mb-3" size={32} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-4 font-semibold">
                      No analytics history found. Click Sync Analytics to load historical metrics.
                    </p>
                    {activeChannel && activeChannel.id !== 'mock-channel-id' && (
                      <button 
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="bg-gradient-to-r from-[#FF1744] to-[#E0002A] text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                        Sync Analytics
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-black/5 dark:border-white/[0.06]">
                {[
                  { label: 'AVG CTR', value: latestAnalytics ? `${latestAnalytics.ctr}%` : '6.8%' },
                  { label: 'ENGAGEMENT RATE', value: latestAnalytics ? `${latestAnalytics.engagement_rate}%` : '5.4%' },
                  { label: 'TOTAL VIDEOS', value: activeChannel ? formatStat(activeChannel.video_count) : '0' },
                  { label: 'EST. MONTHLY CPM', value: '$3.10', highlight: true }
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-2xl bg-black/5 dark:bg-white/5 transition-transform hover:scale-105 cursor-default ${stat.highlight ? 'bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10' : ''}`}>
                    <div className="text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase mb-2">{stat.label}</div>
                    <div className={`text-xl font-black ${stat.highlight ? 'text-[#FF1744] dark:text-[#FF3B3B]' : 'text-[#111111] dark:text-white'}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Activity Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 shadow-sm flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1744]/5 dark:bg-[#FF3B3B]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <h3 className="text-xs font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase mb-6 flex items-center gap-2">
                <Activity size={14} className="text-[#FF1744]" /> Live Activity
              </h3>
              
              <div className="flex-1 relative">
                <div className="absolute left-[7px] top-2 bottom-0 w-0.5 bg-gradient-to-b from-[#FF1744]/20 via-black/5 to-transparent dark:from-[#FF3B3B]/30 dark:via-white/5" />
                
                <div className="space-y-6">
                  {[
                    { time: '2 MINS AGO', title: 'Viral Velocity', desc: 'New video CTR climbing above 12%.', color: '#FF1744' },
                    { time: '25 MINS AGO', title: 'Subscribed Alert', desc: 'Subscriber velocity is trending up 15%.', color: '#00B4D8' },
                    { time: '1 HOUR AGO', title: 'Revenue Milestone', desc: 'Daily revenue target achieved.', color: '#A1A1AA' },
                    { time: '4 HOURS AGO', title: 'Daily Peak', desc: 'Views peaked at 3.2k/min.', color: '#FF1744' }
                  ].map((activity, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      key={i} 
                      className="relative pl-8 group cursor-default"
                    >
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white dark:bg-[#121218] border-2 flex items-center justify-center z-10 transition-transform group-hover:scale-125" style={{ borderColor: activity.color }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF1744]" />
                      </div>
                      
                      <div className="text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-wider uppercase mb-1">{activity.time}</div>
                      <div className="text-sm">
                        <span className="font-bold text-[#111111] dark:text-white mr-1">
                          {activity.title}
                        </span>
                        <span className="text-[#666666] dark:text-[#A1A1AA]">{activity.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row (Demographics & Top Performing Videos) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Demographics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 shadow-sm flex flex-col items-center relative overflow-hidden"
            >
              <div className="w-full text-left mb-4">
                 <h3 className="text-xl font-bold text-[#111111] dark:text-white">Audience Demographics</h3>
                 <p className="text-xs text-gray-500">Core viewer age distribution metrics</p>
              </div>
              
              <div className="relative w-64 h-64 mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        animationDuration={1000}
                      >
                        {demographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(18,18,24,0.9)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <div className="text-3xl font-black text-[#111111] dark:text-white">18-24</div>
                   <div className="text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase">Core Group</div>
                 </div>
              </div>
              
              <div className="w-full space-y-3">
                 {demographicData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <Circle size={10} fill={item.color} stroke="none" />
                         <span className="text-sm font-medium text-[#666666] dark:text-[#A1A1AA]">{item.name}</span>
                       </div>
                       <div className="text-sm font-bold text-[#111111] dark:text-white">{item.value}%</div>
                    </div>
                 ))}
              </div>
            </motion.div>

            {/* TOP PERFORMING VIDEOS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="lg:col-span-2 bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 shadow-sm flex flex-col"
            >
              <div className="mb-6">
                 <h3 className="text-xl font-bold text-[#111111] dark:text-white">Top Performing Videos</h3>
                 <p className="text-xs text-gray-500">Live statistics ordered by total view count</p>
              </div>
              
              <div className="w-full overflow-x-auto">
                {isLoading ? (
                  <TableSkeleton />
                ) : videos.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10">Video Content</th>
                        <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10 text-right">Views</th>
                        <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10 text-right">CTR</th>
                        <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10 text-right font-medium">Likes / Comments</th>
                        <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10 text-right">Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.slice(0, 5).map((video, i) => (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                          key={video.youtube_video_id || video.id} 
                          className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <td className="py-4 border-b border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-24 h-14 rounded-lg overflow-hidden relative shrink-0">
                                <img 
                                  src={video.thumbnail || 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=200&auto=format&fit=crop'} 
                                  alt={video.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#111111] dark:text-white mb-1 line-clamp-1 group-hover:text-[#FF1744] transition-colors">
                                  {video.title}
                                </div>
                                <div className="text-[10px] text-[#666] dark:text-[#A1A1AA]">
                                  Published: {new Date(video.published_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 border-b border-black/5 dark:border-white/5 text-right font-bold text-[#111111] dark:text-white">
                            {formatStat(video.views)}
                          </td>
                          <td className="py-4 border-b border-black/5 dark:border-white/5 text-right font-bold text-[#FF1744] dark:text-[#FF3B3B]">
                            {video.ctr}%
                          </td>
                          <td className="py-4 border-b border-black/5 dark:border-white/5 text-right text-[11px] text-gray-500 font-semibold">
                            {formatStat(video.likes)} / {formatStat(video.comments)}
                          </td>
                          <td className="py-4 border-b border-black/5 dark:border-white/5 text-right font-bold text-green-500">
                            {video.engagement_rate}%
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="w-full py-10 flex items-center justify-center text-xs text-gray-400">
                    No videos connected yet. Sync channel above to retrieve latest uploads.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* Onboarding Fullscreen Modal */}
      <AnimatePresence>
        {isOnboardingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#F8F9FA]/95 dark:bg-[#0B0B0F]/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#121218] border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-left"
            >
              <div className="absolute top-[-30%] right-[-30%] w-[300px] h-[300px] bg-[#FF1744]/10 dark:bg-[#FF3B3B]/5 rounded-full blur-[100px]" />
              
              {onboardingStep === 0 && (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600">
                      <YoutubeIcon size={24} />
                    </div>
                    {activeChannel && activeChannel.id !== 'mock-channel-id' && (
                      <button 
                        onClick={() => setIsOnboardingOpen(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">Connect Your YouTube Channel</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                    Enter your YouTube channel handle or channel URL. We'll automatically fetch your channel information, store analytics data and set up your dashboard.
                  </p>

                  <form onSubmit={handleOnboardingConnect} className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 font-semibold">
                        @
                      </span>
                      <input 
                        type="text"
                        required
                        value={onboardingInput}
                        onChange={(e) => setOnboardingInput(e.target.value)}
                        placeholder="carryminati or channel URL" 
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-3.5 pl-9 pr-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF1744]/20" 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={!onboardingInput.trim()}
                      className="w-full bg-[#FF1744] hover:bg-[#D90429] dark:bg-[#FF3B3B] dark:hover:bg-[#E62E2E] text-white py-3.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Connect Channel
                    </button>
                  </form>
                </>
              )}

              {onboardingStep >= 1 && onboardingStep <= 5 && (
                <div className="flex flex-col items-center py-6">
                  <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 mb-6">
                    <RefreshCw size={28} className="animate-spin" />
                  </div>

                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                    {onboardingStep === 1 && "🔍 Searching YouTube channel..."}
                    {onboardingStep === 2 && "📺 Fetching channel details..."}
                    {onboardingStep === 3 && "📊 Importing analytics..."}
                    {onboardingStep === 4 && "💾 Saving channel to database..."}
                    {onboardingStep === 5 && "🚀 Dashboard ready!"}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">
                    Please keep this window open while we configure your workspace
                  </p>

                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#FF1744] to-[#E0002A] dark:from-[#FF3B3B] dark:to-[#ff5555] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${onboardingProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                    {onboardingProgress}% Complete
                  </div>
                </div>
              )}

              {onboardingStep === 6 && (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 mb-6">
                    <AlertCircle size={28} />
                  </div>

                  <h3 className="text-lg font-bold text-[#FF1744] dark:text-[#FF3B3B] mb-2">Connection Failed</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                    {onboardingError || "Something went wrong while connecting your channel."}
                  </p>

                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => setOnboardingStep(0)}
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-black dark:text-white py-3 rounded-xl text-xs font-bold transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer animate-fade-in"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => setIsOnboardingOpen(false)}
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-black dark:text-white py-3 rounded-xl text-xs font-bold transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer animate-fade-in"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Debug Panel */}
      {import.meta.env.DEV && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/90 border border-[#FF3B3B]/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden mt-8"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={60} className="text-[#FF3B3B]" />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B3B] animate-pulse" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#FF3B3B]">Developer Debug Panel</h3>
              <p className="text-[10px] text-gray-400">Real-time telemetry & detailed stack trace logs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">API Endpoint Called</div>
              <div className="text-xs font-mono font-bold text-white truncate" title={inspectorData?.endpoint}>
                {inspectorData?.endpoint || '-'}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">HTTP Status</div>
              <div className={`text-sm font-mono font-bold ${
                inspectorData?.statusCode === 'Failed' || (typeof inspectorData?.statusCode === 'number' && inspectorData.statusCode >= 400)
                  ? 'text-[#FF3B3B]' 
                  : 'text-green-400'
              }`}>
                {inspectorData?.statusCode || '-'}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Last Successful Sync</div>
              <div className="text-xs font-mono font-bold text-white">
                {inspectorData?.lastSyncTime || 'Never'}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 mb-6">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Request Payload</div>
            <pre className="text-[10px] font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-[120px] bg-black/40 p-3 rounded-xl border border-white/5">
              {inspectorData?.payload || 'None'}
            </pre>
          </div>

          {inspectorData?.errorMessage && (
            <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4 space-y-3">
              <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Error Message</div>
              <div className="text-xs font-mono font-bold text-red-200 bg-red-950/40 p-3 rounded-xl border border-red-500/10">
                {inspectorData.errorMessage}
              </div>

              {inspectorData.stackTrace && (
                <>
                  <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider mt-2">Stack Trace</div>
                  <pre className="text-[10px] font-mono text-red-300/80 overflow-x-auto whitespace-pre bg-black/50 p-4 rounded-xl border border-red-500/10 max-h-[200px]">
                    {inspectorData.stackTrace}
                  </pre>
                </>
              )}
            </div>
          )}
        </motion.div>
      )}

    </div>
  );
};

export default Dashboard;
