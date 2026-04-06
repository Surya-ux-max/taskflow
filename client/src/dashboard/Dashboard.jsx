import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, CheckCircle2, Clock, Plus, Calendar, ArrowRight,
  BarChart3, TrendingUp, Users, Activity, Megaphone, X, Circle,
  Flame, ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import CreateProjectModal from '../components/CreateProjectModal';

// ── helpers ──────────────────────────────────────────────────────────────────

const useCountUp = (target, duration = 1000) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

const MagneticButton = ({ onClick, children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.35); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
};

const statusStyles = {
  Completed:   'bg-emerald-50 text-emerald-700',
  'In Progress':'bg-blue-50 text-blue-700',
  'At Risk':   'bg-orange-50 text-orange-700',
  Planning:    'bg-gray-100 text-gray-700',
};

const barColor = (proj) =>
  proj.progress === 100 ? 'bg-emerald-500' :
  proj.status === 'At Risk' ? 'bg-orange-500' : 'bg-red-500';

// ── Recently visited (localStorage) ─────────────────────────────────────────

const RECENT_KEY = 'tf_recent_pages';

export const recordVisit = (path, label, icon) => {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const filtered = stored.filter(r => r.path !== path);
    const updated = [{ path, label, icon, ts: Date.now() }, ...filtered].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
};

const useRecentPages = () => {
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')); } catch { setRecent([]); }
  }, []);
  return recent;
};

// ── Mini analytics (inline) ──────────────────────────────────────────────────

const chartData = [
  { day: 'Mon', completed: 65, pending: 35 },
  { day: 'Tue', completed: 80, pending: 45 },
  { day: 'Wed', completed: 40, pending: 60 },
  { day: 'Thu', completed: 95, pending: 20 },
  { day: 'Fri', completed: 70, pending: 50 },
  { day: 'Sat', completed: 30, pending: 20 },
  { day: 'Sun', completed: 45, pending: 15 },
];

