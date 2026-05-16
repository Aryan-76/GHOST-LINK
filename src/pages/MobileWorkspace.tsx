import React from 'react';
import { 
  Smartphone, 
  LayoutDashboard, 
  MessageSquare, 
  Zap, 
  Search, 
  MoreHorizontal, 
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Layout,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

export default function MobileWorkspace() {
  return (
    <div className="min-h-screen bg-[#020306] flex items-center justify-center p-8">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10 w-full max-w-5xl">
        {/* Mobile Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[320px] aspect-[9/19] bg-[#0A0B0E] rounded-[2.5rem] border-[6px] border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative shrink-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-zinc-700/50 rounded-full" />
          </div>
          
          {/* Header */}
          <header className="pt-10 pb-6 px-6 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                <Layout size={18} className="text-white" />
              </div>
              <button className="p-1.5 rounded-full text-zinc-500 hover:bg-white/5 transition-all"><MoreHorizontal size={18} /></button>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Main Dashboard</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Status: Operational</p>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto px-5 py-4 space-y-6 scrollbar-hidden">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col justify-between h-24">
                  <TrendingUp size={16} className="text-indigo-400" />
                  <div>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase">Load</p>
                     <p className="text-lg font-bold text-white tracking-tight">42%</p>
                  </div>
               </div>
               <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col justify-between h-24">
                  <Clock size={16} className="text-emerald-400" />
                  <div>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase">Latency</p>
                     <p className="text-lg font-bold text-white tracking-tight">24ms</p>
                  </div>
               </div>
            </div>

            {/* Active Project */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-xl">
               <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Collaboration</h3>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-zinc-600">LIVE</span>
                  </span>
               </div>
               <p className="text-xs font-semibold text-white tracking-tight mb-2">Project Architecture Review</p>
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-zinc-800 border border-[#0A0B0E]" />)}
                  </div>
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-2/3" />
                  </div>
               </div>
            </div>

            <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                <Zap size={14} /> Global Action
            </button>

            <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Recent Updates</h4>
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center gap-4 py-1.5">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-600">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">Sprint {i} Review Complete</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase">2h ago • Technical Team</p>
                    </div>
                    <ArrowUpRight size={14} className="text-zinc-700" />
                 </div>
               ))}
            </div>
          </main>

          {/* Tab Bar */}
          <footer className="h-16 bg-white/[0.02] backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-6">
             <LayoutDashboard size={18} className="text-indigo-400" />
             <MessageSquare size={18} className="text-zinc-600" />
             <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center -mt-8 shadow-xl border-2 border-[#0A0B0E]">
               <PlusIcon size={20} />
             </div>
             <Search size={18} className="text-zinc-600" />
             <Smartphone size={18} className="text-zinc-600" />
          </footer>
        </motion.div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md space-y-8"
        >
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3 block">Full Ecosystem</span>
            <h2 className="text-4xl font-bold text-white tracking-tighter leading-tight mb-4">
              GhostLink for Mobile
            </h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Stay connected to your team and projects from anywhere. 
              Our mobile application provides instant notifications, real-time coordination, 
              and full access to your workspace with zero compromises on security.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 py-4 border-y border-white/5">
             <div>
                <h4 className="text-white font-semibold text-sm mb-1 uppercase tracking-wider">Secure</h4>
                <p className="text-[11px] text-zinc-500">Biometric auth and end-to-end encryption by default.</p>
             </div>
             <div>
                <h4 className="text-white font-semibold text-sm mb-1 uppercase tracking-wider">Fast</h4>
                <p className="text-[11px] text-zinc-500">Optimized for low-latency updates over cellular networks.</p>
             </div>
          </div>

          <div className="flex gap-4 items-center">
            <button className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all">
              Download App
            </button>
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest italic">
              Beta Program Active
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const PlusIcon = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
