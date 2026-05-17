import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Lock, User, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/user-not-found': 'No account found with that email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Contact support.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many failed attempts. Please wait and try again.',
  'auth/unauthorized-domain': '',  // handled specially below
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthLoading && user) {
      navigate('/workspace', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        await updateProfile(newUser, { displayName });

        const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        await setDoc(doc(db, 'users', newUser.uid), {
          userId: newUser.uid,
          email: newUser.email,
          displayName,
          role: 'user',
          status: 'online',
          avatarUrl: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      navigate('/workspace');
    } catch (err: any) {
      const message = AUTH_ERROR_MESSAGES[err.code] ?? 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const googleUser = userCredential.user;

      const { setDoc, doc, getDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const userDoc = await getDoc(doc(db, 'users', googleUser.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', googleUser.uid), {
          userId: googleUser.uid,
          email: googleUser.email,
          displayName: googleUser.displayName || 'User',
          role: 'user',
          status: 'online',
          avatarUrl: googleUser.photoURL || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      navigate('/workspace');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') return;

      if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        setError(`Domain "${domain}" is not authorized. Add it to Firebase Console → Authentication → Settings → Authorized domains.`);
      } else {
        const message = AUTH_ERROR_MESSAGES[err.code] ?? 'Google sign-in failed. Please try again.';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020306] flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Layout size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-zinc-500">
            {isLogin ? 'Sign in to your GhostLink workspace.' : 'Get started with GhostLink for free.'}
          </p>
        </div>

        <div className="bg-[#0A0B0E] border border-white/5 p-8 rounded-2xl shadow-2xl">
          <div className="flex gap-4 mb-8 border-b border-white/5">
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                isLogin ? 'text-white border-indigo-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                !isLogin ? 'text-white border-indigo-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'
              }`}
            >
              Get Started
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs text-red-400"
              >
                {error}
              </motion.div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                    className="w-full bg-white/[0.03] border border-white/5 py-3 pl-11 pr-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-white/[0.03] border border-white/5 py-3 pl-11 pr-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2 pl-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/[0.03] border border-white/5 py-3 pl-11 pr-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">Or continue with</p>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/5 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/[0.06] transition-all text-zinc-400 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest">Continue with Google</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
