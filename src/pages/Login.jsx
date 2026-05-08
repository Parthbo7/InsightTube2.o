import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Globe, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <Link to="/" className="absolute top-32 left-6 md:left-24 flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md glass-card p-10 animate-slide-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400">Sign in to access your analytics dashboard.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold">Password</label>
              <a href="#" className="text-xs text-brand-red hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-4 relative"
          >
            {isLoading ? <span className="flex items-center justify-center gap-2">Authenticating...</span> : 'Sign In'}
          </button>

          <div className="relative my-8 text-center">
            <hr className="border-gray-200 dark:border-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5f6f8] dark:bg-[#050505] px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
          </div>

          <button type="button" className="w-full py-4 px-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-3 font-bold text-sm">
            <Globe size={20} className="text-brand-red" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account? <Link to="/signup" className="text-brand-red font-bold hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
