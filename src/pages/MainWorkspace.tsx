import React from 'react';
import { 
  Zap, 
  Clock, 
  Activity, 
  BarChart3, 
  Users, 
  Plus, 
  MoreHorizontal,
  ChevronRight,
  FileText,
  MessageSquare,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

import { useWorkspace } from '../hooks/useWorkspace';
import { Project, Activity as ActivityType } from '../types';

const StatCard = React.memo(({ label, value, trend, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-[#101116] border border-white/5 p-6 rounded-xl group hover:border-white/10 transition-all cursor-pointer"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded ${trend.startsWith('+') ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
  </motion.div>
));

const ProjectCard = React.memo(({ title, status, members, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-[#101116] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-all cursor-pointer flex flex-col h-full"
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
        {(members || []).slice(0, 4).map((m: string, i: number) => (
          <div key={i} className="w-6 h-6 rounded bg-zinc-800 border border-[#101116] flex items-center justify-center text-[8px] text-zinc-500 font-bold uppercase overflow-hidden">
            {m[0]}
          </div>
        ))}
        {members && members.length > 4 && (
          <div className="w-6 h-6 rounded bg-zinc-900 border border-[#101116] flex items-center justify-center text-[8px] text-zinc-600 font-bold">
            +{members.length - 4}
          </div>
        )}
      </div>
      <ChevronRight size={14} className="text-zinc-700" />
    </div>
  </motion.div>
));

const ActivityItem = React.memo(({ title, time, type }: { title: string; time: string; type: ActivityType['type'] }) => (
  <motion.div 
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-4 group cursor-pointer p-2 rounded-lg hover:bg-white/[0.03] transition-all"
  >
    <div className={`w-8 h-8 rounded bg-[#101116] border border-white/5 flex items-center justify-center flex-shrink-0 ${
      type === 'edit' ? 'text-indigo-400' : 
      type === 'comment' ? 'text-amber-400' : 
      type === 'alert' ? 'text-red-400' : 'text-emerald-400'
    }`}>
      {type === 'edit' ? <FileText size={14} /> : type === 'comment' ? <MessageSquare size={14} /> : type === 'alert' ? <Zap size={14} /> : <CheckCircle2 size={14} />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors truncate">{title}</p>
      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">{time}</p>
    </div>
  </motion.div>
));

export default function MainWorkspace() {
  const { projects, activities, stats, isLoading } = useWorkspace();

  if (isLoading) return (
    <div className="h-full flex items-center justify-center bg-[#020306]">
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <Loader2 size={24} className="text-indigo-400 animate-spin" />
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">GhostLink Syncing...</span>
      </motion.div>
    </div>
  );

  return (
    <div className="p-8 space-y-12 overflow-y-auto h-full scrollbar-hidden">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-1">Collaboration Hub</h2>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Workspace
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#101116] border border-white/5 px-4 py-2 rounded-lg text-[10px] font-bold text-zinc-500 hover:text-white hover:border-white/10 transition-all flex items-center gap-2 uppercase tracking-widest">
            <Clock size={14} /> Recent Actions
          </button>
          <button className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest">
            <Plus size={14} /> Create Project
          </button>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-8 flex flex-col gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard label="Active Projects" value={stats.activeProjects} icon={BarChart3} delay={0.1} />
            <StatCard label="Total Activities" value={activities.length} icon={Activity} delay={0.2} />
            <StatCard label="Team Members" value={projects.reduce((acc, p) => acc + (p.members?.length || 0), 0)} icon={Users} delay={0.3} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Pinned Repositories</h3>
              <button className="text-[9px] font-bold text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-widest">Index View</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {projects.length > 0 ? (
                projects.map((project, i) => (
                  <ProjectCard key={project.id} {...project} delay={0.4 + i * 0.1} />
                ))
              ) : (
                <div className="sm:col-span-2 border border-dashed border-white/5 bg-white/[0.01] rounded-xl p-12 text-center">
                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">No projects yet</p>
                   <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">Create your first project to start collaborating with your team.</p>
                   <button className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-all">
                     Create Project
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="md:col-span-4 space-y-6 bg-[#101116] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recent Activity</h3>
            <Activity size={14} className="text-zinc-700" />
          </div>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id} {...activity} />
              ))
            ) : (
              <p className="text-[10px] text-zinc-600 text-center py-8 italic uppercase tracking-widest">No recent activity</p>
            )}
          </div>

          {activities.length > 10 && (
            <button className="w-full py-3 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-bold text-zinc-600 hover:text-white hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              VIEW ALL ACTIVITY <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