const MiniAnalytics = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-red-600" /> Weekly Task Velocity
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Completed vs pending — last 7 days</p>
      </div>
      <Link to="/analytics" className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
        Full Analytics <ExternalLink className="w-3 h-3" />
      </Link>
    </div>

    {/* Metric chips */}
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, label: 'Completion', value: '84.2%', badge: '+14.5%', badgeColor: 'text-emerald-600 bg-emerald-50' },
        { icon: <Activity className="w-4 h-4 text-blue-600" />,     label: 'Ratio',      value: '1:4.5',  badge: '-2.1%',  badgeColor: 'text-red-600 bg-red-50' },
        { icon: <Users className="w-4 h-4 text-purple-600" />,      label: 'Efficiency', value: 'A-',     badge: '+8.4%',  badgeColor: 'text-emerald-600 bg-emerald-50' },
      ].map((m, i) => (
        <motion.div key={m.label}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1.5"
        >
          <div className="flex items-center justify-between">
            {m.icon}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${m.badgeColor}`}>{m.badge}</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{m.value}</div>
          <div className="text-xs text-gray-500 font-medium">{m.label}</div>
        </motion.div>
      ))}
    </div>

    {/* Bar chart */}
    <div className="flex items-end justify-between h-28 gap-1.5">
      {chartData.map((d, idx) => (
        <div key={d.day} className="flex flex-col items-center flex-1 group">
          <div className="w-full flex justify-center items-end gap-0.5 h-20 bg-gray-50/60 rounded-lg p-0.5 group-hover:bg-gray-100/60 transition-colors">
            <div className="w-full max-w-[10px] bg-emerald-100 rounded flex flex-col justify-end overflow-hidden">
              <motion.div initial={{ height: 0 }} animate={{ height: `${d.completed}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.6 + idx * 0.06 }}
                className="w-full bg-emerald-500 rounded group-hover:shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-shadow" />
            </div>
            <div className="w-full max-w-[10px] bg-gray-100 rounded flex flex-col justify-end overflow-hidden">
              <motion.div initial={{ height: 0 }} animate={{ height: `${d.pending}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.72 + idx * 0.06 }}
                className="w-full bg-gray-300 rounded" />
            </div>
          </div>
          <span className="text-[10px] font-semibold text-gray-400 mt-1.5">{d.day}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ stat, idx }) => {
  const count = useCountUp(stat.value, 900 + idx * 150);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow"
    >
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1.5 tabular-nums">{count}</h3>
      </div>
      <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
        {stat.icon}
      </motion.div>
    </motion.div>
  );
};

// ── Project card ─────────────────────────────────────────────────────────────

const ProjectCard = ({ proj, idx }) => (
  <motion.div
    initial={{ opacity: 0, rotateX: 90, transformOrigin: 'top center' }}
    animate={{ opacity: 1, rotateX: 0, transformOrigin: 'top center' }}
    transition={{ delay: 0.2 + idx * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ perspective: 800 }}
    whileHover={{ y: -3, boxShadow: '0 16px 32px -8px rgba(0,0,0,0.09)' }}
    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm group"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-2.5 h-2.5 rounded-full ${proj.color} shrink-0 mt-0.5`} />
        <div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
            <Link to={`/project/${proj.id}`}>{proj.name}</Link>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{proj.desc}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${statusStyles[proj.status] || 'bg-gray-100 text-gray-700'}`}>
        {proj.status}
      </span>
    </div>

    <div className="mb-3">
      <div className="flex justify-between text-[10px] font-semibold text-gray-400 mb-1.5">
        <span>Progress</span><span>{proj.progress}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.35 + idx * 0.07 }}
          className={`h-full rounded-full ${barColor(proj)} relative`}>
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ x: '-100%' }} animate={{ x: '200%' }}
            transition={{ duration: 0.7, ease: 'easeInOut', delay: 1.2 + idx * 0.07 }} />
        </motion.div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
        <Calendar className="w-3 h-3" /> Due {proj.deadline}
      </div>
      <Link to={`/project/${proj.id}`}
        className="flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors">
        Open <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  </motion.div>
);

// ── My Tasks Today ────────────────────────────────────────────────────────────

const MY_TASKS = [
  { id: 101, title: 'Design System Update',   project: 'Apollo Redesign',   priority: 'High',   done: false },
  { id: 103, title: 'Implement JWT Auth',      project: 'Apollo Redesign',   priority: 'High',   done: false },
  { id: 303, title: 'Push Notifications',      project: 'Mobile App V2',     priority: 'Medium', done: false },
  { id: 201, title: 'Content Strategy Doc',    project: 'Marketing Website', priority: 'High',   done: true  },
];

const priorityDot = { High: 'bg-red-500', Medium: 'bg-orange-400', Low: 'bg-emerald-500' };

const MyTasksToday = () => {
  const [tasks, setTasks] = useState(MY_TASKS);
  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const done = tasks.filter(t => t.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> My Tasks Today
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{done}/{tasks.length} completed</p>
        </div>
        <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <motion.div animate={{ width: `${(done / tasks.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-orange-400 rounded-full" />
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task, idx) => (
          <motion.div key={task.id} layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + idx * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer group ${task.done ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
            onClick={() => toggle(task.id)}
          >
            <motion.div whileTap={{ scale: 0.85 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-red-400'}`}>
              {task.done && <Check className="w-3 h-3 text-white" />}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate transition-colors ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.title}
              </p>
              <p className="text-xs text-gray-400 truncate">{task.project}</p>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// need Check icon locally
const Check = ({ className }) => (
  <svg className={className} viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Community Banner ──────────────────────────────────────────────────────────

const CommunityBanner = () => {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('tf_banner_dismissed') === '1');

  const dismiss = () => { localStorage.setItem('tf_banner_dismissed', '1'); setDismissed(true); };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-5 border border-gray-700"
        >
          {/* animated glow */}
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"
            animate={{ x: [0, 40, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"
            animate={{ x: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-600/20 rounded-xl border border-red-500/30 shrink-0">
                <Megaphone className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Announcement</span>
                  <span className="text-[10px] font-bold bg-red-600/30 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">New</span>
                </div>
                <h3 className="text-sm font-bold text-white">Survex × TaskFlow Community is launching</h3>
                <p className="text-xs text-gray-400 mt-0.5 max-w-md">
                  Connect with other teams, share workflows, and get early access to upcoming features. Join the waitlist now.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-red-900/30">
                Join Waitlist
              </motion.button>
              <button onClick={dismiss} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const recent = useRecentPages();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const totalTasks   = projects.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks    = projects.reduce((s, p) => s + p.tasks.filter(t => t.column === 'done').length, 0);
  const pendingTasks = totalTasks - doneTasks;

  const stats = [
    { title: 'Total Projects',   value: projects.length, icon: <FolderKanban className="w-5 h-5 text-blue-500" />,    bg: 'bg-blue-50' },
    { title: 'Tasks Completed',  value: doneTasks,        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
    { title: 'Pending Tasks',    value: pendingTasks,     icon: <Clock className="w-5 h-5 text-orange-500" />,         bg: 'bg-orange-50' },
    { title: 'Active Members',   value: 7,                icon: <Users className="w-5 h-5 text-purple-500" />,         bg: 'bg-purple-50' },
  ];

  const recentIcons = { project: FolderKanban, team: Users, analytics: BarChart3 };

  return (
    <div className="space-y-6">

      {/* ── Zone A: Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <MagneticButton onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
          <Plus className="w-4 h-4" /> New Project
        </MagneticButton>
      </motion.div>

      {/* ── Zone B: Community Banner ── */}
      <CommunityBanner />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.title} stat={s} idx={i} />)}
      </div>

      {/* ── Recently Visited ── */}
      {recent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Jump back in</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {recent.map((r, i) => {
              const Icon = recentIcons[r.icon] || FolderKanban;
              return (
                <motion.div key={r.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={r.path}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-red-200 transition-all whitespace-nowrap group">
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{r.label}</span>
                    <span className="text-[10px] text-gray-400">{new Date(r.ts).toLocaleDateString()}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Zone C: Two-col — Projects + My Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects list — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Active Projects</h2>
            <Link to="/projects" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {projects.slice(0, 4).map((proj, idx) => (
                <ProjectCard key={proj.id} proj={proj} idx={idx} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* My Tasks — 1/3 width */}
        <div>
          <MyTasksToday />
        </div>
      </div>

      {/* ── Zone D: Mini Analytics (bottom) ── */}
      <MiniAnalytics />

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
