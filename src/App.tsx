import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, Activity, RefreshCw, Lock, Mail, LogOut, 
  ShieldCheck, Zap, Clock, Bell, CheckCircle2, AlertCircle, 
  User, ArrowLeft, Database, Globe
} from 'lucide-react';
import { useDashboardStore } from './store/useDashboardStore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

type AuthView = 'login' | 'register' | 'forgot_password' | 'reset_password';

export default function App() {
  const { 
    isAuthenticated, loginError, login, logout, metrics, 
    historicalData, updateLiveStream, registerUser 
  } = useDashboardStore();
  
  // Auth Layout & Form States
  const [authView, setAuthView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  // UI & Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'infrastructure'>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  // Advanced Interactive Tech States
  const [currentLatency, setCurrentLatency] = useState(22);
  const [activeToasts, setActiveToasts] = useState<{id: number, type: 'error' | 'success', msg: string}[]>([]);
  const [nodes, setNodes] = useState([
    { id: 'us-west', name: 'Americas-West-1', status: 'Operational', dynamicLoad: 42 },
    { id: 'eu-central', name: 'Europe-Central-2', status: 'Operational', dynamicLoad: 28 },
    { id: 'ap-fourth', name: 'Asia-Pacific-4', status: 'Operational', dynamicLoad: 61 }
  ]);

  // Mock Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Security Alert', desc: 'New login from unknown IP', time: '2m ago', read: false, type: 'alert' },
    { id: 2, title: 'System Update', desc: 'Edge nodes updated to v4.2', time: '1h ago', read: false, type: 'info' },
    { id: 3, title: 'Backup Complete', desc: 'Database snapshot successful', time: '5h ago', read: true, type: 'success' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Lightweight Toast Dispatcher Engine
  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setActiveToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Advanced Background Simulation Loop (Web Streaming Simulation)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      // 1. Simulate dynamic, erratic server latency spikes
      const baseLatency = Math.random() > 0.85 ? Math.floor(120 + Math.random() * 60) : Math.floor(15 + Math.random() * 25);
      setCurrentLatency(baseLatency);

      // 2. Anomaly Detection: If latency spikes, automatically inject a toast and alert notification
      if (baseLatency > 100) {
        triggerToast(`High network latency detected: ${baseLatency}ms!`, 'error');
        setNotifications(prev => [
          {
            id: Date.now(),
            title: 'Latency Spike Detected',
            desc: `Node latency expanded abnormally to ${baseLatency}ms. Checking node infrastructure loops.`,
            time: 'Just now',
            read: false,
            type: 'alert'
          },
          ...prev
        ]);
      }

      // 3. Modulate load levels across regional processing nodes dynamically
      setNodes(prevNodes => prevNodes.map(node => ({
        ...node,
        dynamicLoad: Math.max(10, Math.min(100, node.dynamicLoad + Math.floor(Math.random() * 11) - 5)),
        status: node.dynamicLoad > 90 ? 'Degraded' : 'Operational'
      })));

      // 4. Update core revenue metrics stream
      const nextDataPoint = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        revenue: 45000 + Math.random() * 1200,
        activeUsers: 1200 + Math.floor(Math.random() * 80),
      };
      updateLiveStream(nextDataPoint);
    }, 3000);

    return () => clearInterval(interval);
  }, [updateLiveStream, isAuthenticated]);

  // Auth Action Handlers linked to Toast System
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    login(email, password);
    // Explicit timeout to check state directly post-evaluation
    setTimeout(() => {
      if (useDashboardStore.getState().isAuthenticated) {
        triggerToast('Welcome back to the core deck.', 'success');
      }
    }, 50);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    const success = registerUser(email, password);
    if (success) {
      triggerToast('Local user registered successfully!', 'success');
      setAuthView('login');
      setPassword('');
      setConfirmPassword('');
    } else {
      setLocalError('An account with this email address already exists.');
    }
  };

  const handleNodeReboot = (nodeName: string) => {
    triggerToast(`Initiating software sequence reset on ${nodeName}...`, 'success');
    setNodes(prev => prev.map(n => n.name === nodeName ? { ...n, dynamicLoad: 0, status: 'Rebooting' } : n));
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.name === nodeName ? { ...n, dynamicLoad: 25, status: 'Operational' } : n));
      triggerToast(`${nodeName} online. Hot-reload verified.`, 'success');
    }, 3000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    const userExists = useDashboardStore.getState().users.some(u => u.email === email.toLowerCase());
    if (!userExists) {
      setLocalError('No account found with that email identifier.');
      return;
    }
    setAuthSuccessMessage('Identity verified. Please set your new password.');
    setAuthView('reset_password');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    const currentUsers = useDashboardStore.getState().users;
    const targetEmail = email.toLowerCase();
    const updatedUsers = currentUsers.map(u => u.email === targetEmail ? { ...u, password } : u);
    useDashboardStore.setState({ users: updatedUsers });
    triggerToast('Access structural password reset successful.', 'success');
    setAuthView('login');
    setPassword('');
    setConfirmPassword('');
  };

  const handleGoogleLogin = () => {
    setLocalError('');
    const googleEmail = 'user.nexus@google.com'; 
    registerUser(googleEmail, undefined, true);
    useDashboardStore.setState({ isAuthenticated: true, loginError: null });
    triggerToast('Authenticated via Google Single Sign-On', 'success');
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // --- RENDER: MULTI-VIEW AUTHENTICATION INTERFACE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 antialiased">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/30 mb-4">Ω</div>
            <h1 className="text-xl font-black text-white tracking-tight">Nexus OS</h1>
            <p className="text-slate-400 mt-0.5 font-medium text-xs">Centralized Intelligence Portal</p>
          </div>

          {authSuccessMessage && (
            <div className="mb-6 p-4 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccessMessage}</span>
            </div>
          )}

          {(loginError || localError) && (
            <div className="mb-6 p-4 text-xs font-bold text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError || loginError}</span>
            </div>
          )}

          {authView === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => { setAuthView('forgot_password'); setLocalError(''); setAuthSuccessMessage(''); }} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-blue-600/20 tracking-wider">
                SIGN IN TO PORTAL
              </button>

              <div className="relative my-6 flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or Continue With</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button type="button" onClick={handleGoogleLogin} className="w-full py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-3 shadow-md">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.423 1.487 15.62 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"/>
                </svg>
                Sign in with Google
              </button>

              <p className="text-center text-xs text-slate-400 pt-2">
                New to the platform?{' '}
                <button type="button" onClick={() => { setAuthView('register'); setLocalError(''); setAuthSuccessMessage(''); }} className="text-blue-400 font-bold hover:underline">
                  Create an account
                </button>
              </p>
            </form>
          )}

          {authView === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-blue-600/20 tracking-wider">
                REGISTER INSTANCE
              </button>
              <div className="flex justify-center pt-2">
                <button type="button" onClick={() => { setAuthView('login'); setLocalError(''); }} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
              </div>
            </form>
          )}

          {authView === 'forgot_password' && (
            <form onSubmit={handleForgotSubmit} className="space-y-5">
              <p className="text-xs text-slate-400 text-center leading-relaxed mb-2">
                Enter your system identifier email. We will process your verification routing to generate password overwrite access.
              </p>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="System Email" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-blue-600/20 tracking-wider">
                SEND OVERWRITE REQUEST
              </button>
              <div className="flex justify-center pt-2">
                <button type="button" onClick={() => { setAuthView('login'); setLocalError(''); }} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          )}

          {authView === 'reset_password' && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" required
                />
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs rounded-2xl transition-all tracking-wider">
                CONFIRM PASS OVERWRITE
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 selection:bg-blue-100">
      
      {/* ENTERPRISE NOTIFICATION TOAST LAYER */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-80">
        {activeToasts.map(t => (
          <div key={t.id} className={`p-4 rounded-2xl border text-xs font-bold shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 ${t.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-rose-500/5' : 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-500/5'}`}>
            {t.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* GLOBAL NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 border-b border-slate-200 backdrop-blur-2xl px-6">
        <div className="max-w-7xl mx-auto flex justify-between h-20 items-center">
          <div className="flex items-center space-x-4 group cursor-default">
            <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg group-hover:bg-blue-600 transition-colors">Ω</div>
            <div>
              <span className="text-lg font-black tracking-tighter block leading-none text-slate-900">NEXUS</span>
              <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Analytics V4</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('infrastructure')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'infrastructure' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Infrastructure
            </button>
          </div>

          <div className="flex items-center space-x-3 relative">
             <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`p-2.5 rounded-xl border transition-all relative ${showNotifications ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600'}`}
             >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
                )}
             </button>

             {showNotifications && (
               <div className="absolute top-14 right-0 w-80 bg-white rounded-[2rem] border border-slate-200 shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Notifications</h3>
                   <button onClick={markAllRead} className="text-[10px] font-black text-blue-600 hover:underline">Mark all read</button>
                 </div>
                 <div className="max-h-[350px] overflow-y-auto">
                   {notifications.map((n) => (
                     <div key={n.id} className={`p-5 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'alert' ? 'bg-rose-100 text-rose-600' : n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                         {n.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                       </div>
                       <div className="flex-1">
                         <p className="text-sm font-bold text-slate-900 leading-none">{n.title}</p>
                         <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{n.desc}</p>
                         <p className="text-[10px] font-black text-slate-300 mt-2 uppercase">{n.time}</p>
                       </div>
                     </div>
                   ))}
                 </div>
                 <button className="w-full py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-colors">View All History</button>
               </div>
             )}

             <button onClick={logout} className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-rose-600 transition-all shadow-md">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10" onClick={() => setShowNotifications(false)}>
        {activeTab === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Summary</h1>
                <p className="text-slate-500 font-medium mt-1">Global business telemetry and user behavior.</p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Zap className="w-5 h-5" /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase leading-none">System Load</p>
                       <p className="text-sm font-black text-slate-900">Normal</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               {[
                 { label: 'Revenue', value: `$${metrics.currentMRR.toLocaleString()}`, trend: '+12.5%', color: 'blue', icon: TrendingUp },
                 { label: 'Active Users', value: metrics.activeUsersCount, trend: 'Live', color: 'indigo', icon: Users },
                 { label: 'Session Churn', value: `${metrics.churnRate}%`, trend: '-0.4%', color: 'rose', icon: Activity },
               ].map((m, i) => (
                 <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{m.label}</span>
                       <div className={`p-3 bg-${m.color}-50 text-${m.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}><m.icon className="w-6 h-6" /></div>
                    </div>
                    <div className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{m.value}</div>
                    <div className={`px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black w-fit uppercase text-slate-500 tracking-widest`}>{m.trend} Snapshot</div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Growth Velocity</h3>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-blue-600">
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                       <span>REAL-TIME STREAM</span>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData}>
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="timestamp" hide />
                        <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }} />
                        <Area type="stepAfter" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fill="url(#chartGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="lg:col-span-1 space-y-4">
                  <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-900/20 h-full">
                     <h3 className="text-sm font-black uppercase tracking-widest mb-8 opacity-50">Security Feed</h3>
                     <div className="space-y-6">
                        {[
                          { time: '2m', msg: 'Firewall block: IP .234', type: 'shield' },
                          { time: '14m', msg: 'New admin: User_09', type: 'user' },
                          { time: '1h', msg: 'DB Backup Success', type: 'db' },
                        ].map((alert, i) => (
                          <div key={i} className="flex items-start space-x-4">
                             <div className="w-2 h-2 mt-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                             <div>
                                <p className="text-xs font-bold leading-tight">{alert.msg}</p>
                                <p className="text-[10px] font-black opacity-40 mt-1 uppercase">{alert.time} ago</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-12">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Core Infrastructure</h1>
               <p className="text-slate-500 font-medium mt-1">Management of distributed cluster nodes and latency.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                           <ShieldCheck className="w-6 h-6 text-emerald-500" />
                           <h3 className="font-black text-slate-900 uppercase tracking-tighter">System Health (Dynamic Matrix)</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400">99.98% UPTIME</span>
                     </div>
                     
                     <div className="space-y-8">
                        {nodes.map((node) => (
                          <div key={node.id} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors">
                             <div className="flex justify-between mb-3 items-center">
                                <div>
                                  <span className="text-sm font-black text-slate-800 mr-3">{node.name}</span>
                                  <span className="text-xs text-slate-400">Load: {node.dynamicLoad}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] font-black uppercase ${node.status === 'Operational' ? 'text-emerald-500' : node.status === 'Rebooting' ? 'text-blue-500 animate-pulse' : 'text-amber-500'}`}>
                                    {node.status}
                                  </span>
                                  {node.status === 'Operational' && (
                                    <button 
                                      onClick={() => handleNodeReboot(node.name)}
                                      className="px-2 py-1 text-[9px] font-black bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-500 transition-colors uppercase tracking-wider"
                                    >
                                      Hot-Reboot
                                    </button>
                                  )}
                                </div>
                             </div>
                             <div className="flex gap-1.5 h-4">
                                {[...Array(34)].map((_, i) => {
                                  let bgClass = "bg-emerald-500";
                                  if (node.status === 'Rebooting') bgClass = "bg-slate-200";
                                  else if (i > 28 && node.dynamicLoad > 75) bgClass = "bg-amber-400";
                                  return (
                                    <div 
                                      key={i} 
                                      className={`flex-1 rounded-[3px] transition-all ${bgClass}`}
                                    ></div>
                                  );
                                })}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { label: 'Flush Cache', icon: RefreshCw, action: () => triggerToast('Core cache storage flushed cleanly.') },
                       { label: 'Backup DB', icon: Database, action: () => triggerToast('Database binary cluster backup scheduled.') },
                       { label: 'Deploy Edge', icon: Globe, action: () => triggerToast('Edge container deployment initialized across 12 zones.', 'success') },
                       { label: 'System Logs', icon: Clock, action: () => triggerToast('Security log dump downloaded to local desk.') },
                     ].map((action, i) => (
                       <button key={i} onClick={action.action} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center gap-3 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm group">
                          <action.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-center">{action.label}</span>
                       </button>
                     ))}
                  </div>
               </div>

               <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full"></div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-blue-400">Cluster Console</h3>
                  <div className="space-y-6 font-mono">
                     {[
                       { cmd: 'nexus_node --check', res: 'SUCCESS', color: 'text-emerald-400' },
                       { cmd: 'latency --ping', res: `${currentLatency}ms`, color: currentLatency > 100 ? 'text-rose-400 font-bold animate-pulse' : 'text-blue-400' },
                       { cmd: 'ssl --verify', res: 'VALID', color: 'text-emerald-400' },
                       { cmd: 'threat_hunt', res: '0 THREATS', color: 'text-slate-400' },
                     ].map((line, i) => (
                       <div key={i} className="text-[11px]">
                          <div className="flex items-center space-x-2 text-slate-500 mb-1">
                             <span className="text-blue-500">$</span>
                             <span>{line.cmd}</span>
                          </div>
                          <div className={`${line.color} ml-4 tracking-tighter`}>{line.res}</div>
                       </div>
                     ))}
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/5">
                     <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-4">
                        <span>Total Edge Traffic</span>
                        <span>1.2TB/s</span>
                     </div>
                     <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%]"></div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
         )}
       </main>
     </div>
   );
}