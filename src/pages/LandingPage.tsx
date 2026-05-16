import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  Zap, 
  Lock, 
  Globe, 
  Cpu,
  Layout,
  Twitter,
  Github,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/authStore';

const Nav = React.memo(() => {
  const { user } = useAuthStore();
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020306]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
          <Layout size={18} className="text-white" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">GhostLink</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {['Product', 'Integrations', 'Security', 'Enterprise'].map((item) => (
          <a key={item} href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">{item}</a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <Link to="/workspace" className="px-5 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2">
            Dashboard <ArrowRight size={16} />
          </Link>
        ) : (
          <>
            <Link to="/auth" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Log In</Link>
            <Link to="/auth" className="px-5 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all">
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
});

const Hero = () => (
  <section className="pt-48 pb-20 px-8 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[160px] -z-10 rounded-full" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[140px] -z-10 rounded-full" />
    
    <div className="max-w-6xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Public Beta v1.0 is live</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
          The intelligent workspace <br />
          <span className="text-zinc-500">for modern teams.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          GhostLink combines real-time collaboration with context-aware AI to help your team ship faster, together.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32"
      >
        <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl group">
          Start building <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-white/[0.03] border border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/[0.06] transition-all">
          Product Tour <Zap size={18} className="text-yellow-400" />
        </Link>
      </motion.div>

      {/* Hero Image / Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl mx-auto"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-50" />
        <div className="relative bg-[#0A0B0E] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="flex items-center gap-1.5 p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            <div className="ml-4 h-4 px-3 rounded-full bg-white/5 flex items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              GhostLink Workspace
            </div>
          </div>
          <div className="aspect-[16/9] bg-[#050608] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent)]" />
             <div className="flex flex-col items-center gap-6 relative z-10 text-center px-12">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10">
                   <Sparkles size={32} className="text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">AI-Powered Interaction</h3>
                  <p className="text-sm text-zinc-500 max-w-sm">Every message and document is indexed to provide instant, contextual assistance.</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-48 px-8 border-y border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: <Lock />, title: "Secure by Design", desc: "Enterprise-grade encryption for all your data. Your workspace is isolated and protected." },
          { icon: <Globe />, title: "Global Sync", desc: "Real-time synchronization across teams and regions. Zero latency, 100% data consistency." },
          { icon: <Cpu />, title: "Contextual AI", desc: "Our AI understands your project structure, helping you write documentation and ship code faster." }
        ].map((feature, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            key={feature.title} 
            className="p-10 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] text-indigo-400 flex items-center justify-center mb-10 group-hover:bg-indigo-500/10 transition-colors">
              {React.cloneElement(feature.icon as React.ReactElement, { size: 24 })}
            </div>
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">{feature.title}</h3>
            <p className="text-zinc-500 leading-relaxed font-medium text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default function LandingPage() {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/workspace', { replace: true });
    }
  }, [user, isLoading, navigate]);
  return (
    <div className="min-h-screen bg-[#020306] text-zinc-400 selection:bg-indigo-500 selection:text-white">
      <Nav />
      <Hero />
      <Features />
      
      {/* Trust Section */}
      <section className="py-24 border-b border-white/5 text-center">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-12">Trusted by innovative teams worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-16 px-8 opacity-40">
           <div className="text-xl font-bold text-white tracking-tighter">STRIPE</div>
           <div className="text-xl font-bold text-white tracking-tighter">VERCEL</div>
           <div className="text-xl font-bold text-white tracking-tighter">LINEAR</div>
           <div className="text-xl font-bold text-white tracking-tighter">RAILWAY</div>
        </div>
      </section>

      <footer className="py-24 px-8 bg-[#040507]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Layout size={24} />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">GhostLink</span>
            </div>
            <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
              Empowering high-performance teams with intelligent collaboration tools.
            </p>
            <div className="flex gap-4">
              <Twitter size={20} className="hover:text-indigo-400 cursor-pointer transition-colors" />
              <Github size={20} className="hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 md:gap-20">
            <div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                <li><Link to="/auth" className="hover:text-indigo-400 transition-colors">Workspace</Link></li>
                <li><span className="text-zinc-800 cursor-not-allowed">Integrations (Soon)</span></li>
                <li><span className="text-zinc-800 cursor-not-allowed">API</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                <li><span className="text-zinc-800 cursor-not-allowed">About</span></li>
                <li><span className="text-zinc-800 cursor-not-allowed">Careers</span></li>
                <li><span className="text-zinc-800 cursor-not-allowed">Blog</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                <li><span className="text-zinc-800 cursor-not-allowed">Privacy</span></li>
                <li><span className="text-zinc-800 cursor-not-allowed">Terms</span></li>
                <li><span className="text-zinc-800 cursor-not-allowed">Security</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
          <p>© 2026 GHOSTLINK. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
