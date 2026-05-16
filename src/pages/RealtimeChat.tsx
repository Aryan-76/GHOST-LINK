import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Send,
  Sparkles,
  Loader2,
  FileText,
  Hash,
  X,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  deleteDoc
} from 'firebase/firestore';

import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Message as MessageType } from '../types';
import { aiService } from '../services/aiService';
import { useAuthStore } from '../store/authStore';

const DEFAULT_CHANNELS = ['general', 'product', 'engineering', 'design'];

const MessageBubble = React.memo(({ user, text, time, isAI, id, onDelete, isOwn }: MessageType & { onDelete?: (id: string) => void; isOwn?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-start gap-4 p-3 rounded-xl transition-all group ${isAI ? 'bg-indigo-500/5 border border-indigo-500/10' : 'hover:bg-white/[0.02]'}`}
  >
    <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-sm ${
      isAI ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'
    }`}>
      {(user || 'U')[0].toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-sm font-semibold ${isAI ? 'text-indigo-400' : 'text-white'}`}>{user}</span>
        {isAI && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 uppercase tracking-widest">AI</span>}
        <span className="text-[10px] font-medium text-zinc-600 ml-auto">{time}</span>
        {isOwn && onDelete && id && (
          <button
            onClick={() => onDelete(id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-700 hover:text-red-400 transition-all"
            aria-label="Delete message"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  </motion.div>
));

export default function RealtimeChat() {
  const { user } = useAuthStore();
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'channels', activeChannel, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        const ts = data.timestamp as Timestamp;
        return {
          id: doc.id,
          user: data.userDisplayName || 'User',
          text: data.text,
          isAI: data.isAI,
          userId: data.userId,
          time: ts ? ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
        };
      });
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `channels/${activeChannel}/messages`);
    });

    return () => unsubscribe();
  }, [user, activeChannel]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, 'channels', activeChannel, 'messages', messageId));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSummarize = async () => {
    if (messages.length < 2 || isSummarizing) return;
    setIsSummarizing(true);
    try {
      const chatContext = messages.map(m => `${m.user}: ${m.text}`).join('\n');
      const response = await aiService.chat(`Summarize this conversation concisely, noting any key decisions or action items:\n\n${chatContext}`);

      await addDoc(collection(db, 'channels', activeChannel, 'messages'), {
        text: `**Summary**\n\n${response.text}`,
        userId: 'ghost-assistant',
        userDisplayName: 'Ghost Assistant',
        isAI: true,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `channels/${activeChannel}/messages`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping || !user) return;

    const userEntry = inputValue.trim();
    setInputValue('');

    try {
      await addDoc(collection(db, 'channels', activeChannel, 'messages'), {
        text: userEntry,
        userId: user.uid,
        userDisplayName: user.displayName || user.email || 'User',
        isAI: false,
        timestamp: serverTimestamp()
      });

      // Trigger AI if message starts with @ai or @assistant
      if (userEntry.toLowerCase().startsWith('@ai') || userEntry.toLowerCase().startsWith('@assistant')) {
        setIsTyping(true);
        const history = messages.slice(-8).map(m => ({
          role: m.isAI ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

        const response = await aiService.chat(userEntry.replace(/^@(ai|assistant)\s*/i, ''), history);

        await addDoc(collection(db, 'channels', activeChannel, 'messages'), {
          text: response.text,
          userId: 'ghost-assistant',
          userDisplayName: 'Ghost Assistant',
          isAI: true,
          timestamp: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `channels/${activeChannel}/messages`);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()) || m.user.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex h-full overflow-hidden bg-[#020306]">
      {/* Channels Sidebar */}
      <div className="w-64 border-r border-white/5 flex flex-col bg-[#040507]">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={13} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full bg-white/[0.03] border border-white/5 py-2 pl-9 pr-3 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/10 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3 px-2">Channels</div>
          {DEFAULT_CHANNELS.map(ch => (
            <button
              key={ch}
              onClick={() => { setActiveChannel(ch); setSearchQuery(''); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                ch === activeChannel ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              }`}
            >
              <Hash size={15} className={ch === activeChannel ? 'text-zinc-300' : 'text-zinc-600'} />
              <span>{ch}</span>
            </button>
          ))}
        </div>

        <div className="p-4 bg-indigo-500/5 border-t border-white/5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={13} className="text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Assistant</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Start your message with <span className="text-zinc-300 font-mono">@ai</span> to get a reply from the assistant.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#020306]">
        {/* Header */}
        <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <Hash size={16} className="text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">{activeChannel}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing || messages.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-all disabled:opacity-50"
            >
              {isSummarizing ? <Loader2 size={11} className="animate-spin" /> : <FileText size={11} />}
              {isSummarizing ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1 scrollbar-hidden">
          {searchQuery && (
            <div className="flex items-center justify-between py-2 px-3 bg-amber-500/5 border border-amber-500/10 rounded-lg mb-4">
              <span className="text-xs text-amber-400">Showing results for "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="text-zinc-600 hover:text-zinc-400 transition-colors"><X size={12} /></button>
            </div>
          )}
          <AnimatePresence>
            {filteredMessages.map((msg, i) => (
              <MessageBubble
                key={msg.id || i}
                {...msg}
                isOwn={msg.userId === user?.uid}
                onDelete={handleDeleteMessage}
              />
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-3 py-2 text-indigo-400 text-xs"
            >
              <Loader2 size={12} className="animate-spin" />
              <span>Assistant is typing...</span>
            </motion.div>
          )}
          {filteredMessages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Hash size={32} className="text-zinc-800 mb-4" />
              <p className="text-sm font-medium text-zinc-600">
                {searchQuery ? 'No messages match your search.' : `No messages in #${activeChannel} yet.`}
              </p>
              {!searchQuery && <p className="text-xs text-zinc-700 mt-1">Be the first to say something!</p>}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 pb-6">
          <form
            onSubmit={handleSendMessage}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-3 focus-within:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Message #${activeChannel}... (use @ai to ask the assistant)`}
                className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-zinc-700 focus:ring-0"
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="p-2 bg-white hover:bg-zinc-200 text-black rounded-lg transition-all disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-end px-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
