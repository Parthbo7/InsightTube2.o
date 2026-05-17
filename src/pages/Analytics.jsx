import React from 'react';
import { motion } from 'framer-motion';
import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import KPICards from '../components/analytics/KPICards';
import ViewsChart from '../components/analytics/ViewsChart';
import RightSidebar from '../components/analytics/RightSidebar';
import AIInsightCards from '../components/analytics/AIInsightCards';
import CompetitorSpy from '../components/analytics/CompetitorSpy';

const Analytics = () => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-0 pb-20 relative">
      {/* Floating ambient particles - dark mode only */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#FF1744]/30"
            style={{ left: `${15 + i * 15}%`, top: `${20 + i * 12}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <AnalyticsHeader />
        <KPICards />

        {/* Main chart + Right sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          <div className="xl:col-span-2">
            <ViewsChart />
          </div>
          <div>
            <RightSidebar />
          </div>
        </div>

        <AIInsightCards />
        <CompetitorSpy />
      </div>
    </div>
  );
};

export default Analytics;
