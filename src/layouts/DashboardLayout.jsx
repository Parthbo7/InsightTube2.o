import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart2, 
  Video, 
  Users, 
  DollarSign, 
  Cpu, 
  Settings, 
  PlusCircle,
  Search,
  Bell,
  Sun,
  Moon,
  Bot
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },
    { name: 'Videos', icon: Video, path: '/dashboard/videos' },
    { name: 'Audience', icon: Users, path: '/dashboard/audience' },
    { name: 'Revenue', icon: DollarSign, path: '/dashboard/revenue' },
    { name: 'AI Tools', icon: Cpu, path: '/dashboard/ai-tools' },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 border-r border-black/5 dark:border-white/[0.06] bg-[#F5F5F7]/80 dark:bg-[#0B0B0F]/80 backdrop-blur-2xl flex flex-col z-40 transition-colors duration-500">
      <div className="p-6">
        <Link to="/" className="flex flex-col gap-1">
          <span className="text-2xl font-black text-[#FF1744] dark:text-[#FF3B3B] tracking-tight">InsightTube</span>
          <span className="text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] tracking-widest uppercase">AI Command Center</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className="relative group px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-300"
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#FF1744]/10 dark:bg-[#FF3B3B]/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={20} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-[#FF1744] dark:text-[#FF3B3B]' : 'text-[#666666] dark:text-[#A1A1AA] group-hover:text-[#111111] dark:group-hover:text-white'}`} />
              <span className={`relative z-10 font-medium text-sm transition-colors duration-300 ${isActive ? 'text-[#FF1744] dark:text-[#FF3B3B]' : 'text-[#666666] dark:text-[#A1A1AA] group-hover:text-[#111111] dark:group-hover:text-white'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        <div className="mt-auto pt-8 flex flex-col gap-2">
          <Link to="/dashboard/settings" className="relative group px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5">
            <Settings size={20} className="text-[#666666] dark:text-[#A1A1AA] group-hover:text-[#111111] dark:group-hover:text-white transition-colors" />
            <span className="font-medium text-sm text-[#666666] dark:text-[#A1A1AA] group-hover:text-[#111111] dark:group-hover:text-white transition-colors">Settings</span>
          </Link>
          
          <button className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF1744] to-[#E0002A] dark:from-[#FF3B3B] dark:to-[#FF1744] text-white px-4 py-3.5 rounded-xl font-semibold shadow-lg shadow-[#FF1744]/25 hover:shadow-[#FF1744]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 relative overflow-hidden group">
             <span className="relative z-10 flex items-center gap-2">
               <PlusCircle size={18} />
               New Analysis
             </span>
             <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TopNav = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [activeDateTab, setActiveDateTab] = useState('7 Days');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const dateTabs = ['7 Days', '30 Days', '90 Days', '1 Year'];

  return (
    <div className="h-20 ml-64 fixed top-0 right-0 left-0 bg-[#F5F5F7]/80 dark:bg-[#0B0B0F]/80 backdrop-blur-2xl border-b border-black/5 dark:border-white/[0.06] z-30 px-8 flex items-center justify-between transition-colors duration-500">
      
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] dark:text-[#A1A1AA] group-focus-within:text-[#FF1744] dark:group-focus-within:text-[#FF3B3B] transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="w-full bg-white/50 dark:bg-[#121218]/50 border border-black/5 dark:border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-[#111111] dark:text-white placeholder-[#666666] dark:placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#FF1744]/20 transition-all shadow-sm"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-white/40 dark:bg-[#121218]/40 p-1 rounded-full border border-black/5 dark:border-white/[0.06]">
          {dateTabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveDateTab(tab)}
              className="relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors"
            >
              {activeDateTab === tab && (
                <motion.div 
                  layoutId="date-tab-active"
                  className="absolute inset-0 bg-white dark:bg-[#2A2A35] rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${activeDateTab === tab ? 'text-[#FF1744] dark:text-[#FF3B3B]' : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'}`}>
                {tab}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white relative overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </AnimatePresence>
        </button>

        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF1744] rounded-full border-2 border-[#F5F5F7] dark:border-[#0B0B0F]" />
        </button>

        <button className="flex items-center gap-2 bg-white/60 dark:bg-[#121218]/60 border border-black/5 dark:border-white/[0.06] px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-[#1A1A24] transition-all">
          <Bot size={16} className="text-[#FF1744] dark:text-[#FF3B3B]" />
          <span className="text-sm font-semibold text-[#111111] dark:text-white">AI Assistant</span>
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#111111] to-[#333333] dark:from-[#333333] dark:to-[#555555] border-2 border-white dark:border-[#1A1A24] shadow-sm ml-2 overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
           {/* Placeholder for avatar */}
           <span className="text-white text-xs font-bold">JD</span>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B0B0F] transition-colors duration-500 font-sans text-[#111111] dark:text-white">
      <Sidebar />
      <TopNav />
      <main className="ml-64 pt-20 p-8 min-h-screen relative z-10">
        <Outlet />
      </main>
      
      {/* Dark mode cinematic background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF3B3B]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] bg-[#FF3B3B]/5 rounded-full blur-[120px] translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
      </div>
    </div>
  );
};

export default DashboardLayout;
