import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  BrainCircuit, 
  Search, 
  User, 
  LayoutDashboard, 
  Hash, 
  Command,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  key?: React.Key;
}

const SidebarItem = ({ to, icon, label, active }: SidebarItemProps) => (
  <Link to={to} aria-label={`Navigate to ${label}`} aria-current={active ? 'page' : undefined}>
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
        active 
          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
          : 'text-zinc-500 hover:text-zinc-100 hover:bg-white/5'
      }`}
    >
      <span className={`${active ? 'text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : ''}`}>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-indicator"
          className="ml-auto w-1 h-4 bg-indigo-500 rounded-full" 
        />
      )}
    </motion.div>
  </Link>
);

import { useAuthStore } from '../../store/authStore';

export const Shell = React.memo(({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isAuth = location.pathname === '/auth';
  const isLanding = location.pathname === '/';
  const isMobileView = location.pathname === '/mobile';

  if (isAuth || isLanding || isMobileView) return <>{children}</>;

  const menuItems = [
    { to: '/workspace', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/chat', icon: <MessageSquare size={18} />, label: 'Messaging' },
    { to: '/ai-collab', icon: <BrainCircuit size={18} />, label: 'Documents' },
    { to: '/command', icon: <Command size={18} />, label: 'Terminal' },
    { to: '/threads', icon: <Hash size={18} />, label: 'Activity' },
    { to: '/profile', icon: <User size={18} />, label: 'Settings' },
  ];

  const userInitial = user?.displayName ? user.displayName[0] : (user?.email ? user.email[0] : 'U');
  const currentPageLabel = menuItems.find(item => item.to === location.pathname)?.label || 'Workspace';

  return (
    <div className="flex h-screen bg-[#020306] overflow-hidden relative selection:bg-indigo-500/30 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-violet-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-cyan-600/5 blur-[100px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="w-[240px] bg-[#0A0B0E] border-r border-white/5 flex flex-col flex-shrink-0 z-20" aria-label="Main Sidebar">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Network size={18} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight text-white">GhostLink</span>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4 ml-2">Platform</div>
          <nav className="space-y-1" aria-label="Main Navigation">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to} 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                active={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/5 bg-white/[0.01]">
          <Link to="/profile" className="flex items-center gap-3 px-2 py-1 group cursor-pointer" role="button" aria-label="User Profile">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
              {userInitial}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{user?.displayName || user?.email || 'User'}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Early Access Plan</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 border-b border-white/5 bg-[#020306]/80 backdrop-blur-md flex items-center justify-between px-8" role="banner">
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 text-zinc-500 text-xs font-medium" aria-label="Breadcrumb">
              <Link to="/workspace" className="hover:text-zinc-300 transition-colors">GhostLink</Link>
              <span className="opacity-20" aria-hidden="true">/</span>
              <span className="text-zinc-100 font-medium">{currentPageLabel}</span>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-md">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={12} className="text-zinc-500" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                aria-label="Universal Search"
                className="bg-white/5 border border-white/10 rounded-md pl-9 pr-12 py-1.5 text-xs focus:outline-none focus:border-white/20 w-64 text-zinc-300 transition-all font-medium"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none" aria-hidden="true">
                <span className="text-zinc-600 text-[10px] font-mono border border-zinc-800 px-1 rounded">⌘K</span>
              </div>
            </div>

            <button 
              className="bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-md text-xs font-semibold transition-all active:scale-95"
              aria-label="Share workspace"
            >
              Share
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative" id="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="h-10 border-t border-white/5 bg-[#020306] flex items-center justify-between px-8" role="contentinfo">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></div>
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Cloud Sync Connected</span>
            </div>
            <div className="h-3 w-px bg-zinc-800" aria-hidden="true"></div>
            <span className="text-[10px] text-zinc-600 font-mono tracking-tight uppercase">v1.0.0-BETA</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-zinc-600 font-mono tracking-wider bg-white/5 px-2 py-0.5 rounded uppercase">Encrypted</span>
          </div>
        </footer>
      </div>
    </div>
  );
});
