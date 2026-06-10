import React from 'react';
import { motion } from 'framer-motion';
import RevenueHeader from '../components/revenue/RevenueHeader';
import RevenueKPICards from '../components/revenue/RevenueKPICards';
import RevenuePerformanceChart from '../components/revenue/RevenuePerformanceChart';
import AIInsightSidebar from '../components/revenue/AIInsightSidebar';
import RevenueByVideo from '../components/revenue/RevenueByVideo';
import RevenueSourcesPanel from '../components/revenue/RevenueSourcesPanel';

const Revenue = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1600px] mx-auto pb-12"
    >
      <RevenueHeader />
      <RevenueKPICards />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <RevenuePerformanceChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueByVideo />
            <RevenueSourcesPanel />
          </div>
        </div>
        <div className="xl:col-span-1">
          <AIInsightSidebar />
        </div>
      </div>
    </motion.div>
  );
};

export default Revenue;
