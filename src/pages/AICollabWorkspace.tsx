import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Plus,
  Sparkles,
  FileText,
  ArrowUp,
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';
import { useAuthStore } from '../store/authStore';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Doc {
  id: string;
  title: string;
  content: string;
  updatedAt?: any;
}

interface AIMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function AICollabWorkspace() {
  const { user } = useAuthStore();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load documents from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'documents'),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Doc));
      setDocs(items);
      if (items.length > 0 && !activeDoc && !isCreatingNew) {
        setActiveDoc(items[0]);
        setTitle(items[0].title);
        setContent(items[0].content || '');
      }
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const startNewDoc = () => {
    setIsCreatingNew(true);
    setActiveDoc(null);
    setTitle('');
    setContent('');
    setAiMessages([]);
  };

  const selectDoc = (doc: Doc) => {
    setIsCreatingNew(false);
    setActiveDoc(doc);
    setTitle(doc.title);
    setContent(doc.content || '');
    setAiMessages([]);
  };

  const saveDocument = async () => {
    if (!user || !title.trim()) return;
    setIsSaving(true);
    try {
      if (activeDoc) {
        const { doc, updateDoc, serverTimestamp: sts } = await import('firebase/firestore');
        await updateDoc(doc(db, 'users', user.uid, 'documents', activeDoc.id), {
          title: title.trim(),
          content,
          updatedAt: sts(),
        });
      } else {
        const ref = await addDoc(collection(db, 'users', user.uid, 'documents'), {
          title: title.trim(),
          content,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setActiveDoc({ id: ref.id, title: title.trim(), content });
        setIsCreatingNew(false);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAISubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsAiLoading(true);

    try {
      const history = aiMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const contextPrompt = content
        ? `You are helping with a document. Current document content:\n\n${content.substring(0, 800)}\n\nUser question: ${userMessage}`
        : userMessage;

      const response = await aiService.chat(contextPrompt, history);
      setAiMessages(prev => [...prev, { role: 'assistant', text: response.text }]);
    } catch (error) {
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        text: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      }]);
    } finally {
      setIsAiLoading(false);
    }
  }, [aiInput, aiMessages, content, isAiLoading]);

  const applyAIToDoc = (text: string) => {
    setContent(prev => prev + '\n\n' + text);
  };

  return (
    <div className="flex h-full bg-[#020306]">
      {/* Left Sidebar: Document List */}
      <div className="w-64 border-r border-white/5 p-4 flex flex-col space-y-4 bg-[#040507]">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Documents</h3>
          <button
            onClick={startNewDoc}
            className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
            aria-label="New document"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto">
          {isCreatingNew && (
            <div className="px-3 py-2 rounded-lg bg-white/5 text-white flex items-center gap-2">
              <FileText size={14} className="text-zinc-300" />
              <span className="text-xs font-medium truncate">Untitled document</span>
            </div>
          )}
          {docs.length === 0 && !isCreatingNew && (
            <p className="text-[10px] text-zinc-600 px-2 py-4 text-center">No documents yet. Create one to get started.</p>
          )}
          {docs.map(doc => (
            <button
              key={doc.id}
              onClick={() => selectDoc(doc)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeDoc?.id === doc.id ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              }`}
            >
              <FileText size={14} className={activeDoc?.id === doc.id ? 'text-zinc-300' : 'text-zinc-600'} />
              <span className="text-xs font-medium truncate">{doc.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020306]">
        {/* Toolbar */}
        <header className="h-14 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Editor</span>
            </div>
          </div>
          <button
            onClick={saveDocument}
            disabled={isSaving || (!title.trim())}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <><Loader2 size={12} className="animate-spin" /> Saving...</>
            ) : saveSuccess ? (
              <><CheckCircle2 size={12} /> Saved</>
            ) : (
              <><Save size={12} /> Save</>
            )}
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="max-w-2xl mx-auto w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title..."
                className="w-full bg-transparent border-none focus:outline-none text-3xl font-semibold text-white mb-6 tracking-tight placeholder:text-zinc-700"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[400px] bg-transparent border-none focus:outline-none text-zinc-400 leading-relaxed text-base resize-none font-sans"
                placeholder="Start writing, or ask the AI assistant on the right for help..."
              />
            </div>
          </div>

          {/* AI Panel */}
          <div className="w-72 border-l border-white/5 p-5 flex flex-col space-y-4 bg-[#040507]">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Assistant</h3>
            </div>

            {/* AI Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
              {aiMessages.length === 0 && (
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                  Ask the assistant to help draft, edit, or improve your document. It can see the current content.
                </p>
              )}
              {aiMessages.map((msg, i) => (
                <div key={i} className={`rounded-xl p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white/5 text-zinc-300'
                    : 'bg-indigo-500/5 border border-indigo-500/10 text-zinc-400'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Assistant</span>
                      <button
                        onClick={() => applyAIToDoc(msg.text)}
                        className="text-[9px] font-bold text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-widest"
                      >
                        Insert ↓
                      </button>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex items-center gap-2 text-indigo-400 text-xs p-3">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Writing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Input */}
            <form onSubmit={handleAISubmit} className="relative">
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAISubmit(e as any); } }}
                disabled={isAiLoading}
                placeholder="Ask the assistant..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500/50 resize-none text-zinc-300 pr-10 min-h-[80px]"
              />
              <button
                type="submit"
                disabled={isAiLoading || !aiInput.trim()}
                className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 size={13} className="animate-spin" /> : <ArrowUp size={13} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
