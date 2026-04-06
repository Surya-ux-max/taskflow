import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, CalendarClock, UserPlus, FileEdit, CheckCircle2, MoreHorizontal, X } from 'lucide-react';

const iconMap = {
  alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  assignment: { icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  update: { icon: FileEdit, color: 'text-orange-600', bg: 'bg-orange-50' },
  success: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const initialNotifications = [
  { id: 1, type: 'alert', title: 'Critical Deadline Approaching', desc: 'The Apollo Web Redesign project is due in 3 days. 4 tasks are still pending.', time: '2 hours ago', read: false },
  { id: 2, type: 'assignment', title: 'New Task Assigned', desc: 'Alex Morgan assigned you to "Design System Update".', time: '5 hours ago', read: false },
  { id: 3, type: 'update', title: 'Project Status Changed', desc: 'Marketing Website status was changed to "In Progress".', time: 'Yesterday', read: true },
  { id: 4, type: 'success', title: 'Deployment Successful', desc: 'Mobile App V2 was successfully deployed to the staging environment.', time: 'Yesterday', read: true },
  { id: 5, type: 'assignment', title: 'Added to Team', desc: 'You were added to the "Q4 Financials" project team.', time: 'Oct 12', read: true },
];

const NotifItem = ({ notif, onDismiss, onMarkRead }) => {
  const meta = iconMap[notif.type] || { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50' };
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 120, transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] } }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => !notif.read && onMarkRead(notif.id)}
      className={`p-5 rounded-2xl flex gap-4 items-start transition-colors group cursor-pointer relative overflow-hidden ${
        notif.read ? 'bg-transparent hover:bg-gray-50' : 'bg-red-50/50 hover:bg-red-50 border border-red-100/50'
      }`}
    >
      {/* Unread left pulse bar */}
      {!notif.read && (
        <motion.div
          className="absolute left-0 top-4 bottom-4 w-1 bg-red-500 rounded-r-full"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className={`p-3 rounded-xl shrink-0 ${meta.bg} relative`}>
        {!notif.read && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white -mt-0.5 -mr-0.5" />
        )}
        <Icon className={`w-5 h-5 ${meta.color}`} />
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <div className="flex justify-between gap-4 mb-1">
          <h4 className={`text-sm tracking-tight truncate ${notif.read ? 'font-semibold text-gray-900' : 'font-extrabold text-gray-900'}`}>
            {notif.title}
          </h4>
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap shrink-0">{notif.time}</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{notif.desc}</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
        className="shrink-0 pt-1 p-2 text-gray-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-red-600" />
            Notifications
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key={unreadCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="text-sm font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-full"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Stay updated on tasks, team activity, and deadlines.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={markAll}
          className="relative z-10 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Mark all as read
        </motion.button>
      </motion.div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2">
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {notifications.map((notif, idx) => (
              <NotifItem
                key={notif.id}
                notif={notif}
                onDismiss={dismiss}
                onMarkRead={markRead}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {notifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-400">You're all caught up!</p>
              </motion.div>
            )}
          </AnimatePresence>

          {notifications.length > 0 && (
            <div className="text-center py-8 border-t border-gray-100/50 mt-2">
              <p className="text-sm font-semibold text-gray-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> End of notifications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
