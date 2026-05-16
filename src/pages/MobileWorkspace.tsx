import React from 'react';
import { Layout, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function MobileWorkspace() {
  return (
    <div className="min-h-screen bg-[#020306] flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8 relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
          <Smartphone size={32} className="text-indigo-400" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">GhostLink Mobile</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            A native mobile app is in development. For now, GhostLink is fully usable in your mobile browser.
          </p>
        </div>

        <div className="bg-[#0A0B0E] border border-white/5 rounded-2xl p-6 text-left space-y-4">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">What's coming</p>
          <ul className="space-y-3">
            {[
              'Push notifications for messages and mentions',
              'Offline mode with local draft support',
              'Biometric authentication',
              'Mobile-optimized document editor',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/workspace"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all"
        >
          Back to Workspace <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}
