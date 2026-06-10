import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const PBAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-full right-0 mb-3 w-60 bg-white/90 dark:bg-[#121218]/90 backdrop-blur-xl border border-black/5 dark:border-white/[0.06] rounded-2xl p-4 shadow-xl dark:shadow-[0_15px_40px_-10px_rgba(255,23,68,0.12)]"
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-[#999] dark:text-[#666] hover:text-[#FF1744] dark:hover:text-[#FF3B3B] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X size={10} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#FF1744] dark:text-[#FF3B3B]" />
              <span className="text-xs font-bold text-[#111] dark:text-white">PB AI Assistant</span>
            </div>
            <p className="text-[11px] text-[#666] dark:text-[#A1A1AA] leading-relaxed">
              Need help analyzing your videos? I can suggest topics, optimize thumbnails, and boost your CTR!
            </p>
            <button className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold bg-gradient-to-r from-[#FF1744] to-[#E0002A] text-white shadow-lg shadow-[#FF1744]/25 hover:shadow-[#FF1744]/40 hover:-translate-y-0.5 active:scale-95 transition-all">
              <Sparkles size={10} />
              Start Chatting
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PB Character */}
      <div className="relative group">
        {/* Ambient glow pulse */}
        <div className="absolute inset-0 bg-[#FF1744]/15 dark:bg-[#FF3B3B]/20 blur-[30px] rounded-full animate-pulse pointer-events-none" />

        {/* Dismiss button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-[#1A1A24] border border-black/10 dark:border-white/10 flex items-center justify-center text-[#999] dark:text-[#666] hover:text-[#FF1744] dark:hover:text-[#FF3B3B] transition-colors opacity-0 group-hover:opacity-100 z-20 shadow-sm"
        >
          <X size={8} />
        </button>

        {/* Floating wrapper */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer relative"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAweeA3gFmPFFRk1_wkPUthYeAuAlKEgyVu9UBoby1zGu3vomGnJ50tPgqNX9jw1tAZkG5qHMjcKj225YEJaeb5cWhUzpxg0gDeU6D9mqHU91DmiyRserdiHp7iOjgU4DhbX9OU5a34Qks6ufpGzIVkUI7O_ngzyTJLlIKNgJlI2eprrNi4zvDtfk1Q8_vaYIhEOa6_seqVGmio_qfyJoONO9-T7oCFPd4DX5dLjoZcaWayzNbwbFvM_8epm6LZJfDW4yBfngVi27w"
            alt="PB AI Assistant"
            className="w-20 h-auto drop-shadow-xl group-hover:scale-110 group-active:scale-95 transition-transform duration-300"
          />
          {/* Shadow beneath character */}
          <div className="w-10 h-2 bg-black/10 dark:bg-black/30 blur-sm rounded-[100%] mx-auto mt-1" />
        </motion.div>
      </div>
    </div>
  );
};

export default PBAssistant;
