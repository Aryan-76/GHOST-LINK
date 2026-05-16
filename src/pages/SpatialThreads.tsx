import React from 'react';
import {
  Plus,
  ChevronRight,
  Activity,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useWorkspace } from '../hooks/useWorkspace';
import { Link } from 'react-router-dom';

const ProjectCard = ({ title, status, members, description, active, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`bg-[#0A0B0E] border border-white/5 p-6 rounded-2xl transition-all duration-300 group cursor-pointer ${
      active ? 'border-indigo-500/40' : 'hover:border-white/10'
    }`}
  >
    <div className="flex flex-col h-full">
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
          {members.slice(0, 4).map((p: any, i: number) => (
            <div key={i} className="w-7 h-7 rounded-sm border border-[#0A0B0E] bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-500">
              {p[0]}
            </div>
          ))}
        </div>
        <ChevronRight size={16} className="text-zinc-700" />
      </div>
    </div>
  </motion.div>
);

export default function SpatialThreadView() {
  const { projects, isLoading } = useWorkspace();

  return (
    <div className="p-8 space-y-12 h-full overflow-y-auto scrollbar-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <h1 className="text-4xl font-semibold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-500 mt-2">All active and planned projects in your workspace.</p>
        </div>
        <Link
          to="/workspace"
          className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-bold shadow-xl hover:bg-zinc-200 transition-all flex items-center gap-2 uppercase tracking-widest self-start md:self-auto"
        >
          <Plus size={16} /> New Project
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="text-indigo-400 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-white/5 rounded-2xl p-16 text-center">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">No projects yet</p>
          <p className="text-xs text-zinc-500 mb-6">Create a project from the Workspace dashboard to get started.</p>
          <Link to="/workspace" className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors uppercase tracking-widest">
            Go to Dashboard →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              {...project}
              delay={0.1 + i * 0.1}
              active={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
