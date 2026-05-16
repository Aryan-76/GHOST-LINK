import React, { useState, useCallback } from 'react';
import {
  Shield,
  Settings,
  LogOut,
  Mail,
  Edit2,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/authStore';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  const startEditName = () => {
    setEditedName(user?.displayName || '');
    setIsEditingName(true);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setSaveError(null);
  };

  const saveDisplayName = async () => {
    if (!user || !editedName.trim()) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateProfile(user, { displayName: editedName.trim() });

      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: editedName.trim(),
        updatedAt: serverTimestamp(),
      });

      setIsEditingName(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError('Failed to update name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const userInitial = (user.displayName || user.email || 'U')[0].toUpperCase();
  const memberSince = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-10 pb-24 h-full overflow-y-auto scrollbar-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-10"
      >
        <div className="w-24 h-24 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-3xl font-bold text-zinc-400 uppercase flex-shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : userInitial}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveDisplayName(); if (e.key === 'Escape') cancelEditName(); }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-lg font-bold focus:outline-none focus:border-indigo-500/50 w-48"
                />
                <button onClick={saveDisplayName} disabled={isSaving} className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-all">
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                </button>
                <button onClick={cancelEditName} className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-all">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">{user.displayName || 'Anonymous User'}</h1>
                <button onClick={startEditName} className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all" aria-label="Edit display name">
                  <Edit2 size={14} />
                </button>
              </>
            )}
          </div>
          {saveError && <p className="text-xs text-red-400">{saveError}</p>}
          {saveSuccess && <p className="text-xs text-emerald-400">Name updated successfully.</p>}
          <div className="flex items-center gap-2 text-xs text-zinc-500 justify-center md:justify-start">
            <Mail size={12} />
            <span>{user.email}</span>
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Member since {memberSince}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest"
          aria-label="Sign out"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </motion.div>

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Shield size={12} className="text-indigo-400" /> Account
          </h3>
          <div className="bg-[#0A0B0E] border border-white/5 rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">User ID</p>
              <p className="text-xs font-mono text-zinc-400 break-all">{user.uid}</p>
            </div>
            <div className="h-px bg-white/5" />
            <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Sign-in Method</p>
              <p className="text-xs text-zinc-400 capitalize">
                {user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email & Password'}
              </p>
            </div>
            <div className="h-px bg-white/5" />
            <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Email Verified</p>
              <p className={`text-xs font-bold ${user.emailVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                {user.emailVerified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Settings size={12} className="text-indigo-400" /> Preferences
          </h3>
          <div className="bg-[#0A0B0E] border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Email Notifications</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Receive workspace activity updates</p>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase bg-white/5 px-2 py-1 rounded border border-white/5">Coming Soon</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Appearance</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Light / dark mode toggle</p>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase bg-white/5 px-2 py-1 rounded border border-white/5">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
