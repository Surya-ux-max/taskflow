import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Users, Plus, MoreHorizontal, MessageSquare, Paperclip,
  CheckCircle2, Clock, AlertTriangle, LayoutGrid, ArrowLeft, User
} from 'lucide-react';
import Modal from '../components/Modal';
import { useProjects } from '../context/ProjectContext';

const CURRENT_USER_ID = 1; // Alex Morgan

const getPriorityColor = (p) =>
  p === 'High' ? 'bg-red-50 text-red-600' :
  p === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600';

const colMeta = [
  { id: 'todo',       title: 'To Do',       color: 'bg-slate-100', dot: 'bg-slate-500' },
  { id: 'inprogress', title: 'In Progress', color: 'bg-blue-50',   dot: 'bg-blue-500'  },
  { id: 'done',       title: 'Done',        color: 'bg-emerald-50',dot: 'bg-emerald-500'},
];

const statusStyles = {
  Completed:    'bg-emerald-50 text-emerald-700',
  'In Progress':'bg-blue-50 text-blue-700',
  'At Risk':    'bg-orange-50 text-orange-700',
  Planning:     'bg-gray-100 text-gray-600',
};

const statusIcon = {
  Completed:    <CheckCircle2 className="w-3.5 h-3.5" />,
  'In Progress':<Clock className="w-3.5 h-3.5" />,
  'At Risk':    <AlertTriangle className="w-3.5 h-3.5" />,
  Planning:     <LayoutGrid className="w-3.5 h-3.5" />,
};

/* ── Task Card ── */
const TaskCard = ({ task, idx, getMember }) => {
  const assignee = getMember(task.assigneeId);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28, delay: idx * 0.05 }}
      whileHover={{ y: -3, boxShadow: '0 12px 28px -8px rgba(0,0,0,0.12)' }}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-3 leading-snug">
        <Link to={`/task/${task.id}`} className="hover:text-red-500 hover:underline">{task.title}</Link>
      </h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-400">
          {task.comments > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium">
              <MessageSquare className="w-3.5 h-3.5" />{task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium">
              <Paperclip className="w-3.5 h-3.5" />{task.attachments}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs font-medium">
              <Calendar className="w-3 h-3" />{task.dueDate}
            </span>
          )}
        </div>
        {assignee && (
          <img src={`https://i.pravatar.cc/100?img=${assignee.avatar}`} alt={assignee.name}
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm" title={assignee.name} />
        )}
      </div>
    </motion.div>
  );
};

/* ── Kanban Column ── */
const KanbanColumn = ({ column, tasks, colIdx, onAddTask, getMember }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: colIdx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="w-80 flex flex-col"
  >
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
        <h3 className="font-bold text-gray-900">{column.title}</h3>
        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
    </div>
    <div className={`flex-1 rounded-2xl p-3 ${column.color} border border-gray-100/50 flex flex-col gap-3 min-h-[500px]`}>
      <AnimatePresence initial={false}>
        {tasks.map((task, idx) => (
          <TaskCard key={task.id} task={task} idx={idx} getMember={getMember} />
        ))}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => onAddTask(column.id)}
        className="mt-2 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-red-600 hover:border-red-300 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Task
      </motion.button>
    </div>
  </motion.div>
);

