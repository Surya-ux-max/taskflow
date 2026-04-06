import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Search, Calendar, Users, ArrowRight, CheckCircle2, Clock, AlertTriangle, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import CreateProjectModal from '../components/CreateProjectModal';

const TABS = ['All', 'In Progress', 'Planning', 'At Risk', 'Completed'];

const statusIcon = {
  Completed:    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  'In Progress':<Clock className="w-3.5 h-3.5 text-blue-500" />,
  'At Risk':    <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />,
  Planning:     <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />,
};

const statusStyles = {
  Completed:    'bg-emerald-50 text-emerald-700 border-emerald-100',
  'In Progress':'bg-blue-50 text-blue-700 border-blue-100',
  'At Risk':    'bg-orange-50 text-orange-700 border-orange-100',
  Planning:     'bg-gray-100 text-gray-600 border-gray-200',
};

const barColor = (proj) =>
  proj.progress === 100 ? 'bg-emerald-500' :
  proj.status === 'At Risk' ? 'bg-orange-500' : 'bg-red-500';

const ProjectCard = ({ proj, idx }) => {
  const { getProjectMembers } = useProjects();
  const members = getProjectMembers(proj.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
    >
      {/* Color bar */}
      <div className={`h-1.5 w-full ${proj.color}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 ${proj.color} rounded-lg flex items-center justify-center shrink-0`}>
              <FolderKanban className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                {proj.name}
              </h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">{proj.desc}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ml-2 flex items-center gap-1 ${statusStyles[proj.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {statusIcon[proj.status]}
            {proj.status}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-semibold text-gray-400 mb-1.5">
            <span>Progress</span><span>{proj.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proj.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + idx * 0.06 }}
              className={`h-full rounded-full ${barColor(proj)}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Member avatars */}
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
            {/* Task count */}
            <span className="text-[10px] text-gray-400 font-medium">{proj.tasks.length} tasks</span>
          </div>

          <div className="flex items-center gap-2">
            {proj.deadline && (
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <Calendar className="w-3 h-3" />
                {new Date(proj.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
            <Link to={`/project/${proj.id}`}
              className="flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors">
              Open <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} projects across your workspace</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
        >
          <Plus className="w-4 h-4" /> New Project
        </motion.button>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {activeTab === tab && (
                <motion.div layoutId="projects-tab-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
              )}
              <span className="relative z-10">{tab}</span>
              {counts[tab] > 0 && (
                <span className={`relative z-10 ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="block w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
            placeholder="Search projects..." />
        </div>
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FolderKanban className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No projects found</h3>
            <p className="text-sm text-gray-400 mb-6">
              {search ? `No results for "${search}"` : `No ${activeTab.toLowerCase()} projects yet.`}
            </p>
            <button onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-500/20">
              <Plus className="w-4 h-4" /> Create your first project
            </button>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence initial={false}>
              {filtered.map((proj, idx) => (
                <ProjectCard key={proj.id} proj={proj} idx={idx} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Projects;
