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
import { ProjectCard } from '../components/common/ProjectCard';

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
            />
          ))}
        </div>
      )}
    </div>
  );
}
