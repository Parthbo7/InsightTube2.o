import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 text-white font-sans">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF1744]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[150px]" />
          </div>
          
          <div className="relative z-10 max-w-lg w-full bg-[#121218] border border-white/10 rounded-[2rem] p-10 shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-[#FF1744]" />
            </div>
            
            <h1 className="text-3xl font-black text-white mb-3">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              We encountered an unexpected rendering error. The application has safely caught this crash to prevent data loss.
            </p>
            
            <div className="bg-black/30 w-full p-4 rounded-xl border border-white/5 mb-8 overflow-auto max-h-32 text-left">
              <code className="text-xs text-red-400 font-mono">
                {this.state.error?.toString()}
              </code>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCcw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
