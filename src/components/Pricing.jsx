import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);
  const { openAuthModal } = useAuth();

  const plans = [
    {
      name: 'Free',
      desc: 'Essential tools for new creators',
      price: isYearly ? 0 : 0,
      features: [
        'Basic Channel Analytics',
        '5 Video Analyses per month',
        'Standard AI Sentiment',
        'Community Access'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      desc: 'Advanced growth tools for serious creators',
      price: isYearly ? 47 : 59,
      features: [
        'Precision AI Analytics',
        'Unlimited Video Analyses',
        'Advanced Retention Insights',
        'Priority Creator Support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Agency',
      desc: 'Enterprise-scale solutions for teams',
      price: isYearly ? 239 : 299,
      features: [
        'Multi-Channel Management',
        'Custom AI Sentiment Models',
        'White-label Performance Reports',
        'Dedicated Account Manager'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section className="py-24 px-6 relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your needs. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded-full p-1 relative transition-colors duration-300 hover:border-brand-red/50 border border-transparent"
            >
              <div className={`w-6 h-6 bg-brand-red rounded-full shadow-lg transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              Yearly <span className="ml-2 px-2 py-0.5 bg-brand-red/10 text-brand-red rounded-full text-[10px] uppercase">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`glass-card p-10 relative flex flex-col ${plan.popular ? 'ring-2 ring-brand-red !bg-brand-red/5' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg shadow-brand-red/40">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{plan.desc}</p>
              
              <div className="mb-10">
                <span className="text-5xl font-black">${plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">/month</span>
              </div>

              <ul className="space-y-5 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-red/10 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-brand-red" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button onClick={openAuthModal} className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex justify-center items-center cursor-pointer ${plan.popular ? 'btn-primary' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
