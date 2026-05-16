import React, { useState, useCallback } from 'react';
import { 
  Command, 
  Search, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Terminal, 
  Radio,
  ChevronRight,
  Filter,
  Loader2,
  AlertCircle,
  Activity,
  Key,
  Users,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';

const CommandItem = React.memo(({ icon: Icon, title, shortcut, desc, active, onClick }: any) => (
  <motion.div 
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    className="bg-[#0A0B0E] border border-white/5 p-4 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer flex items-center gap-4 group"
    onClick={onClick}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/[0.03] text-zinc-500'}`}>
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
        <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{shortcut}</span>
      </div>
      <p className="text-[11px] text-zinc-500 mt-0.5">{desc}</p>
    </div>
  </motion.div>
));

export default function SemanticCommandCenter() {
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleCommand = useCallback(async (e?: React.FormEvent, overrideCommand?: string) => {
    e?.preventDefault();
    const finalCommand = (overrideCommand || commandInput).trim();
    if (!finalCommand || isProcessing) return;

    setIsProcessing(true);
    setFeedback(null);

    try {
      const response = await aiService.executeCommand(finalCommand);
      setFeedback({
        action: response.action || 'Done',
        success: true,
        details: response.explanation || response.reason || 'Command completed successfully.',
      });
      if (!overrideCommand) setCommandInput('');
    } catch (error) {
      setFeedback({ error: error instanceof Error ? error.message : 'Action failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  }, [commandInput, isProcessing]);

  const executeDirective = (directive: string) => {
    setCommandInput(directive);
    handleCommand(undefined, directive);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 h-full overflow-y-auto scrollbar-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
          <Terminal size={28} className="text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Console</h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">Instant access to workspace settings, infrastructure management, and team tools.</p>
      </motion.div>

      {/* Command Search Bar */}
      <motion.form 
        onSubmit={handleCommand}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="relative bg-[#0A0B0E] border border-white/10 rounded-2xl p-1.5 shadow-2xl flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Command size={20} />}
          </div>
          <input 
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            disabled={isProcessing}
            autoFocus
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none text-base text-white placeholder:text-zinc-700 focus:ring-0 py-3"
          />
          <div className="flex gap-2 pr-2">
            <button type="submit" className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
              Run
            </button>
          </div>
        </div>
      </motion.form>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-xl border ${feedback.error ? 'border-red-500/20 bg-red-500/5' : 'border-indigo-500/20 bg-indigo-500/5'}`}
          >
            <div className="flex items-center gap-3">
              {feedback.error ? <AlertCircle className="text-red-500" size={18} /> : <Zap className="text-indigo-400" size={18} />}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">{feedback.error ? 'Error' : 'Command Executed'}</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">{feedback.error || `Successfully processed: ${feedback.action}`}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
            <Terminal size={12} className="text-indigo-400" /> Core Commands
          </h3>
          <div className="space-y-2">
            <CommandItem 
              icon={Activity} 
              title="Optimize Resources" 
              shortcut="⌘ O" 
              desc="Analyze and scale environment allocations."
              active
              onClick={() => executeDirective("Optimize resource allocation")}
            />
            <CommandItem 
              icon={Key} 
              title="Rotate Auth Keys" 
              shortcut="⌘ K" 
              desc="Force refresh of all active session tokens."
              onClick={() => executeDirective("Rotate authentication keys")}
            />
            <CommandItem 
              icon={Users} 
              title="Team Overview" 
              shortcut="⌘ T" 
              desc="Open the collaborative workspace map."
              onClick={() => executeDirective("Show project activity")}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
           <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
            <Settings size={12} className="text-zinc-600" /> Workspace
          </h3>
          <div className="space-y-4">
            <div className="bg-[#0A0B0E] border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Radio size={16} />
                 </div>
                 <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">Connected to GhostLink</span>
              </div>
              <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
