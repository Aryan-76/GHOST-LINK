import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Lock, Fingerprint, Github, Twitter, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

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
        const user = userCredential.user;
        
        // Update Firebase Auth profile
        await updateProfile(user, { displayName });

        // Sync to Firestore users collection
        const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        await setDoc(doc(db, 'users', user.uid), {
          userId: user.uid,
          email: user.email,
          displayName: displayName,
          role: 'user',
          status: 'Active',
          avatarUrl: '',
          updatedAt: serverTimestamp()
        });
      }
      navigate('/workspace');
    } catch (err: any) {
      console.error(err);
      let message = "Authentication failed. Secure link unstable.";
      
      switch (err.code) {
        case 'auth/invalid-credential':
          message = "Invalid credentials or API configuration. Please verify your login details and Firebase API Key.";
          break;
        case 'auth/user-not-found':
          message = "Identity not found in regional registry.";
          break;
        case 'auth/wrong-password':
          message = "Encryption key mismatch. Access denied.";
          break;
        case 'auth/email-already-in-use':
          message = "Identity collision. Email already registered.";
          break;
        case 'auth/operation-not-allowed':
          message = "Authentication provider disabled in cloud manifest.";
          break;
        case 'auth/weak-password':
          message = "Security risk. Password length insufficient.";
          break;
      }
      
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
      const user = userCredential.user;

      // Ensure user exists in Firestore
      const { setDoc, doc, getDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName || 'Anonymous',
          role: 'user',
          status: 'Active',
          avatarUrl: user.photoURL || '',
          updatedAt: serverTimestamp()
        });
      }

      navigate('/workspace');
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        const currentDomain = window.location.hostname;
        console.error(`[Auth Diagnostic] Authentication failed from domain: ${currentDomain}`);
        
        let message = "External authentication link failed.";
        if (err.code === 'auth/unauthorized-domain') {
          message = `Unauthorized Domain. You MUST add "${currentDomain}" to Authorized Domains in Firebase Console > Auth > Settings.`;
        } else if (err.code === 'auth/invalid-credential') {
          message = "Invalid Credentials. Check if your API Key in firebase-applet-config.json is correct for this project.";
        }
        
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020306] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Accent */}
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
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">Sign in to your GhostLink workspace.</p>
        </div>

        <div className="bg-[#0A0B0E] border border-white/5 p-8 rounded-2xl shadow-2xl">
          <div className="flex gap-4 mb-8 border-b border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                isLogin ? 'text-white border-indigo-500' : 'text-zinc-600 border-transparent hover:text-zinc-400'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
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
                className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[10px] font-bold text-red-400 uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-1">Full Name</label>
                <div className="relative">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
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
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-1">Work Email</label>
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
                {isLogin && <a href="#" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white/[0.03] border border-white/5 py-3 pl-11 pr-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 transition-all text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">Or continue with</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white/[0.03] border border-white/5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/[0.06] transition-all text-zinc-400"
              >
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                   <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Google Integration</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
          Secure Infrastructure • SOC 2 Type II
        </p>
      </motion.div>
    </div>
  );
}
