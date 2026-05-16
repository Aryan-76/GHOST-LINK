import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Command,
  Terminal,
  Zap,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';

interface CommandHistoryEntry {
  id: string;
  input: string;
  result: { action?: string; details?: string; error?: string } | null;
}

const QUICK_COMMANDS = [
  { label: 'Summarize workspace activity', command: 'Summarize what I should focus on in my workspace today' },
  { label: 'Draft a project update', command: 'Help me write a brief project status update for my team' },
  { label: 'Suggest next steps', command: 'Based on a typical product team workflow, what are good next steps after completing a sprint?' },
  { label: 'Write a meeting agenda', command: 'Create a concise meeting agenda template for a weekly team sync' },
];

export default function CommandCenter() {
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = useCallback(async (e?: React.FormEvent, overrideCommand?: string) => {
    e?.preventDefault();
    const finalCommand = (overrideCommand || commandInput).trim();
    if (!finalCommand || isProcessing) return;

    const entryId = Date.now().toString();
    setHistory(prev => [{ id: entryId, input: finalCommand, result: null }, ...prev]);
    if (!overrideCommand) setCommandInput('');
    setIsProcessing(true);

    try {
      const response = await aiService.chat(finalCommand);
      setHistory(prev => prev.map(e =>
        e.id === entryId
          ? { ...e, result: { action: finalCommand, details: response.text } }
          : e
      ));
    } catch (error) {
      setHistory(prev => prev.map(e =>
        e.id === entryId
          ? { ...e, result: { error: error instanceof Error ? error.message : 'Command failed. Please try again.' } }
          : e
      ));
    } finally {
      setIsProcessing(false);
    }
  }, [commandInput, isProcessing]);

  const executeQuick = (command: string) => {
    setCommandInput(command);
    handleCommand(undefined, command);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-10 h-full overflow-y-auto scrollbar-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
            <Terminal size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AI Assistant</h1>
            <p className="text-xs text-zinc-500">Ask anything about your workspace or get help with tasks.</p>
          </div>
        </div>
      </motion.div>

      {/* Command Input */}
      <motion.form
        onSubmit={handleCommand}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-[#0A0B0E] border border-white/10 rounded-xl p-1.5 flex items-center gap-3 focus-within:border-indigo-500/30 transition-all">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Command size={18} />}
          </div>
          <input
            ref={inputRef}
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Ask the assistant anything..."
            className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-zinc-700 focus:ring-0 py-3"
          />
          <button
            type="submit"
            disabled={isProcessing || !commandInput.trim()}
            className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            Send
          </button>
        </div>
      </motion.form>

      {/* Quick Actions */}
      {history.length === 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Suggested prompts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_COMMANDS.map((item) => (
              <button
                key={item.command}
                onClick={() => executeQuick(item.command)}
                disabled={isProcessing}
                className="text-left bg-[#0A0B0E] border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{item.label}</span>
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <AnimatePresence>
        {history.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0 mt-0.5">
                <Zap size={12} />
              </div>
              <p className="text-sm text-zinc-300 font-medium">{entry.input}</p>
            </div>

            {entry.result === null ? (
              <div className="ml-9 flex items-center gap-2 text-indigo-400 text-xs">
                <Loader2 size={12} className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : entry.result.error ? (
              <div className="ml-9 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={14} />
                <p className="text-xs text-zinc-400">{entry.result.error}</p>
              </div>
            ) : (
              <div className="ml-9 p-4 rounded-xl border border-white/5 bg-[#0A0B0E]">
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{entry.result.details}</p>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
