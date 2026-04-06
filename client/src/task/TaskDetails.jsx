import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, Flag, AlignLeft, Edit3, Trash2, CheckCircle2, Circle, MoreVertical, ArrowLeft } from 'lucide-react';

const getPriorityColor = (priority) => {
  if (priority === 'High') return 'bg-red-50 text-red-700 ring-red-500/20';
  if (priority === 'Medium') return 'bg-orange-50 text-orange-700 ring-orange-500/20';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-500/20';
};

const getStatusIcon = (status) => {
  if (status === 'Done') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (status === 'In Progress') return <Clock className="w-5 h-5 text-blue-500" />;
  return <Circle className="w-5 h-5 text-gray-400" />;
};

const metaVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const metaItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const TaskDetails = () => {
  const { id } = useParams();
  const [statusOpen, setStatusOpen] = useState(false);

  const [task, setTask] = useState({
    id: id || '101',
    title: 'Design System Update',
    description: 'We need to overhaul the primary colors and standardize the border radius across all components. Specifically, check the primary buttons and input fields to ensure they comply with the new Material styling guidelines. Remember to update the Figma file once complete.',
    assignedTo: 'Alex Morgan',
    priority: 'High',
    deadline: 'Oct 15, 2026',
    status: 'In Progress',
    project: 'Apollo Web Redesign',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/project/1" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
          <motion.span
            className="mr-1"
            whileHover={{ x: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.span>
          Back to {task.project}
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden"
      >
        {/* Actions */}
        <div className="absolute top-8 right-8 flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit3 className="w-5 h-5" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </motion.button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 bg-gray-50 rounded-md">
              TASK-T{task.id}
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight"
          >
            {task.title}
          </motion.h1>
        </div>

        {/* Metadata grid */}
        <motion.div
          variants={metaVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 p-6 bg-[#fafafa] rounded-2xl border border-gray-100/60"
        >
          <div className="space-y-6">
            <motion.div variants={metaItem}>
              <p className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1.5"><User className="w-4 h-4" /> Assignee</p>
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=32" alt="Assignee" className="w-8 h-8 rounded-full shadow-sm" />
                <span className="font-semibold text-gray-900">{task.assignedTo}</span>
              </div>
            </motion.div>
            <motion.div variants={metaItem}>
              <p className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Deadline</p>
              <div className="font-semibold text-gray-900">{task.deadline}</div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div variants={metaItem}>
              <p className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1.5"><Flag className="w-4 h-4" /> Priority</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ring-1 ring-inset ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </motion.div>

            <motion.div variants={metaItem}>
              <p className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Status</p>
              <div className="relative inline-block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatusOpen(o => !o)}
                  className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {getStatusIcon(task.status)}
                  {task.status}
                </motion.button>
                <AnimatePresence>
                  {statusOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                    >
                      {['To Do', 'In Progress', 'Done'].map(s => (
                        <button
                          key={s}
                          onClick={() => { setTask(t => ({ ...t, status: s })); setStatusOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 flex items-center gap-2 ${task.status === s ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}
                        >
                          {getStatusIcon(s)}{s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-gray-400" />
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">{task.description}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;
