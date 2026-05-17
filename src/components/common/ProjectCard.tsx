import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCardProps {
  title: string;
  status: 'active' | 'planned' | 'archived' | 'completed';
  members?: string[];
  description?: string;
  delay?: number;
  active?: boolean;
  onClick?: () => void;
}

export const ProjectCard = React.memo(({ title, status, members = [], description, delay = 0, active, onClick }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    onClick={onClick}
    className={`bg-[#101116] border p-5 rounded-xl transition-all flex flex-col h-full group ${
      active ? 'border-indigo-500/40' : 'border-white/5 hover:border-white/10'
    } ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
      <h4 className="text-sm font-semibold text-zinc-100 tracking-tight line-clamp-1">{title}</h4>
      <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${
        status === 'active' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-zinc-800 text-zinc-500 border-white/5'
      }`}>
        {status}
      </span>
    </div>
    <p className="text-[11px] text-zinc-500 mb-6 line-clamp-3 leading-relaxed flex-grow">{description || 'No description provided.'}</p>
    <div className="flex items-center justify-between mt-auto pt-4">
      <div className="flex -space-x-1.5">
        {members.slice(0, 4).map((m: string, i: number) => (
          <div key={i} className="w-6 h-6 rounded bg-zinc-800 border border-[#101116] flex items-center justify-center text-[8px] text-zinc-500 font-bold uppercase">
            {m[0]}
          </div>
        ))}
        {members.length > 4 && (
          <div className="w-6 h-6 rounded bg-zinc-900 border border-[#101116] flex items-center justify-center text-[8px] text-zinc-600 font-bold">
            +{members.length - 4}
          </div>
        )}
      </div>
      <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
    </div>
  </motion.div>
));
