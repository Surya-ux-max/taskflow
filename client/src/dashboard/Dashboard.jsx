import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FolderKanban, CheckCircle2, Clock, Plus, Calendar, ArrowRight,
  TrendingUp, Users, Activity, Flame, ArrowUpRight, Sparkles,
  Target, Zap, MoreHorizontal, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import CreateProjectModal from '../components/CreateProjectModal';

const cn = (...c) => c.filter(Boolean).join(' ');

/* ── Count-up ── */
const useCountUp = (target, duration = 1200) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = 0; const step = target / (duration / 16);
    const t = setInterval(() => { s += step; if (s >= target) { setV(target); clearInterval(t); } else setV(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return v;
};

/* ── Sparkline SVG ── */
const Sparkline = ({ data, color = '#ef4444', height = 40 }) => {
  const max = Math.max(...data); const min = Math.min(...data);
  const w = 100; const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / (max - min || 1)) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${pts} ${w},${height}`} fill={color} fillOpacity="0.08" stroke="none" />
    </svg>
  );
};

/* ── Radial progress ── */
const RadialProgress = ({ pct, size = 64, stroke = 5, color = '#ef4444' }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
    </svg>
  );
};

const weekData = [28, 45, 38, 60, 52, 70, 65];
const priorityDot = { High: 'bg-red-500', Medium: 'bg-amber-400', Low: 'bg-emerald-500' };

const MY_TASKS = [
  { id: 101, title: 'Design System Update',  project: 'Apollo Redesign',   priority: 'High',   done: false },
  { id: 103, title: 'Implement JWT Auth',     project: 'Apollo Redesign',   priority: 'High',   done: false },
  { id: 303, title: 'Push Notifications',     project: 'Mobile App V2',     priority: 'Medium', done: false },
  { id: 201, title: 'Content Strategy Doc',   project: 'Marketing Website', priority: 'High',   done: true  },
];

const statusColor = {
  Completed:    { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  'In Progress':{ bg: 'bg-blue-500/10',    text: 'text-blue-600',    dot: 'bg-blue-500'    },
  'At Risk':    { bg: 'bg-orange-500/10',  text: 'text-orange-600',  dot: 'bg-orange-500'  },
  Planning:     { bg: 'bg-gray-200',       text: 'text-gray-600',    dot: 'bg-gray-400'    },
};

const barColor = p =>
  p.progress === 100 ? 'bg-emerald-500' : p.status === 'At Risk' ? 'bg-orange-500' : 'bg-red-500';

/* ════════════════════════════════════════════════════════════
   STAT CARD
════════════════════════════════════════════════════════════ */
const StatCard = ({ title, value, icon: Icon, iconColor, bg, trend, sparkData, idx }) => {
  const count = useCountUp(value, 1000 + idx * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* bg glow */}
      <div className={cn('absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity', bg)} />

      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />{trend}
          </span>
        )}
      </div>

      <div className="text-3xl font-black text-gray-900 tabular-nums mb-0.5">{count}</div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</div>

      {sparkData && (
        <div className="mt-3 h-10 opacity-60 group-hover:opacity-100 transition-opacity">
          <Sparkline data={sparkData} color={iconColor.includes('blue') ? '#3b82f6' : iconColor.includes('emerald') ? '#10b981' : iconColor.includes('orange') ? '#f97316' : '#a855f7'} />
        </div>
      )}
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════
   PROJECT ROW
════════════════════════════════════════════════════════════ */
const ProjectRow = ({ proj, idx }) => {
  const sc = statusColor[proj.status] || statusColor.Planning;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className={cn('w-2 h-10 rounded-full shrink-0', proj.color)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/project/${proj.id}`} className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
            {proj.name}
          </Link>
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0', sc.bg, sc.text)}>
            {proj.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 + idx * 0.06 }}
              className={cn('h-full rounded-full', barColor(proj))} />
          </div>
          <span className="text-[11px] font-bold text-gray-400 shrink-0 w-8 text-right">{proj.progress}%</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-gray-400 font-medium hidden sm:block">{proj.tasks.length} tasks</span>
        <Link to={`/project/${proj.id}`}
          className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-colors">
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════
   ACTIVITY FEED
