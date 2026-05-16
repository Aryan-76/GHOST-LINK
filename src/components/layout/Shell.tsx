import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  BrainCircuit,
  User,
  LayoutDashboard,
  Hash,
  Command,
  Network,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../../store/authStore';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
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
      <span>{icon}</span>
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

const MENU_ITEMS = [
  { to: '/workspace', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/chat', icon: <MessageSquare size={18} />, label: 'Messages' },
  { to: '/ai-collab', icon: <BrainCircuit size={18} />, label: 'Documents' },
  { to: '/command', icon: <Command size={18} />, label: 'Assistant' },
  { to: '/threads', icon: <Hash size={18} />, label: 'Projects' },
  { to: '/profile', icon: <User size={18} />, label: 'Profile' },
];

function GlobalSearch({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const pages = MENU_ITEMS.map(item => ({ label: item.label, to: item.to }));
  const filtered = query.trim()
    ? pages.filter(p => p.label.toLowerCase().includes(query.toLowerCase()))
    : pages;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-32 p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        className="w-full max-w-md bg-[#0A0B0E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <Search size={14} className="text-zinc-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
            placeholder="Search pages..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-zinc-600 hover:text-zinc-400 transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-2">
          {filtered.map(page => (
            <button
              key={page.to}
              onClick={() => { navigate(page.to); onClose(); }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>{page.label}</span>
              <span className="text-[10px] text-zinc-700 font-mono group-hover:text-zinc-500 transition-colors">{page.to}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-xs text-zinc-600 text-center">No matching pages.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export const Shell = React.memo(({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const isAuth = location.pathname === '/auth';
  const isLanding = location.pathname === '/';
  const isMobileView = location.pathname === '/mobile';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (isAuth || isLanding || isMobileView) return <>{children}</>;

  const userInitial = user?.displayName ? user.displayName[0] : (user?.email ? user.email[0] : 'U');
  const currentPageLabel = MENU_ITEMS.find(item => item.to === location.pathname)?.label || 'Workspace';

  return (
    <div className="flex h-screen bg-[#020306] overflow-hidden relative selection:bg-indigo-500/30 selection:text-white">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-violet-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-cyan-600/5 blur-[100px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="w-[240px] bg-[#0A0B0E] border-r border-white/5 flex flex-col flex-shrink-0 z-20" aria-label="Main Sidebar">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Network size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">GhostLink</span>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4 ml-2">Platform</div>
          <nav className="space-y-1" aria-label="Main Navigation">
            {MENU_ITEMS.map((item) => (
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
          <Link to="/profile" className="flex items-center gap-3 px-2 py-1 group cursor-pointer" aria-label="User Profile">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
              ) : userInitial}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{user?.displayName || user?.email || 'User'}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Early Access</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 border-b border-white/5 bg-[#020306]/80 backdrop-blur-md flex items-center justify-between px-8" role="banner">
          <nav className="flex items-center gap-2 text-zinc-500 text-xs font-medium" aria-label="Breadcrumb">
            <Link to="/workspace" className="hover:text-zinc-300 transition-colors">GhostLink</Link>
            <span className="opacity-20" aria-hidden="true">/</span>
            <span className="text-zinc-100 font-medium">{currentPageLabel}</span>
          </nav>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg pl-3 pr-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-all w-52 group"
            aria-label="Open search"
          >
            <Search size={12} />
            <span className="flex-1 text-left">Search...</span>
            <span className="text-zinc-700 text-[10px] font-mono border border-zinc-800 px-1 rounded group-hover:text-zinc-500 transition-colors">⌘K</span>
          </button>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Connected</span>
            </div>
            <span className="text-[10px] text-zinc-700 font-mono uppercase">v1.0.0-BETA</span>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </div>
  );
});
