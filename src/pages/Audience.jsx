import React from 'react';
import { motion } from 'framer-motion';
import AudienceHeader from '../components/audience/AudienceHeader';
import DemographicsCards from '../components/audience/DemographicsCards';
import RetentionLoyalty from '../components/audience/RetentionLoyalty';
import AudienceHeatmap from '../components/audience/AudienceHeatmap';
import SentimentEngine from '../components/audience/SentimentEngine';

const Audience = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1600px] mx-auto pb-12 relative"
    >
      {/* Background ambient lighting for the page */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF1744]/3 dark:bg-[#FF1744]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-purple-500/3 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <AudienceHeader />
      <DemographicsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RetentionLoyalty />
        </div>
        <div className="lg:col-span-1">
          <AudienceHeatmap />
        </div>
      </div>
      <SentimentEngine />
    </motion.div>
  );
};

export default Audience;