════════════════════════════════════════════════════════════ */
const ActivityFeed = ({ projects }) => {
  const { getMember } = useProjects();
  const all = projects.flatMap(p => p.activity.map(a => ({ ...a, projectName: p.name }))).slice(-6).reverse();
  return (
    <div className="space-y-3">
      {all.map((a, i) => {
        const m = getMember(a.userId);
        return (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-start gap-3">
            <img src={`https://i.pravatar.cc/100?img=${m?.avatar || 10}`} alt={m?.name}
              className="w-7 h-7 rounded-full border-2 border-white shadow-sm shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold">{m?.name}</span> {a.action}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{a.projectName} · {a.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   WEEKLY BAR CHART
════════════════════════════════════════════════════════════ */
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const completed = [5, 8, 4, 11, 7, 3, 6];
const pending   = [3, 4, 6, 2, 5, 2, 3];

const WeeklyChart = () => (
  <div className="flex items-end gap-2 h-28">
    {days.map((d, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full flex flex-col gap-0.5 items-center">
          <motion.div initial={{ height: 0 }} animate={{ height: `${completed[i] * 7}px` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 + i * 0.06 }}
            className="w-full rounded-t-md bg-red-500 min-h-[4px]" />
          <motion.div initial={{ height: 0 }} animate={{ height: `${pending[i] * 7}px` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + i * 0.06 }}
            className="w-full rounded-b-md bg-gray-200 min-h-[4px]" />
        </div>
        <span className="text-[10px] font-semibold text-gray-400">{d}</span>
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState(MY_TASKS);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const totalTasks   = projects.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks    = projects.reduce((s, p) => s + p.tasks.filter(t => t.column === 'done').length, 0);
  const pendingTasks = totalTasks - doneTasks;
  const doneCount    = tasks.filter(t => t.done).length;
  const completionPct = Math.round((doneTasks / (totalTasks || 1)) * 100);

  const stats = [
    { title: 'Projects',        value: projects.length, icon: FolderKanban, iconColor: 'text-blue-600',    bg: 'bg-blue-100',    trend: '+2',   sparkData: [2,3,2,4,3,4,4] },
    { title: 'Tasks Done',      value: doneTasks,        icon: CheckCircle2, iconColor: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+12%', sparkData: [4,6,5,8,7,9,doneTasks] },
    { title: 'Pending',         value: pendingTasks,     icon: Clock,        iconColor: 'text-orange-600',  bg: 'bg-orange-100',  trend: null,   sparkData: [8,6,9,5,7,6,pendingTasks] },
    { title: 'Team Members',    value: 7,                icon: Users,        iconColor: 'text-purple-600',  bg: 'bg-purple-100',  trend: null,   sparkData: [5,5,6,6,7,7,7] },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{greeting}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{firstName} 👋</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/25">
          <Plus className="w-4 h-4" /> New Project
        </motion.button>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.title} {...s} idx={i} />)}
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Active Projects — 2 cols */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-gray-900">Active Projects</h2>
              <p className="text-xs text-gray-400 mt-0.5">{projects.filter(p => p.status !== 'Completed').length} in progress</p>
            </div>
            <Link to="/projects" className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-1">
            {projects.slice(0, 4).map((p, i) => <ProjectRow key={p.id} proj={p} idx={i} />)}
          </div>
        </motion.div>

        {/* Completion Ring */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-gray-900">Overall Progress</h2>
            <Target className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <RadialProgress pct={completionPct} size={120} stroke={8} color="#ef4444" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900">{completionPct}%</span>
                <span className="text-[10px] font-semibold text-gray-400">done</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
              {[
                { label: 'Completed', value: doneTasks,    color: 'bg-red-500' },
                { label: 'Pending',   value: pendingTasks, color: 'bg-gray-200' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className={cn('w-2 h-2 rounded-full mx-auto mb-1', item.color)} />
                  <div className="text-lg font-black text-gray-900">{item.value}</div>
                  <div className="text-[10px] font-semibold text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* My Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" /> My Tasks
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{doneCount}/{tasks.length} completed today</p>
            </div>
            <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <motion.div animate={{ width: `${(doneCount / tasks.length) * 100}%` }}
                transition={{ duration: 0.5 }} className="h-full bg-orange-400 rounded-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            {tasks.map((task, i) => (
              <motion.div key={task.id} layout
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                className={cn('flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors', task.done ? 'bg-gray-50' : 'hover:bg-gray-50')}
              >
                <motion.div whileTap={{ scale: 0.8 }}
                  className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                    task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-red-400')}>
                  {task.done && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold truncate', task.done ? 'line-through text-gray-400' : 'text-gray-800')}>{task.title}</p>
                  <p className="text-[10px] text-gray-400 truncate">{task.project}</p>
                </div>
                <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', priorityDot[task.priority])} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-black text-gray-900">Weekly Velocity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Tasks completed vs pending</p>
            </div>
            <Link to="/analytics" className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            {[{ color: 'bg-red-500', label: 'Done' }, { color: 'bg-gray-200', label: 'Pending' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                <span className="text-[11px] font-semibold text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
          <WeeklyChart />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: <Zap className="w-3.5 h-3.5 text-amber-500" />, label: 'Velocity', value: '8.4/d' },
              { icon: <Activity className="w-3.5 h-3.5 text-blue-500" />, label: 'Ratio', value: '1:4.5' },
              { icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />, label: 'Rate', value: '84%' },
            ].map(m => (
              <div key={m.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                <div className="flex justify-center mb-1">{m.icon}</div>
                <div className="text-sm font-black text-gray-900">{m.value}</div>
                <div className="text-[10px] text-gray-400 font-semibold">{m.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-gray-900">Activity</h2>
            <button className="text-gray-300 hover:text-gray-500 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <ActivityFeed projects={projects} />
        </motion.div>
      </div>

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
