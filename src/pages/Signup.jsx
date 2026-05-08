import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Globe, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Signup logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <Link to="/" className="absolute top-32 left-6 md:left-24 flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md glass-card p-10 animate-slide-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Start analyzing smarter with InsightTube.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold ml-1">Full name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold ml-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="you@company.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Min. 8 characters"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold ml-1">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Re-enter password"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                value={formData.confirm}
                onChange={(e) => setFormData({...formData, confirm: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-4 relative mt-4"
          >
            {isLoading ? <span className="flex items-center justify-center gap-2">Creating account...</span> : 'Sign Up'}
          </button>

          <div className="relative my-6 text-center">
            <hr className="border-gray-200 dark:border-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5f6f8] dark:bg-[#050505] px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
          </div>

          <button type="button" className="w-full py-4 px-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-3 font-bold text-sm">
            <Globe size={20} className="text-brand-red" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account? <Link to="/login" className="text-brand-red font-bold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
