import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Globe } from 'lucide-react';

const DemographicsCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    
    {/* Age Groups */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/80 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#FF1744]/5 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1744]/5 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-[10px] font-bold text-[#111] dark:text-white uppercase tracking-wider">Age Groups</h3>
        <div className="w-8 h-8 rounded-full bg-[#FF1744]/10 flex items-center justify-center">
          <User size={14} className="text-[#FF1744]" />
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-3xl font-black text-[#111] dark:text-white">18—24</span>
          <span className="text-sm font-bold text-[#888] dark:text-[#A1A1AA] mb-1">(42%)</span>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="w-full flex gap-1">
             <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} transition={{ duration: 1, delay: 0.3 }} className="h-2 rounded-full bg-gradient-to-r from-[#FF1744] to-[#E0002A]" />
             <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 flex-1" />
          </div>
          <div className="w-full flex gap-1">
             <motion.div initial={{ width: 0 }} animate={{ width: '28%' }} transition={{ duration: 1, delay: 0.4 }} className="h-2 rounded-full bg-[#111] dark:bg-white/20" />
             <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 flex-1" />
          </div>
          <div className="w-full flex gap-1">
             <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 1, delay: 0.5 }} className="h-2 rounded-full bg-[#111]/60 dark:bg-white/10" />
             <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 flex-1" />
          </div>
        </div>
      </div>
    </motion.div>

    {/* Gender Split */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#FF1744]/5 transition-all duration-300 flex flex-col"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1744]/5 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-[10px] font-bold text-[#111] dark:text-white uppercase tracking-wider">Gender Split</h3>
        <div className="w-8 h-8 rounded-full bg-[#FF1744]/10 flex items-center justify-center">
          <Users size={14} className="text-[#FF1744]" />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <div className="text-xl font-black text-[#111] dark:text-white mb-1">Non-Binary <span className="text-[#888] dark:text-[#A1A1AA] text-sm">Growing</span></div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Male Ring */}
           <div className="relative w-14 h-14 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-black/5 dark:text-white/5" />
               <motion.circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150.7" strokeDashoffset={150.7 - (150.7 * 0.64)} strokeLinecap="round" className="text-[#FF1744]" initial={{ strokeDashoffset: 150.7 }} animate={{ strokeDashoffset: 150.7 - (150.7 * 0.64) }} transition={{ duration: 1.5, delay: 0.5 }} />
             </svg>
             <span className="absolute text-xs font-bold text-[#111] dark:text-white">64%</span>
           </div>
           
           {/* Female Ring */}
           <div className="relative w-12 h-12 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-black/5 dark:text-white/5" />
               <motion.circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * 0.31)} strokeLinecap="round" className="text-[#111] dark:text-[#888]" initial={{ strokeDashoffset: 125.6 }} animate={{ strokeDashoffset: 125.6 - (125.6 * 0.31) }} transition={{ duration: 1.5, delay: 0.6 }} />
             </svg>
             <span className="absolute text-[10px] font-bold text-[#111] dark:text-white">31%</span>
           </div>

           {/* Non-Binary Ring */}
           <div className="relative w-10 h-10 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-black/5 dark:text-white/5" />
               <motion.circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="100.5" strokeDashoffset={100.5 - (100.5 * 0.05)} strokeLinecap="round" className="text-[#111]/40 dark:text-[#666]" initial={{ strokeDashoffset: 100.5 }} animate={{ strokeDashoffset: 100.5 - (100.5 * 0.05) }} transition={{ duration: 1.5, delay: 0.7 }} />
             </svg>
             <span className="absolute text-[9px] font-bold text-[#111] dark:text-white">5%</span>
           </div>
        </div>
      </div>
    </motion.div>

    {/* Top Geography */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/80 dark:bg-[rgba(17,24,39,0.72)] backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#FF1744]/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-[10px] font-bold text-[#111] dark:text-white uppercase tracking-wider">Top Geography</h3>
        <div className="w-8 h-8 rounded-full bg-[#FF1744]/10 flex items-center justify-center">
          <Globe size={14} className="text-[#FF1744]" />
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <div className="flex items-end gap-2 mb-4">
          <span className="text-2xl font-black text-[#111] dark:text-white">India</span>
          <span className="text-xs font-bold text-[#888] dark:text-[#A1A1AA] mb-1">#1 Hub</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666] dark:text-[#A1A1AA]">Mumbai, IN</span>
            <span className="text-xs font-bold text-[#FF1744]">24.2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666] dark:text-[#A1A1AA]">New York, US</span>
            <span className="text-xs font-bold text-[#111] dark:text-white">18.5%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666] dark:text-[#A1A1AA]">London, UK</span>
            <span className="text-xs font-bold text-[#111] dark:text-white">9.1%</span>
          </div>
        </div>
      </div>
      
      {/* Background glow illusion for geography map */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FF1744]/10 rounded-full blur-[40px] pointer-events-none" />
    </motion.div>
  </div>
);

export default DemographicsCards;
