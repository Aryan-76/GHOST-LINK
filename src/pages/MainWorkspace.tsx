import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Users,
  Plus,
  ChevronRight,
  FileText,
  MessageSquare,
  CheckCircle2,
  Zap,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { Project, Activity as ActivityType } from '../types';
import { useAuthStore } from '../store/authStore';
import { ProjectCard } from '../components/common/ProjectCard';
import { ActivityItem } from '../components/common/ActivityItem';

const StatCard = React.memo(({ label, value, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-[#101116] border border-white/5 p-6 rounded-xl group hover:border-white/10 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
        <Icon size={20} />
      </div>
    </div>
    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
  </motion.div>
));


function CreateProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'projects'), {
        title: title.trim(),
        description: description.trim(),
        status: 'active',
        ownerId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'activities'), {
        title: `Created new project: ${title.trim()}`,
        type: 'edit',
        userId: user.uid,
        timestamp: serverTimestamp()
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">New Project</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Project Name</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Product Roadmap"
              required
              className="w-full bg-white/[0.03] border border-white/5 py-3 px-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Description <span className="text-zinc-700">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/5 py-3 px-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 transition-all text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><Loader2 size={12} className="animate-spin" /> Creating...</> : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function MainWorkspace() {
  const { projects, activities, stats, isLoading } = useWorkspace();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Reload projects after creation by triggering a re-fetch
  const handleProjectCreated = () => {
    // TanStack Query will auto-refresh via onSnapshot / invalidation in hook
  };

  if (isLoading) return (
    <div className="h-full flex items-center justify-center bg-[#020306]">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 size={24} className="text-indigo-400 animate-spin" />
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Loading workspace...</span>
      </motion.div>
    </div>
  );

  return (
    <>
      <div className="p-8 space-y-12 overflow-y-auto h-full scrollbar-hidden">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Workspace</h1>
            <p className="text-sm text-zinc-500 mt-1">Your projects and recent activity.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest self-start md:self-auto"
          >
            <Plus size={14} /> New Project
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-8 flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard label="Projects" value={stats.activeProjects} icon={BarChart3} delay={0.1} />
              <StatCard label="Activities" value={activities.length} icon={Activity} delay={0.2} />
              <StatCard label="Members" value={projects.reduce((acc, p) => acc + (p.members?.length || 0), 0)} icon={Users} delay={0.3} />
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {projects.length > 0 ? (
                  projects.map((project, i) => (
                    <ProjectCard key={project.id} {...project} delay={0.4 + i * 0.1} />
                  ))
                ) : (
                  <div className="sm:col-span-2 border border-dashed border-white/5 bg-white/[0.01] rounded-xl p-12 text-center">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">No projects yet</p>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">Create your first project to start collaborating with your team.</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
                    >
                      Create Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

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
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onCreated={handleProjectCreated}
          />
        )}
      </AnimatePresence>
    </>
  );
}