/* ── Timeline View ── */
const TimelineView = ({ tasks, getMember }) => {
  const sorted = [...tasks].sort((a, b) => {
    const parse = (d) => d ? new Date(`${d} 2026`) : new Date('Dec 31 2026');
    return parse(a.dueDate) - parse(b.dueDate);
  });

  const colLabel = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
  const colDot   = { todo: 'bg-slate-400', inprogress: 'bg-blue-500', done: 'bg-emerald-500' };

  return (
    <div className="space-y-3">
      {sorted.map((task, idx) => {
        const assignee = getMember(task.assigneeId);
        const isMe = task.assigneeId === CURRENT_USER_ID;
        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${isMe ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'} shadow-sm`}
          >
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-3 h-3 rounded-full ${colDot[task.column]}`} />
              {idx < sorted.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/task/${task.id}`} className="font-bold text-sm text-gray-900 hover:text-red-500 hover:underline truncate">
                  {task.title}
                </Link>
                {isMe && <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">You</span>}
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {colLabel[task.column]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />{task.dueDate}
                </span>
              )}
              {assignee && (
                <div className="flex items-center gap-1.5">
                  <img src={`https://i.pravatar.cc/100?img=${assignee.avatar}`} alt={assignee.name}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
                  <span className="text-xs text-gray-500 font-medium hidden sm:block">{assignee.name}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ── My Tasks View ── */
const MyTasksView = ({ tasks, getMember }) => {
  const myTasks = tasks.filter(t => t.assigneeId === CURRENT_USER_ID);
  const groups = colMeta.map(c => ({ ...c, items: myTasks.filter(t => t.column === c.id) }));

  if (myTasks.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <User className="w-10 h-10 mb-3 opacity-40" />
        <p className="font-semibold">No tasks assigned to you in this project.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {groups.filter(g => g.items.length > 0).map(group => (
        <div key={group.id}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full ${group.dot}`} />
            <h3 className="font-bold text-gray-700 text-sm">{group.title}</h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{group.items.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.items.map((task, idx) => (
              <TaskCard key={task.id} task={task} idx={idx} getMember={getMember} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Team Tasks View ── */
const TeamTasksView = ({ tasks, members, getMember }) => (
  <div className="space-y-8">
    {members.map(member => {
      const memberTasks = tasks.filter(t => t.assigneeId === member.id);
      if (memberTasks.length === 0) return null;
      const done = memberTasks.filter(t => t.column === 'done').length;
      const pct = Math.round((done / memberTasks.length) * 100);
      const isMe = member.id === CURRENT_USER_ID;

      return (
        <div key={member.id}>
          {/* Member header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img src={`https://i.pravatar.cc/100?img=${member.avatar}`} alt={member.name}
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
              {member.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">
                {member.name} {isMe && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full ml-1">You</span>}
              </p>
              <p className="text-xs text-gray-400">{member.role} · {memberTasks.length} tasks · {pct}% done</p>
            </div>
            <div className="ml-auto flex-1 max-w-32">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-12">
            {memberTasks.map((task, idx) => (
              <TaskCard key={task.id} task={task} idx={idx} getMember={getMember} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

/* ── Main Component ── */
const TABS = ['Kanban', 'Timeline', 'My Tasks', 'Team'];

const ProjectDetails = () => {
  const { id } = useParams();
  const { getProject, getProjectMembers, getMember, addTask } = useProjects();
  const project = getProject(id);
  const members = getProjectMembers(id);

  const [activeTab, setActiveTab] = useState('Kanban');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', column: 'todo' });

  if (!project) return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
      <p className="font-semibold">Project not found.</p>
      <Link to="/projects" className="text-red-500 text-sm font-bold flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>
    </div>
  );

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    addTask(project.id, { ...newTask, assigneeId: CURRENT_USER_ID, dueDate: '' });
    setNewTask({ title: '', priority: 'Medium', column: 'todo' });
    setIsTaskModalOpen(false);
  };

  const openAddTask = (columnId) => {
    setNewTask(prev => ({ ...prev, column: columnId }));
    setIsTaskModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Link to="/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
            <span className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 ${statusStyles[project.status]}`}>
              {statusIcon[project.status]}{project.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm max-w-2xl ml-7">{project.desc}</p>
          <div className="mt-4 ml-7 flex flex-wrap items-center gap-6 text-sm">
            {project.deadline && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Due: {new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{members.length} Members</span>
              <div className="flex -space-x-2 ml-1">
                {members.slice(0, 4).map(m => (
                  <img key={m.id} src={`https://i.pravatar.cc/100?img=${m.avatar}`} alt={m.name}
                    className="w-6 h-6 rounded-full border-2 border-white" title={m.name} />
                ))}
                {members.length > 4 && (
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center">
                    +{members.length - 4}
                  </div>
                )}
              </div>
            </div>
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-100 rounded-full h-1.5">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
              <span className="text-xs font-bold text-gray-500">{project.progress}%</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
          >
            <Plus className="w-4 h-4" /> Add Task
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {activeTab === tab && (
              <motion.div layoutId="proj-tab-pill"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {activeTab === 'Kanban' && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {colMeta.map((column, colIdx) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    colIdx={colIdx}
                    tasks={project.tasks.filter(t => t.column === column.id)}
                    onAddTask={openAddTask}
                    getMember={getMember}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Timeline' && (
            <TimelineView tasks={project.tasks} getMember={getMember} />
          )}

          {activeTab === 'My Tasks' && (
            <MyTasksView tasks={project.tasks} getMember={getMember} />
          )}

          {activeTab === 'Team' && (
            <TeamTasksView tasks={project.tasks} members={members} getMember={getMember} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Add New Task">
        <form onSubmit={handleCreateTask} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Task Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm font-medium text-gray-900"
              placeholder="e.g. Design System Updates"
              autoFocus required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
              <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium text-gray-900">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Column</label>
              <select value={newTask.column} onChange={e => setNewTask({ ...newTask, column: e.target.value })}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium text-gray-900">
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsTaskModalOpen(false)}
              className="flex-1 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-500/20 transition-all active:scale-95">
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
