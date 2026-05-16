import React, { useCallback } from 'react';
import { 
  Shield, 
  Zap, 
  Settings, 
  Cpu, 
  Unlock, 
  LogOut, 
  Globe, 
  History,
  Layout,
  Mail,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const Achievement = React.memo(({ title, date, icon: Icon }: any) => (
  <div className="bg-[#0A0B0E] border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:bg-white/[0.04] transition-all cursor-pointer">
    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
      <Icon size={18} />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
      <p className="text-[10px] font-bold text-zinc-600 uppercase transition-colors">{date}</p>
    </div>
  </div>
));

export default function UserProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  if (!user) return null;

  const userInitial = user.displayName ? user.displayName[0] : (user.email ? user.email[0] : 'U');

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 pb-24 h-full overflow-y-auto scrollbar-hidden">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur opacity-50 transition duration-1000" />
          <div className="relative w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden bg-zinc-900 flex items-center justify-center">
            <span className="text-4xl font-bold text-zinc-600 uppercase">{userInitial}</span>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
             <h1 className="text-3xl font-bold text-white tracking-tight">{user.displayName || 'Anonymous User'}</h1>
             <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/20 self-center">Workspace Member</span>
          </div>
          <p className="text-zinc-500 max-w-md text-sm">
            Infrastructure access authorized. Regional node synchronization active.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
              <Mail size={12} /> {user.email || 'no-email@ghostlink.ai'}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
              <Globe size={12} /> Regional Hub: Global
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-white/[0.03] border border-white/5 p-3.5 rounded-xl text-zinc-500 hover:text-white transition-all">
            <Settings size={18} />
          </button>
          <button 
            onClick={handleLogout}
            className="bg-white/[0.03] border border-white/5 p-3.5 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Account Security */}
        <div className="space-y-6">
           <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1 flex items-center gap-2">
            <Shield size={12} className="text-indigo-400" /> Account Security
          </h3>
          <div className="bg-[#0A0B0E] border border-white/5 p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white tracking-tight">Two-Factor Auth</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Enabled</p>
              </div>
              <Unlock size={18} className="text-zinc-700" />
            </div>
            <div className="h-px w-full bg-white/5" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white tracking-tight">Access Permissions</p>
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]' : 'bg-zinc-800'}`} />
                ))}
              </div>
              <p className="text-[9px] font-bold text-zinc-600 mt-2 uppercase tracking-widest">Level 3 • Enterprise Access</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="md:col-span-2 space-y-6">
           <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1 flex items-center gap-2">
            <History size={12} className="text-indigo-400" /> Platform Milestones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Achievement title="Project Lead" date="Completed • Mar 12, 2024" icon={Layout} />
            <Achievement title="Team Onboarding" date="Active • Feb 28, 2024" icon={Users} />
            <Achievement title="Scale Deployment" date="Verified • Jan 15, 2024" icon={Cpu} />
            <Achievement title="Security Audit" date="Verified • Dec 02, 2023" icon={Shield} />
          </div>

          <div className="bg-[#0A0B0E] border border-white/5 p-8 rounded-2xl bg-indigo-500/[0.02]">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Workspace Health Score</h4>
            <div className="flex items-end gap-12">
               <div className="space-y-2">
                  <span className="text-4xl font-bold text-white tracking-tighter">98%</span>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                    Overall performance and security metrics are optimal.
                  </p>
               </div>
               <button className="px-5 py-2 bg-white text-black rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all mb-1">
                 View History
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
