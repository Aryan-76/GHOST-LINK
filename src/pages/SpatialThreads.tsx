import React from 'react';
import { 
  Hash, 
  Plus, 
  ChevronRight,
  Layers,
  Globe,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

import { useWorkspace } from '../hooks/useWorkspace';

const ThreadCard = ({ title, status, members, description, active, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`bg-[#0A0B0E] border border-white/5 p-6 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer ${
      active ? 'border-indigo-500/40 shadow-xl' : 'hover:border-white/10'
    }`}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={14} className={active ? 'text-indigo-400' : 'text-zinc-600'} />
          <span className={`text-sm font-semibold tracking-tight ${active ? 'text-white' : 'text-zinc-500'}`}>{title}</span>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
      </div>

      <p className="text-xs text-zinc-500 mb-6 leading-relaxed flex-1">{description || 'No description provided.'}</p>

      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
        <div className="flex -space-x-1.5">
          {members.map((p: any, i: number) => (
            <div key={i} className="w-7 h-7 rounded-sm border border-[#0A0B0E] bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-500">
              {p[0]}
            </div>
          ))}
          <div className="w-7 h-7 rounded-sm border border-[#0A0B0E] bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">+</div>
        </div>
        <button className={`p-1.5 rounded-lg transition-all ${active ? 'text-indigo-400 bg-indigo-400/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function SpatialThreadView() {
  const { projects } = useWorkspace();

  return (
    <div className="p-8 space-y-12 h-full overflow-y-auto scrollbar-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Layers size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Environment Topology</span>
           </div>
           <h1 className="text-4xl font-semibold text-white tracking-tight">Active Clusters</h1>
           <p className="text-sm text-zinc-500 mt-2">Visualization of project deployments and team allocation across global regions.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/[0.03] border border-white/5 p-1 rounded-xl flex items-center gap-1">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-bold text-white flex items-center gap-2 transition-all">
                <Globe size={12} /> GLOBAL
              </button>
              <button className="px-4 py-2 hover:bg-white/[0.02] rounded-lg text-[10px] font-bold text-zinc-600 transition-all uppercase tracking-widest">REGIONAL</button>
           </div>
           <button className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-bold shadow-xl hover:bg-zinc-200 transition-all flex items-center gap-2 uppercase tracking-widest">
             <Plus size={16} /> Create Stream
           </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <ThreadCard 
            key={project.id}
            {...project}
            delay={0.1 + i * 0.1}
            active={i === 0}
          />
        ))}
      </div>



    </div>
  );
}

const Settings = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
