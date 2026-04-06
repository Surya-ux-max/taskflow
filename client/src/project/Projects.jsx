import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, Plus, Search, Calendar, Users, ArrowRight,
  CheckCircle2, Clock, AlertTriangle, LayoutGrid, LayoutList,
  TrendingUp, MoreHorizontal, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import CreateProjectModal from '../components/CreateProjectModal';

const cn = (...c) => c.filter(Boolean).join(' ');

const TABS = ['All', 'In Progress', 'Planning', 'At Risk', 'Completed'];

const statusMeta = {
  Completed:    { bg: 'bg-emerald-500/10', text: 'text-emerald-700', icon: <CheckCircle2 className="w-3 h-3" />, bar: 'bg-emerald-500' },
  'In Progress':{ bg: 'bg-blue-500/10',    text: 'text-blue-700',    icon: <Clock className="w-3 h-3" />,        bar: 'bg-blue-500'    },
  'At Risk':    { bg: 'bg-orange-500/10',  text: 'text-orange-700',  icon: <AlertTriangle className="w-3 h-3" />,bar: 'bg-orange-500'  },
  Planning:     { bg: 'bg-gray-100',       text: 'text-gray-600',    icon: <LayoutGrid className="w-3 h-3" />,   bar: 'bg-gray-400'    },
};

const barColor = p =>
  p.progress === 100 ? 'bg-emerald-500' : p.status === 'At Risk' ? 'bg-orange-500' : 'bg-red-500';

