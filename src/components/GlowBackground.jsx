import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const GlowBackground = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Create motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for main and offset glow
  const springConfigMain = { stiffness: 100, damping: 25, mass: 0.5 };
  const springConfigOffset = { stiffness: 50, damping: 30, mass: 1 };

  const mainX = useSpring(mouseX, springConfigMain);
  const mainY = useSpring(mouseY, springConfigMain);
  
  const offsetX = useSpring(mouseX, springConfigOffset);
  const offsetY = useSpring(mouseY, springConfigOffset);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isHovering) setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isHovering]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Static Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ea] dark:from-[#070707] dark:to-[#110505] transition-colors duration-500" />
      <div className="bg-grid" />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      {/* Ambient Spheres */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-red/5 dark:bg-brand-red/10 blur-[100px] -left-[150px] -bottom-[150px] animate-pulse" />
      <div className="absolute w-[800px] h-[800px] rounded-full bg-brand-red/5 dark:bg-brand-red/10 blur-[120px] -right-[200px] top-1/4 animate-pulse" />

      {/* Mouse Glows using Framer Motion */}
      <motion.div 
        className={`mouse-glow w-[500px] h-[500px] ${isHovering ? 'opacity-30 dark:opacity-40' : 'opacity-0'}`}
        style={{ 
          x: mainX, 
          y: mainY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,43,43,0.4) 0%, rgba(255,80,80,0.15) 35%, transparent 80%)'
        }}
      />
      <motion.div 
        className={`mouse-glow w-[650px] h-[650px] ${isHovering ? 'opacity-20 dark:opacity-20' : 'opacity-0'}`}
        style={{ 
          x: offsetX, 
          y: offsetY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,80,80,0.2) 0%, rgba(255,120,120,0.05) 40%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default GlowBackground;

