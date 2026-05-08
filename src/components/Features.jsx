import React from 'react';
import { BarChart3, Bot, TrendingUp, Zap, Target, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BarChart3 className="text-brand-red" size={24} />,
      title: 'Precision Analytics',
      description: 'Deep-dive into video performance metrics with our proprietary tracking algorithms.'
    },
    {
      icon: <Bot className="text-brand-red" size={24} />,
      title: 'AI Sentiment',
      description: 'Automatically decode viewer emotions and feedback from thousands of comments in seconds.'
    },
    {
      icon: <TrendingUp className="text-brand-red" size={24} />,
      title: 'Retention Engine',
      description: 'Identify exactly where viewers drop off and get actionable tips to keep them watching.'
    },
    {
      icon: <Zap className="text-brand-red" size={24} />,
      title: 'Real-time Insights',
      description: 'Get instant feedback on your latest uploads and adjust your strategy on the fly.'
    },
    {
      icon: <Target className="text-brand-red" size={24} />,
      title: 'Competitor Tracking',
      description: 'Benchmark your channel against the top creators in your niche and find growth gaps.'
    },
    {
      icon: <Users className="text-brand-red" size={24} />,
      title: 'Audience Persona',
      description: 'AI-generated profiles of your most loyal viewers to help you tailor your content.'
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-4 block">Powerful Features</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Engineered for Exponential Growth</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-driven toolkit provides everything you need to dominate your niche and scale your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-10 hover:-translate-y-2 group">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