/* ════════════════════════════════════════════════════════════
   GRID CARD
════════════════════════════════════════════════════════════ */
const GridCard = ({ proj, idx }) => {
  const { getProjectMembers } = useProjects();
  const members = getProjectMembers(proj.id);
  const sm = statusMeta[proj.status] || statusMeta.Planning;
  const done = proj.tasks.filter(t => t.column === 'done').length;

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group flex flex-col"
    >
      {/* Top accent */}
      <div className={cn('h-1 w-full', proj.color)} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', proj.color)}>
              <FolderKanban className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition-colors truncate leading-tight">
                {proj.name}
              </h3>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{proj.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1', sm.bg, sm.text)}>
              {sm.icon}{proj.status}
            </span>
            <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-semibold text-gray-400">Progress</span>
            <span className="text-[11px] font-black text-gray-700">{proj.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 + idx * 0.05 }}
              className={cn('h-full rounded-full', barColor(proj))} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">{done} of {proj.tasks.length} tasks done</span>
            {proj.status === 'At Risk' && (
              <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" /> Needs attention
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map(m => (
                <img key={m.id} src={`https://i.pravatar.cc/100?img=${m.avatar}`} alt={m.name}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm" title={m.name} />
              ))}
              {members.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-gray-500 text-[9px] font-bold flex items-center justify-center">
                  +{members.length - 3}
                </div>
              )}
            </div>
            {proj.deadline && (
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <Calendar className="w-3 h-3" />
                {new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
          <Link to={`/project/${proj.id}`}
            className="flex items-center gap-1 text-[11px] font-black text-red-600 hover:text-red-700 transition-colors group/link">
            Open <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════
   LIST ROW
════════════════════════════════════════════════════════════ */
const ListRow = ({ proj, idx }) => {
  const { getProjectMembers } = useProjects();
  const members = getProjectMembers(proj.id);
  const sm = statusMeta[proj.status] || statusMeta.Planning;
  const done = proj.tasks.filter(t => t.column === 'done').length;

  return (
    <motion.div layout
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
      transition={{ delay: idx * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className={cn('w-1.5 h-10 rounded-full shrink-0', proj.color)} />

      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', proj.color)}>
        <FolderKanban className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/project/${proj.id}`} className="text-sm font-black text-gray-900 group-hover:text-red-600 transition-colors truncate">
            {proj.name}
          </Link>
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0', sm.bg, sm.text)}>
            {sm.icon}{proj.status}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 truncate">{proj.desc}</p>
      </div>

      {/* Progress bar */}
      <div className="hidden sm:flex flex-col gap-1 w-32 shrink-0">
        <div className="flex justify-between text-[10px] font-semibold text-gray-400">
          <span>{done}/{proj.tasks.length} tasks</span><span>{proj.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + idx * 0.04 }}
            className={cn('h-full rounded-full', barColor(proj))} />
        </div>
      </div>

      {/* Members */}
      <div className="hidden md:flex -space-x-2 shrink-0">
        {members.slice(0, 3).map(m => (
          <img key={m.id} src={`https://i.pravatar.cc/100?img=${m.avatar}`} alt={m.name}
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm" title={m.name} />
        ))}
      </div>

      {/* Deadline */}
      {proj.deadline && (
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-gray-400 font-medium shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}

      <Link to={`/project/${proj.id}`}
        className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-colors shrink-0">
        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
      </Link>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════
   SUMMARY BAR
════════════════════════════════════════════════════════════ */
const SummaryBar = ({ projects }) => {
  const total = projects.length;
  const stats = [
    { label: 'In Progress', count: projects.filter(p => p.status === 'In Progress').length, color: 'bg-blue-500',    text: 'text-blue-600'    },
    { label: 'At Risk',     count: projects.filter(p => p.status === 'At Risk').length,     color: 'bg-orange-500', text: 'text-orange-600'  },
    { label: 'Completed',   count: projects.filter(p => p.status === 'Completed').length,   color: 'bg-emerald-500',text: 'text-emerald-600' },
    { label: 'Planning',    count: projects.filter(p => p.status === 'Planning').length,    color: 'bg-gray-400',   text: 'text-gray-600'    },
  ];
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / (total || 1));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-6">
      {stats.map(s => (
        <div key={s.label} className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', s.color)} />
          <span className="text-xs font-semibold text-gray-500">{s.label}</span>
          <span className={cn('text-sm font-black', s.text)}>{s.count}</span>
        </div>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-semibold text-gray-500">Avg progress</span>
        <span className="text-sm font-black text-gray-900">{avgProgress}%</span>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════
   PROJECTS PAGE
════════════════════════════════════════════════════════════ */
const Projects = () => {
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = activeTab === 'All' ? projects : projects.filter(p => p.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    return list;
  }, [projects, activeTab, search]);

  const counts = useMemo(() => {
    const c = { All: projects.length };
    TABS.slice(1).forEach(t => { c[t] = projects.filter(p => p.status === t).length; });
    return c;
  }, [projects]);

  return (
    <div className="space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Workspace</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Projects</h1>
          <p className="text-gray-400 text-sm mt-0.5">{projects.length} projects · {projects.filter(p => p.status !== 'Completed').length} active</p>
        </div>
        <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/25">
          <Plus className="w-4 h-4" /> New Project
        </motion.button>
      </motion.div>

      {/* Summary */}
      <SummaryBar projects={projects} />

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn('relative px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors',
                activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700')}>
              {activeTab === tab && (
                <motion.div layoutId="proj-tab" className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
              )}
              <span className="relative z-10">{tab}</span>
              {counts[tab] > 0 && (
                <span className={cn('relative z-10 ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  activeTab === tab ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500')}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-60 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="block w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
              placeholder="Search projects..." />
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
            {[{ id: 'grid', icon: LayoutGrid }, { id: 'list', icon: LayoutList }].map(v => (
              <button key={v.id} onClick={() => setView(v.id)}
                className={cn('relative p-1.5 rounded-lg transition-colors', view === v.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600')}>
                {view === v.id && (
                  <motion.div layoutId="view-pill" className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                )}
                <v.icon className="w-4 h-4 relative z-10" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FolderKanban className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">No projects found</h3>
            <p className="text-sm text-gray-400 mb-6">
              {search ? `No results for "${search}"` : `No ${activeTab.toLowerCase()} projects yet.`}
            </p>
            <button onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-500/20">
              <Plus className="w-4 h-4" /> Create your first project
            </button>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence initial={false}>
              {filtered.map((proj, idx) => <GridCard key={proj.id} proj={proj} idx={idx} />)}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-2.5">
            <AnimatePresence initial={false}>
              {filtered.map((proj, idx) => <ListRow key={proj.id} proj={proj} idx={idx} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Projects;
