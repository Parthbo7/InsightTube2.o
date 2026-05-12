import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { supabase, getProjects, createProject, getAnalyses, saveAnalysis } from '../lib/supabase';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid
} from 'recharts';
import { 
  TrendingUp, Users, Eye, Clock, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight, Circle
} from 'lucide-react';

// Mock Data
const performanceData = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 3800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 2800 },
  { name: 'Sat', value: 4800 },
  { name: 'Sun', value: 6800 },
];

const demographicData = [
  { name: 'Age 18-24', value: 70, color: '#FF1744' },
  { name: 'Age 25-34', value: 20, color: '#00B4D8' },
  { name: 'Other', value: 10, color: '#E0E0E0' },
];

const videosData = [
  { id: 1, title: '10 AI Trends You Can\'t Ign...', published: '2 days ago', views: '450.2k', ctr: '12.4%', engagement: '9.8/10', thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop' },
  { id: 2, title: 'The Future of Content Cre...', published: '5 days ago', views: '280.1k', ctr: '9.1%', engagement: '8.4/10', thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=200&auto=format&fit=crop' },
  { id: 3, title: 'Building the Ultimate Setup', published: '1 week ago', views: '1.2M', ctr: '15.2%', engagement: '9.9/10', thumb: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=200&auto=format&fit=crop' },
];

const liveActivity = [
  { id: 1, time: '2 MINS AGO', type: 'peak', title: 'New Peak', desc: 'Views reached 5k/min on latest upload.', color: '#FF1744' },
  { id: 2, time: '15 MINS AGO', type: 'sub', title: 'Subscribed', desc: 'TechGuru_99 and 24 others joined.', color: '#00B4D8' },
  { id: 3, time: '1 HOUR AGO', type: 'milestone', title: 'Revenue milestone', desc: '$1k daily goal achieved.', color: '#A1A1AA' },
  { id: 4, time: '3 HOURS AGO', type: 'alert', title: 'Viral Alert', desc: '"AI Trends" is trending in US #4.', color: '#FF1744' },
];

const StatCard = ({ title, value, trend, trendValue, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[#FF3B3B]/10 transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={80} className="text-[#FF1744] dark:text-[#FF3B3B] -rotate-12 translate-x-4 -translate-y-4" />
    </div>
    
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 flex items-center justify-center">
        <Icon size={20} className="text-[#FF1744] dark:text-[#FF3B3B]" />
      </div>
      <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'}`}>
        {trend === 'up' ? '+' : ''}{trendValue}
      </div>
    </div>
    
    <h3 className="text-sm font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">{title}</h3>
    <div className="text-3xl font-black text-[#111111] dark:text-white tracking-tight">{value}</div>
    
    <div className="mt-4 h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '75%' }}
        transition={{ duration: 1, delay: delay + 0.2 }}
        className="h-full bg-gradient-to-r from-[#FF1744] to-[#ff6b6b] dark:from-[#FF3B3B] dark:to-[#ff8e8e] rounded-full"
      />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [isSubmittingAnalysis, setIsSubmittingAnalysis] = useState(false);

  useEffect(() => {
    fetchData();

    // Set up Realtime subscriptions
    const projectSub = supabase.channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
        fetchData();
        toast.success('Projects updated in real-time');
      })
      .subscribe();

    const analysisSub = supabase.channel('public:youtube_analyses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'youtube_analyses' }, payload => {
        fetchData();
        toast.success('Analyses updated in real-time');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectSub);
      supabase.removeChannel(analysisSub);
    };
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [projData, anData] = await Promise.all([getProjects(), getAnalyses()]);
      setProjects(projData);
      setAnalyses(anData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsSubmittingProject(true);
    const form = e.target;
    const title = form.title.value;
    const desc = form.description.value;
    try {
      await createProject(title, desc);
      toast.success('Project created successfully');
      form.reset();
    } catch (error) {
      toast.error('Error creating project');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleSaveAnalysis = async (e) => {
    e.preventDefault();
    setIsSubmittingAnalysis(true);
    const form = e.target;
    const url = form.url.value;
    const summary = form.summary.value;
    try {
      await saveAnalysis(url, 'Sample transcript text', summary);
      toast.success('Analysis saved successfully');
      form.reset();
    } catch (error) {
      toast.error('Error saving analysis');
    } finally {
      setIsSubmittingAnalysis(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <Toaster position="top-right" />

      {/* Supabase MVP Operations Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Create Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-3">
            <input name="title" required placeholder="Project Title" className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF1744]/20" />
            <input name="description" placeholder="Description" className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF1744]/20" />
            <button disabled={isSubmittingProject} className="w-full bg-[#FF1744] text-white rounded-xl p-3 font-bold hover:bg-[#E0002A] transition-colors disabled:opacity-50">
              {isSubmittingProject ? 'Saving...' : 'Save Project'}
            </button>
          </form>
          
          <div className="mt-4 max-h-32 overflow-y-auto">
            {isLoading ? <div className="text-sm dark:text-white">Loading projects...</div> : 
             projects.map(p => (
               <div key={p.id} className="text-sm py-1 border-b border-black/5 dark:border-white/5 dark:text-[#A1A1AA]">
                 <strong className="dark:text-white">{p.title}</strong> - {p.description}
               </div>
             ))
            }
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Save Analysis</h3>
          <form onSubmit={handleSaveAnalysis} className="space-y-3">
            <input name="url" required placeholder="YouTube URL" className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF1744]/20" />
            <input name="summary" required placeholder="Summary" className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF1744]/20" />
            <button disabled={isSubmittingAnalysis} className="w-full bg-[#FF1744] text-white rounded-xl p-3 font-bold hover:bg-[#E0002A] transition-colors disabled:opacity-50">
              {isSubmittingAnalysis ? 'Saving...' : 'Save Analysis'}
            </button>
          </form>
        </motion.div>
      </div>

      
      {/* Top Row: Main Graph + Live Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Graph Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="xl:col-span-2 bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">Channel Performance<br/>Overview</h2>
              <p className="text-[#666666] dark:text-[#A1A1AA] text-sm">Real-time engagement velocity and reach</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase mb-1">Growth Velocity</div>
              <div className="text-3xl font-black text-[#FF1744] dark:text-[#FF3B3B]">+12.4%</div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full relative">
            {/* Custom Grid Background styling */}
            <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
              <div className="border-r border-black/5 dark:border-white/5 h-full" />
              <div className="border-r border-black/5 dark:border-white/5 h-full" />
              <div className="h-full" />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF1744" stopOpacity={0.3} className="dark:stopOpacity-40"/>
                    <stop offset="95%" stopColor="#FF1744" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(18,18,24,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', padding: '12px' }}
                  itemStyle={{ color: '#FF3B3B', fontWeight: 'bold' }}
                  cursor={{ stroke: 'rgba(255,23,68,0.2)', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FF1744" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                  className="drop-shadow-[0_0_10px_rgba(255,23,68,0.5)] dark:drop-shadow-[0_0_15px_rgba(255,59,59,0.8)]"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-black/5 dark:border-white/[0.06]">
            {[
              { label: 'AVG VIEW DURATION', value: '4:52' },
              { label: 'CTR', value: '8.2%' },
              { label: 'NEW SUBS', value: '+1,240' },
              { label: 'VIRAL SCORE', value: 'High', highlight: true }
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
              {liveActivity.map((activity, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  key={activity.id} 
                  className="relative pl-8 group cursor-default"
                >
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white dark:bg-[#121218] border-2 flex items-center justify-center z-10 transition-transform group-hover:scale-125" style={{ borderColor: activity.color }}>
                    {activity.type === 'peak' && <div className="w-1.5 h-1.5 rounded-full bg-[#FF1744] animate-pulse" />}
                  </div>
                  
                  <div className="text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-wider uppercase mb-1">{activity.time}</div>
                  <div className="text-sm">
                    <span className="font-bold text-[#111111] dark:text-white mr-1" style={{ color: activity.type === 'peak' || activity.type === 'alert' ? activity.color : undefined }}>
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Subscribers" value="482,901" trend="up" trendValue="2.4k" icon={Users} delay={0.1} />
        <StatCard title="Total Views" value="12.4M" trend="up" trendValue="120k" icon={Eye} delay={0.2} />
        <StatCard title="Watch Time" value="84.2k" trend="down" trendValue="1.2k" icon={Clock} delay={0.3} />
        <StatCard title="Revenue" value="$14,204" trend="up" trendValue="$840" icon={DollarSign} delay={0.4} />
      </div>

      {/* Bottom Row */}
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
                    animationDuration={1500}
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

        {/* Top Videos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2 bg-white/75 dark:bg-[#121218]/75 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-3xl p-8 shadow-sm flex flex-col"
        >
          <div className="mb-6">
             <h3 className="text-xl font-bold text-[#111111] dark:text-white">Top Performing Videos</h3>
          </div>
          
          <div className="w-full overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr>
                   <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10">Video Content</th>
                   <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10 text-right">Views</th>
                   <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10 text-right">CTR</th>
                   <th className="pb-4 text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase border-b border-black/5 dark:border-white/10 text-right">Engagement</th>
                 </tr>
               </thead>
               <tbody>
                 {(analyses.length > 0 ? analyses : videosData).slice(0, 5).map((video, i) => (
                   <motion.tr 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                     key={video.id} 
                     className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                   >
                     <td className="py-4 border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="w-24 h-14 rounded-lg overflow-hidden relative">
                              <img src={video.thumb || 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=200&auto=format&fit=crop'} alt={video.title || 'Video'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                           </div>
                           <div>
                              <div className="text-sm font-bold text-[#111111] dark:text-white mb-1 line-clamp-1">{video.summary || video.title}</div>
                              <div className="text-xs text-[#666666] dark:text-[#A1A1AA]">{video.video_url || video.published}</div>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 border-b border-black/5 dark:border-white/5 text-right font-semibold text-[#111111] dark:text-white">{video.views || '1K+'}</td>
                     <td className="py-4 border-b border-black/5 dark:border-white/5 text-right font-bold text-[#FF1744] dark:text-[#FF3B3B]">{video.ctr || '10%'}</td>
                     <td className="py-4 border-b border-black/5 dark:border-white/5 text-right font-medium text-[#666666] dark:text-[#A1A1AA]">{video.engagement || '9/10'}</td>
                   </motion.tr>
                 ))}
               </tbody>
             </table>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
