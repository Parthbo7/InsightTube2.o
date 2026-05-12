import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Settings as SettingsIcon, Bell, AlertTriangle, 
  Monitor, Smartphone, Moon, Sun, Menu, X, LogOut, Check, Camera,
  ChevronDown, Save, Plus, Link as LinkIcon, Trash2, Video, Globe, MessageCircle, Share2, Cast,
  Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  fetchUserProfile, updateUserProfile,
  fetchUserPreferences, updateUserPreferences,
  fetchSecuritySettings, updateSecuritySettings,
  getConnectedChannels, connectChannel, removeChannel
} from '../lib/supabase';

export default function Settings() {
  const { user, loading: authLoading, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // ... (states remain the same)
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('profile');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Form States
  const [profile, setProfile] = useState({ full_name: '', username: '', email: '', bio: '', website: '', country: 'United States' });
  const [preferences, setPreferences] = useState({ theme: 'dark', language: 'English (US)', auto_save: true, notifications_reports: true, notifications_ai_alerts: true, notifications_security: true });
  const [security, setSecurity] = useState({ two_factor_enabled: false });
  const [channels, setChannels] = useState([]);

  // Connect Channel State
  const [channelForm, setChannelForm] = useState({ name: '', url: '', platform: 'YouTube' });
  const [connectingChannel, setConnectingChannel] = useState(false);

  // Authentication protection
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to access settings');
      navigate('/');
      openAuthModal();
    }
  }, [user, authLoading, navigate, openAuthModal]);

  // Fetch initial data
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [prof, pref, sec, chans] = await Promise.all([
        fetchUserProfile(user.id).catch(() => null),
        fetchUserPreferences(user.id).catch(() => null),
        fetchSecuritySettings(user.id).catch(() => null),
        getConnectedChannels(user.id).catch(() => [])
      ]);
      
      if (prof) setProfile(prev => ({ ...prev, ...prof, email: user.email }));
      else setProfile(prev => ({ ...prev, email: user.email, full_name: user.user_metadata?.full_name || '' }));

      if (pref) {
        setPreferences(pref);
        setTheme(pref.theme);
      }
      
      if (sec) setSecurity(sec);
      if (chans) setChannels(chans);
    } catch (error) {
      toast.error('Failed to load settings data');
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = ['profile', 'channels', 'security', 'preferences', 'danger'];
      let current = 'profile';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= (el.offsetTop - 200)) {
          current = section;
        }
      }
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50) {
        current = 'danger';
      }
      setActiveTab(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateUserProfile(user.id, profile);
      toast.success('Profile updated successfully!', { iconTheme: { primary: '#FF1744', secondary: '#FFFFFF' } });
    } catch (e) {
      toast.error(e.message || 'Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePreference = async (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    if (key === 'theme') setTheme(value);

    try {
      await updateUserPreferences(user.id, newPrefs);
      if (preferences.auto_save && key !== 'theme') {
        toast.success('Preferences saved');
      }
    } catch (e) {
      toast.error('Error saving preferences');
    }
  };

  const handleUpdateSecurity = async (key, value) => {
    const newSec = { ...security, [key]: value };
    setSecurity(newSec);
    try {
      await updateSecuritySettings(user.id, newSec);
      toast.success('Security settings updated');
    } catch (e) {
      toast.error('Error saving security settings');
    }
  };

  const handleConnectChannel = async (e) => {
    e.preventDefault();
    if (!channelForm.url && !channelForm.name) {
      toast.error('Please enter a channel name or URL');
      return;
    }
    setConnectingChannel(true);
    try {
      const newChannel = await connectChannel(user.id, {
        channel_name: channelForm.name || channelForm.url,
        channel_url: channelForm.url,
        platform: channelForm.platform,
        connected: true
      });
      setChannels([newChannel, ...channels]);
      setChannelForm({ name: '', url: '', platform: 'YouTube' });
      toast.success(`${channelForm.platform} channel connected successfully!`);
    } catch (e) {
      toast.error(e.message || 'Error connecting channel');
    } finally {
      setConnectingChannel(false);
    }
  };

  const handleRemoveChannel = async (id) => {
    try {
      await removeChannel(id);
      setChannels(channels.filter(c => c.id !== id));
      toast.success('Channel disconnected');
    } catch (e) {
      toast.error('Error removing channel');
    }
  };

  const scrollToSection = (id) => {
    const actualId = id === 'notifications' ? 'preferences' : id;
    setActiveTab(id);
    const element = document.getElementById(actualId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0F] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FF1744]" size={48} />
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Profile', icon: User, id: 'profile' },
    { name: 'Channels', icon: Video, id: 'channels' },
    { name: 'Security', icon: Shield, id: 'security' },
    { name: 'Preferences', icon: SettingsIcon, id: 'preferences' },
    { name: 'Notifications', icon: Bell, id: 'notifications' },
    { name: 'Danger Zone', icon: AlertTriangle, id: 'danger' }
  ];

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'YouTube': return <Video size={18} className="text-[#FF0000]" />;
      case 'Instagram': return <Globe size={18} className="text-[#E1306C]" />;
      case 'Twitter/X': return <MessageCircle size={18} className="text-[#1DA1F2] dark:text-white" />;
      case 'LinkedIn': return <Share2 size={18} className="text-[#0A66C2]" />;
      case 'Twitch': return <Cast size={18} className="text-[#9146FF]" />;
      default: return <LinkIcon size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0F] text-[#111111] dark:text-[#F3F4F6] font-sans selection:bg-[#FF1744]/30 transition-colors duration-500">
      <Toaster position="bottom-right" />
      
      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF1744]/10 dark:bg-[#FF1744]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Top Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 dark:bg-[#0B0B0F]/70 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/dashboard" className="text-2xl font-black text-[#FF1744] tracking-tight relative group flex flex-col justify-center">
              InsightTube
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF1744] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
             <Link to="/dashboard" className="text-sm font-semibold text-[#555555] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white transition-colors">
               Back to Dashboard
             </Link>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#111111] to-[#333333] border-2 border-white dark:border-[#1A1A24] shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={logout}>
               <span className="text-white text-xs font-bold">{user?.user_metadata?.full_name?.substring(0,2)?.toUpperCase() || 'US'}</span>
             </div>
          </div>
          
          <button className="md:hidden text-[#111111] dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Main Layout Container */}
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 relative z-10 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar Menu */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="sticky top-32 flex flex-col gap-2 p-4 bg-white/50 dark:bg-[#121218]/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <div className="px-4 py-2 mb-2">
              <h3 className="text-3xl font-bold text-[#111111] dark:text-white tracking-tight">Settings</h3>
            </div>
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.id || (activeTab === 'preferences' && link.id === 'notifications');
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left w-full group ${isActive ? 'text-[#FF1744]' : 'text-[#555555] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-[#FF1744]/10 dark:bg-[#FF1744]/10 rounded-2xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isActive && (
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF1744] rounded-r-full shadow-[0_0_10px_#FF1744]" />
                  )}
                  <link.icon size={20} className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-semibold text-sm">{link.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 max-w-4xl flex flex-col gap-10">
           
           {/* PROFILE CARD */}
           <motion.section 
             id="profile"
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
             className="bg-white dark:bg-[#121218] border border-black/5 dark:border-white/5 rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group/card"
           >
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#FF1744]/5 to-transparent rounded-bl-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
             
             {loadingData ? (
               <div className="animate-pulse space-y-8">
                 <div className="flex gap-8"><div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div><div className="flex-1 py-2"><div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div><div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div></div></div>
                 <div className="grid grid-cols-2 gap-6"><div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div><div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div></div>
               </div>
             ) : (
               <>
                 <div className="flex flex-col md:flex-row gap-8 items-start mb-10 relative z-10">
                   <div className="relative group cursor-pointer flex-shrink-0">
                     <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#111111] to-[#333333] border-4 border-white dark:border-[#1A1A24] shadow-xl overflow-hidden relative">
                       {profile.avatar_url ? (
                         <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">{profile.full_name?.substring(0,1) || 'U'}</div>
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]">
                         <Camera className="text-white" size={24} />
                       </div>
                     </div>
                     <div className="absolute bottom-0 right-0 bg-[#FF1744] text-white p-1.5 rounded-full border-2 border-white dark:border-[#1A1A24] shadow-md hover:scale-110 transition-transform">
                        <Camera size={12} />
                     </div>
                   </div>
                   <div className="flex-1 pt-2">
                     <h2 className="text-2xl font-bold mb-1 text-[#111111] dark:text-white">Profile Information</h2>
                     <p className="text-[#666666] dark:text-[#A1A1AA] text-sm">Update your photo and personal details.</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="group relative">
                      <input type="text" id="fullname" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="peer w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl px-4 pt-6 pb-2 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] dark:focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all" placeholder=" " />
                      <label htmlFor="fullname" className={`absolute text-[11px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] duration-300 transform top-4 z-10 origin-[0] left-4 ${profile.full_name ? 'scale-75 -translate-y-3' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0'} peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#FF1744]`}>Full Name</label>
                    </div>
                    <div className="group relative">
                      <input type="text" id="username" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} className="peer w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl px-4 pt-6 pb-2 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] dark:focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all" placeholder=" " />
                      <label htmlFor="username" className={`absolute text-[11px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] duration-300 transform top-4 z-10 origin-[0] left-4 ${profile.username ? 'scale-75 -translate-y-3' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0'} peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#FF1744]`}>Username</label>
                    </div>
                    <div className="group md:col-span-2 relative">
                      <input type="email" id="email" value={profile.email} disabled className="peer w-full bg-gray-50 dark:bg-[#0B0B0F]/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 pt-6 pb-2 text-sm font-medium text-gray-500 cursor-not-allowed transition-all" placeholder=" " />
                      <label htmlFor="email" className={`absolute text-[11px] font-bold uppercase tracking-wider text-gray-500 duration-300 transform top-4 z-10 origin-[0] left-4 scale-75 -translate-y-3`}>Email Address (Read-only)</label>
                    </div>
                    <div className="group md:col-span-2 relative">
                      <textarea id="bio" rows="3" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} className="peer w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl px-4 pt-6 pb-2 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] dark:focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all resize-none" placeholder=" "></textarea>
                      <label htmlFor="bio" className={`absolute text-[11px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] duration-300 transform top-4 z-10 origin-[0] left-4 ${profile.bio ? 'scale-75 -translate-y-3' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0'} peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#FF1744]`}>Bio</label>
                    </div>
                    <div className="group relative">
                      <input type="url" id="website" value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} className="peer w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl px-4 pt-6 pb-2 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] dark:focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all" placeholder=" " />
                      <label htmlFor="website" className={`absolute text-[11px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] duration-300 transform top-4 z-10 origin-[0] left-4 ${profile.website ? 'scale-75 -translate-y-3' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0'} peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#FF1744]`}>Website</label>
                    </div>
                    <div className="group relative">
                      <select id="country" value={profile.country || 'United States'} onChange={e => setProfile({...profile, country: e.target.value})} className="peer w-full appearance-none bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl px-4 pt-6 pb-2 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] dark:focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all cursor-pointer">
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>India</option>
                        <option>Germany</option>
                      </select>
                      <label htmlFor="country" className="absolute text-[11px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-[#FF1744]">Country</label>
                      <div className="absolute right-4 top-5 pointer-events-none text-[#666666] dark:text-[#A1A1AA]">
                         <ChevronDown size={16} />
                      </div>
                    </div>
                 </div>

                 <div className="mt-8 flex justify-end relative z-10">
                   <button onClick={handleSaveProfile} disabled={savingProfile} className="relative group overflow-hidden rounded-xl bg-[#FF1744] hover:bg-[#E0002A] px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(255,23,68,0.3)] hover:shadow-[0_0_25px_rgba(255,23,68,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                     <span className="relative z-10">{savingProfile ? 'Saving...' : 'Save Changes'}</span>
                     {!savingProfile && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />}
                   </button>
                 </div>
               </>
             )}
           </motion.section>

           {/* CONNECT CHANNEL CARD */}
           <motion.section 
             id="channels"
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
             className="bg-white dark:bg-[#121218] border border-black/5 dark:border-white/5 rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden"
           >
             <h2 className="text-2xl font-bold mb-1 text-[#111111] dark:text-white">Connect Channel</h2>
             <p className="text-[#666666] dark:text-[#A1A1AA] text-sm mb-8">Connect your creator channel to start AI analytics.</p>
             
             <form onSubmit={handleConnectChannel} className="bg-[#F5F5F7]/80 dark:bg-[#1A1A24]/50 border border-transparent rounded-2xl p-6 mb-8 shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                 <div className="md:col-span-4 relative">
                   <label className="block text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">Platform</label>
                   <div className="relative">
                     <select value={channelForm.platform} onChange={e => setChannelForm({...channelForm, platform: e.target.value})} className="w-full appearance-none bg-white dark:bg-[#121218] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all cursor-pointer">
                       <option>YouTube</option>
                       <option>Instagram</option>
                       <option>TikTok</option>
                       <option>Twitch</option>
                       <option>LinkedIn</option>
                       <option>Twitter/X</option>
                     </select>
                     <div className="absolute left-3 top-3 pointer-events-none">
                       {getPlatformIcon(channelForm.platform)}
                     </div>
                     <div className="absolute right-4 top-3.5 pointer-events-none text-[#666666] dark:text-[#A1A1AA]">
                        <ChevronDown size={14} />
                     </div>
                   </div>
                 </div>
                 <div className="md:col-span-8 relative">
                   <label className="block text-[10px] font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">Channel URL or Name</label>
                   <div className="flex gap-3">
                     <input type="text" value={channelForm.url} onChange={e => setChannelForm({...channelForm, url: e.target.value})} className="w-full bg-white dark:bg-[#121218] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all" placeholder="e.g. https://youtube.com/@insighttube" />
                     <button type="submit" disabled={connectingChannel} className="flex-shrink-0 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-gray-200 px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-black/10 dark:shadow-white/10 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                       {connectingChannel ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                       <span>Connect</span>
                     </button>
                   </div>
                 </div>
               </div>
             </form>

             <div>
               <h4 className="font-bold text-[11px] tracking-widest uppercase text-[#666666] dark:text-[#A1A1AA] mb-4">Connected Channels</h4>
               {loadingData ? (
                 <div className="animate-pulse h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
               ) : channels.length === 0 ? (
                 <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                   <p className="text-sm text-[#666666] dark:text-[#A1A1AA]">No channels connected yet.</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   <AnimatePresence>
                     {channels.map((channel) => (
                       <motion.div 
                         key={channel.id}
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#1A1A24] border border-gray-200 dark:border-white/5 shadow-sm relative group hover:-translate-y-1 transition-transform overflow-hidden"
                       >
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2A2A35] flex items-center justify-center">
                             {getPlatformIcon(channel.platform)}
                           </div>
                           <div>
                             <p className="font-bold text-sm text-[#111111] dark:text-white flex items-center gap-2">
                               {channel.channel_name} 
                               {channel.connected && <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" title="Connected"></span>}
                             </p>
                             <p className="text-[11px] text-[#666666] dark:text-[#A1A1AA] mt-0.5 truncate max-w-[200px] md:max-w-xs">{channel.channel_url}</p>
                           </div>
                         </div>
                         <button onClick={() => handleRemoveChannel(channel.id)} className="opacity-0 group-hover:opacity-100 p-2 text-[#666666] hover:text-[#FF1744] hover:bg-[#FF1744]/10 rounded-lg transition-all" title="Remove Channel">
                           <Trash2 size={16} />
                         </button>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
               )}
             </div>
           </motion.section>

           {/* SECURITY CARD */}
           <motion.section 
             id="security"
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
             className="bg-white dark:bg-[#121218] border border-black/5 dark:border-white/5 rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group/card"
           >
             <h2 className="text-2xl font-bold mb-1 text-[#111111] dark:text-white">Security</h2>
             <p className="text-[#666666] dark:text-[#A1A1AA] text-sm mb-8">Manage your password and account protection.</p>
             
             <div className="space-y-6">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F5F5F7]/80 dark:bg-[#1A1A24]/50 border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-white dark:bg-[#2A2A35] shadow-sm flex items-center justify-center text-[#FF1744]">
                     <Shield size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-sm text-[#111111] dark:text-white">Password</h4>
                     <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-0.5">Change your account password securely.</p>
                   </div>
                 </div>
                 <button className="text-sm font-bold text-[#FF1744] hover:text-[#E0002A] transition-colors self-start sm:self-auto px-4 py-2 hover:bg-[#FF1744]/10 rounded-lg whitespace-nowrap overflow-hidden relative">
                   <span className="relative z-10">Reset via Email</span>
                 </button>
               </div>

               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F5F5F7]/80 dark:bg-[#1A1A24]/50 border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-white dark:bg-[#2A2A35] shadow-sm flex items-center justify-center text-[#FF1744]">
                     <Smartphone size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-sm text-[#111111] dark:text-white">Two-Factor Authentication</h4>
                     <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-0.5">Add an extra layer of security to your account.</p>
                   </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                   <input type="checkbox" className="sr-only peer" checked={security.two_factor_enabled} onChange={(e) => handleUpdateSecurity('two_factor_enabled', e.target.checked)} />
                   <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF1744]"></div>
                 </label>
               </div>
               
               <div className="pt-4">
                 <h4 className="font-bold text-[11px] tracking-widest uppercase text-[#666666] dark:text-[#A1A1AA] mb-4">Active Sessions</h4>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#1A1A24] border border-[#FF1744]/30 shadow-sm relative group hover:-translate-y-1 transition-transform cursor-default">
                     <div className="flex items-center gap-4">
                       <Monitor className="text-[#111111] dark:text-white" size={20} />
                       <div>
                         <p className="font-bold text-sm text-[#111111] dark:text-white">Current Session</p>
                         <p className="text-[11px] text-[#10B981] font-bold mt-0.5 uppercase tracking-wide">Active Now</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               <button onClick={logout} className="w-full mt-4 py-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-[#666666] dark:text-[#A1A1AA] font-semibold text-sm hover:border-[#FF1744] hover:text-[#FF1744] hover:bg-[#FF1744]/5 transition-all">
                 Logout
               </button>
             </div>
           </motion.section>

           {/* PREFERENCES CARD */}
           <motion.section 
             id="preferences"
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
             className="bg-white dark:bg-[#121218] border border-black/5 dark:border-white/5 rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden"
           >
             <h2 className="text-2xl font-bold mb-1 text-[#111111] dark:text-white">Preferences</h2>
             <p className="text-[#666666] dark:text-[#A1A1AA] text-sm mb-8">Tailor your InsightTube experience.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h4 className="block text-[11px] font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-3">Visual Theme</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => handleUpdatePreference('theme', 'light')}
                     className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-[#FF1744] bg-[#FF1744]/5' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
                   >
                     <Sun size={24} className={theme === 'light' ? 'text-[#FF1744] mb-3' : 'text-[#666666] dark:text-[#A1A1AA] mb-3'} />
                     <span className={`text-sm font-bold ${theme === 'light' ? 'text-[#FF1744]' : 'text-[#111111] dark:text-white'}`}>Light Mode</span>
                   </button>
                   <button 
                     onClick={() => handleUpdatePreference('theme', 'dark')}
                     className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-[#FF1744] bg-[#FF1744]/5' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
                   >
                     <Moon size={24} className={theme === 'dark' ? 'text-[#FF1744] mb-3' : 'text-[#666666] dark:text-[#A1A1AA] mb-3'} />
                     <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#FF1744]' : 'text-[#111111] dark:text-white'}`}>Dark Mode</span>
                   </button>
                 </div>
               </div>
               
               <div className="flex flex-col justify-between">
                 <div>
                   <h4 className="block text-[11px] font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-3">Language</h4>
                   <div className="relative">
                     <select value={preferences.language} onChange={e => handleUpdatePreference('language', e.target.value)} className="w-full appearance-none bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3.5 text-sm font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#FF1744] dark:focus:border-[#FF1744] focus:ring-1 focus:ring-[#FF1744] transition-all cursor-pointer">
                       <option>English (US)</option>
                       <option>Spanish</option>
                       <option>French</option>
                       <option>German</option>
                     </select>
                     <div className="absolute right-4 top-4 pointer-events-none text-[#666666] dark:text-[#A1A1AA]">
                        <ChevronDown size={16} />
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between mt-6 bg-[#F5F5F7]/80 dark:bg-[#1A1A24]/50 p-4 rounded-xl">
                   <span className="font-bold text-sm text-[#111111] dark:text-white">Auto-save changes</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={preferences.auto_save} onChange={(e) => handleUpdatePreference('auto_save', e.target.checked)} />
                     <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF1744]"></div>
                   </label>
                 </div>
               </div>
             </div>

             <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5">
                <h4 className="block text-[11px] font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-wider mb-4">Notifications</h4>
                <div className="space-y-2">
                  {[
                    { key: 'notifications_reports', title: "Video Analysis Reports", desc: "Weekly summaries of your performance." },
                    { key: 'notifications_ai_alerts', title: "AI Insight Alerts", desc: "Real-time tips while processing content." },
                    { key: 'notifications_security', title: "Account Security", desc: "Important alerts about login activity." }
                  ].map((notif, i) => (
                    <label key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A24]/50 transition-colors cursor-pointer group">
                      <div>
                        <h5 className="font-bold text-sm text-[#111111] dark:text-white">{notif.title}</h5>
                        <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-0.5">{notif.desc}</p>
                      </div>
                      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 ml-4">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer checked:bg-[#FF1744] checked:border-[#FF1744] transition-all" checked={preferences[notif.key]} onChange={(e) => handleUpdatePreference(notif.key, e.target.checked)} />
                        <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                      </div>
                    </label>
                  ))}
                </div>
             </div>
           </motion.section>

           {/* DANGER ZONE */}
           <motion.section 
             id="danger"
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
             className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-[28px] p-8 relative overflow-hidden"
           >
             <div className="flex items-center gap-3 mb-2">
               <AlertTriangle className="text-[#FF1744]" size={24} />
               <h2 className="text-2xl font-bold text-[#FF1744] dark:text-[#FF3B3B]">Danger Zone</h2>
             </div>
             <p className="text-red-600/80 dark:text-red-400/80 text-sm font-semibold mb-8">Irreversible actions for your account.</p>
             
             <div className="bg-white dark:bg-[#121218] border border-red-100 dark:border-red-900/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div>
                 <h4 className="font-bold text-sm text-[#111111] dark:text-white">Delete Account</h4>
                 <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-1">Once you delete your account, there is no going back. All your data, transcriptions, and AI models will be permanently erased.</p>
               </div>
               <button className="flex-shrink-0 bg-gradient-to-r from-[#FF1744] to-[#B9001D] hover:from-[#E0002A] hover:to-[#960017] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-0.5 active:scale-95 transition-all">
                 Delete Permanently
               </button>
             </div>
           </motion.section>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#0B0B0F]/50 backdrop-blur-md relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-extrabold text-[#111111] dark:text-white tracking-tight mb-4">InsightTube</div>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] leading-relaxed pr-4">Precision Analytics for Creators. Leverage AI to dominate your niche with data-driven content strategy.</p>
          </div>
          <div>
            <h4 className="font-bold text-[#111111] dark:text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-xs text-[#666666] dark:text-[#A1A1AA] hover:text-[#FF1744] transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-xs text-[#666666] dark:text-[#A1A1AA] hover:text-[#FF1744] transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#111111] dark:text-white mb-4 text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/docs" className="text-xs text-[#666666] dark:text-[#A1A1AA] hover:text-[#FF1744] transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#111111] dark:text-white mb-4 text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-xs text-[#666666] dark:text-[#A1A1AA] hover:text-[#FF1744] transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-xs text-[#666666] dark:text-[#A1A1AA] hover:text-[#FF1744] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
