import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  Sparkles, 
  FileText, 
  Share2, 
  Database, 
  Users,
  Layout,
  MessageSquare,
  History,
  Info,
  Settings,
  ArrowUp,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';

const OutlineItem = React.memo(({ title, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`px-3 py-2 rounded-lg flex items-center justify-between group cursor-pointer transition-all ${
      active ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
    }`}
  >
    <div className="flex items-center gap-2 overflow-hidden">
      <FileText size={14} className={active ? 'text-zinc-300' : 'text-zinc-600'} />
      <span className="text-xs font-medium truncate">{title}</span>
    </div>
    {active && <div className="w-1 h-1 rounded-full bg-white" />}
  </div>
));

const AISuggestion = React.memo(({ title, desc, onApply, isApplying }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0A0B0E] border border-white/5 p-4 rounded-xl relative overflow-hidden group hover:border-white/10 transition-all"
  >
    <div className="flex items-center gap-2 mb-2">
      <Sparkles size={14} className="text-indigo-400" />
      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Action Suggestion</span>
    </div>
    <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
    <p className="text-xs text-zinc-500 leading-relaxed mb-4">{desc}</p>
    <button 
      onClick={onApply}
      disabled={isApplying}
      className="w-full py-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-md text-[10px] font-bold text-zinc-300 transition-all uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {isApplying && <Loader2 size={12} className="animate-spin" />}
      {isApplying ? 'Processing...' : 'Review & Apply'}
    </button>
  </motion.div>
));

export default function AICollabWorkspace() {
  const [content, setContent] = useState(`## Technical Architecture: Project Nexus

### Overview
This document outlines the core infrastructure for the global synchronization engine. The goal is to provide sub-100ms latency for cross-region data propagation.

### Edge Gateway Strategy
We are deploying lightweight proxy nodes in 12 global regions. These nodes will handle initial SSL termination and routing based on client proximity.

### State Synchronization
Using a Conflict-free Replicated Data Type (CRDT) approach, we ensure that concurrent edits from multiple users converge without a central locking mechanism.

### Security
All data is encrypted in transit via TLS 1.3 and at rest using AES-256-GCM.`);

  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [applyingSuggestionId, setApplyingSuggestionId] = useState<string | null>(null);

  const handleAISubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    setIsAiLoading(true);
    try {
      const response = await aiService.chat(aiInput, [{ role: 'user', parts: [{ text: `Context: ${content.substring(0, 500)}...` }] }]);
      // For now, we just append or log, but in a real app, this might update the document or suggest changes
      console.log('AI Response:', response);
      setAiInput('');
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsAiLoading(false);
    }
  }, [aiInput, content, isAiLoading]);

  const applySuggestion = useCallback(async (id: string, type: string) => {
    setApplyingSuggestionId(id);
    try {
      // Mocking AI refinement of content based on suggestion
      const prompt = type === 'summarize' 
        ? `Summarize this text: ${content}` 
        : `Refine the security section of this text: ${content}`;
      
      const response = await aiService.chat(prompt);
      // In a real scenario, we'd probably show a diff first
      console.log('Suggestion applied:', response);
    } catch (error) {
      console.error('Apply error:', error);
    } finally {
      setApplyingSuggestionId(null);
    }
  }, [content]);

  return (
    <div className="flex h-full bg-[#020306]">
      {/* Left Sidebar: Document Management */}
      <div className="w-72 border-r border-white/5 p-6 flex flex-col space-y-8 bg-[#040507]">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Documentation</h3>
            <Plus size={14} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
          </div>
          <div className="space-y-1">
            <OutlineItem title="Architecture V2" active />
            <OutlineItem title="Deployment Guide" />
            <OutlineItem title="Security Policy" />
            <OutlineItem title="API Reference" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Contextual Assets</h3>
          </div>
          <div className="space-y-1">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-zinc-400 group hover:border-white/10 cursor-pointer transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Database size={12} className="text-zinc-600" />
                <span className="font-medium text-zinc-300">db_schema.sql</span>
              </div>
              <p className="text-[10px] text-zinc-600 truncate">Modified 2h ago by Sarah</p>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-zinc-400 group hover:border-white/10 cursor-pointer transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Layout size={12} className="text-zinc-600" />
                <span className="font-medium text-zinc-300">Dashboard Mockups</span>
              </div>
              <p className="text-[10px] text-zinc-600 truncate">Figma / External Link</p>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Info size={14} className="text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Tip</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Use the assistant panel to ask questions about the document or request edits.
          </p>
        </div>
      </div>

      {/* Main Execution Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020306]">
        {/* Editor Toolbar */}
        <header className="h-14 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Editor</span>
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="flex items-center gap-4 text-zinc-500">
              <button className="hover:text-white transition-all"><History size={16} /></button>
              <button className="hover:text-white transition-all"><MessageSquare size={16} /></button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 rounded-md hover:bg-white/5 text-xs text-zinc-300 transition-all font-medium">Draft</button>
            <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all flex items-center gap-2">
              <Share2 size={14} /> Publish
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            <div className="max-w-3xl mx-auto w-full">
              <input 
                type="text" 
                defaultValue="Technical Architecture: Project Nexus"
                className="w-full bg-transparent border-none focus:outline-none text-4xl font-semibold text-white mb-8 tracking-tight"
              />
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] bg-transparent border-none focus:outline-none text-zinc-400 leading-relaxed text-lg resize-none font-sans"
                placeholder="Start writing..."
              />
            </div>
          </div>

          {/* Right Sidebar: AI Panel */}
          <div className="w-80 border-l border-white/5 p-6 flex flex-col space-y-6 bg-[#040507]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-white" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Assistant</h3>
              </div>
              <Settings size={14} className="text-zinc-600 cursor-pointer hover:text-zinc-400" />
            </div>

            <div className="space-y-4">
              <AISuggestion 
                title="Summarize key points" 
                desc="I can generate a brief summary of the Edge Gateway strategy for the executive team." 
                onApply={() => applySuggestion('s1', 'summarize')}
                isApplying={applyingSuggestionId === 's1'}
              />
              <AISuggestion 
                title="Verify security specs" 
                desc="The AES-256-GCM mention is accurate. Shall I add more detail on key rotation?" 
                onApply={() => applySuggestion('s2', 'security')}
                isApplying={applyingSuggestionId === 's2'}
              />
              <AISuggestion 
                title="Refine tone" 
                desc="The technical overview is clear, but I can make it more 'startup-focused' for the internal memo." 
                onApply={() => applySuggestion('s3', 'tone')}
                isApplying={applyingSuggestionId === 's3'}
              />
            </div>

            <div className="mt-auto">
              <form onSubmit={handleAISubmit} className="relative group">
                <textarea 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  disabled={isAiLoading}
                  placeholder="Ask assistant anything..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500/50 resize-none text-zinc-300 pr-10 min-h-[100px]"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading}
                  className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={14} />}
                </button>
              </form>
            </div>
          </div>
        </div>

        <footer className="h-10 border-t border-white/5 px-8 flex items-center justify-between bg-white/[0.01]">
          <div className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest">
            Last saved 14 seconds ago
          </div>
        </footer>
      </div>
    </div>
  );
}
