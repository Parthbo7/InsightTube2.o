import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, BarChart3, PlayCircle } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Hero = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 overflow-hidden">
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] hidden lg:flex items-center gap-2 px-4 py-2 glass-card rounded-full"
      >
        <TrendingUp size={18} className="text-brand-red" />
        <span className="text-sm font-semibold">+142% Growth</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[30%] right-[15%] hidden lg:flex items-center gap-2 px-4 py-2 glass-card rounded-full"
      >
        <BarChart3 size={18} className="text-brand-red" />
        <span className="text-sm font-semibold">Retention Optimized</span>
      </motion.div>

      <div className="max-w-5xl mx-auto relative z-10 w-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: "1000px" }}>
        
        {/* Glow behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-red/10 dark:bg-brand-red/20 blur-[100px] rounded-full pointer-events-none -z-10" />

        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md mb-8 mx-auto hover:bg-white/80 dark:hover:bg-white/5 transition-colors cursor-default"
          >
            <Sparkles size={16} className="text-brand-red" />
            <span className="text-sm font-medium text-[#555555] dark:text-gray-300">Introducing InsightTube 2.0</span>
          </motion.div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter relative" style={{ transform: "translateZ(50px)" }}>
            <span className="bg-gradient-to-br from-[#ff2b2b] via-[#ff4d4d] to-[#cc0000] bg-clip-text text-transparent relative drop-shadow-sm">
              InsightTube
            </span>
          </h1>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-[#111111] dark:text-white" style={{ transform: "translateZ(30px)" }}>
            AI That Engineers <br className="hidden md:block" />
            <span className="relative">
              Your YouTube Growth.
              <motion.div
                initial={{ opacity: 0, width: "0%" }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-brand-red to-transparent rounded-full"
              />
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-[#555555] dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed" style={{ transform: "translateZ(20px)" }}>
            Deploy precision analytics and machine learning to decode viewer behavior. 
            Optimize retention and supercharge your channel growth with the industry's most powerful AI toolkit.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20" style={{ transform: "translateZ(40px)" }}>
            <Link to="/signup" className="btn-primary text-lg !px-8 !py-4 flex items-center gap-2 group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Button Shimmer */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            </Link>
            <Link to="/demo" className="glass-card !border-black/10 dark:!border-white/10 hover:!bg-white dark:hover:!bg-white/5 text-[#111111] dark:text-white font-semibold text-lg !px-8 !py-4 rounded-xl flex items-center gap-2 transition-all group">
              <PlayCircle size={24} className="text-brand-red group-hover:scale-110 transition-transform" />
              Watch Demo
            </Link>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </section>
  );
};

export default Hero;
