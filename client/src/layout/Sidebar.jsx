import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, Users, BarChart3, Bell, Settings, LogOut } from 'lucide-react';

const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="9" fill="#ef4444" />
    <rect x="7" y="8" width="18" height="3" rx="1.5" fill="white" />
    <rect x="7" y="14" width="11" height="3" rx="1.5" fill="white" opacity="0.85" />
    <rect x="7" y="20" width="7" height="3" rx="1.5" fill="white" opacity="0.6" />
    <circle cx="23" cy="22" r="4" fill="white" opacity="0.95" />
    <path d="M21.5 22l1 1 2-2" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navItems = [
  { name: 'Dashboard',     path: '/dashboard',     icon: LayoutDashboard },
  { name: 'Projects',      path: '/projects',       icon: FolderKanban    },
  { name: 'Analytics',     path: '/analytics',      icon: BarChart3       },
  { name: 'Team',          path: '/team',           icon: Users           },
  { name: 'Notifications', path: '/notifications',  icon: Bell            },
];

const bottomItems = [
  { name: 'Settings', path: '/profile', icon: Settings },
];

const NavItem = ({ item, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.name : undefined}
      className="relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm z-10 overflow-hidden"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute inset-0 bg-red-50 rounded-xl shadow-sm shadow-red-100/50"
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
      )}
      <motion.span
        className="relative z-10 shrink-0"
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
      </motion.span>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 whitespace-nowrap overflow-hidden transition-colors ${isActive ? 'text-red-600' : 'text-gray-500'}`}
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

const Sidebar = ({ collapsed = false, onClose }) => {
  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 256 }}
      transition={{ type: 'spring', stiffness: 400, damping: 38 }}
      className="bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-hidden"
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2.5 group min-w-0">
          <motion.div
            className="shrink-0"
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Logo size={32} />
          </motion.div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="brand"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg font-black tracking-tight text-gray-900 whitespace-nowrap overflow-hidden"
              >
                TaskFlow
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-5 flex flex-col gap-0.5">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="menu-label"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3"
            >
              Menu
            </motion.div>
          )}
        </AnimatePresence>

        {navItems.map(item => (
          <NavItem key={item.name} item={item} collapsed={collapsed} />
        ))}

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="pref-label"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2 px-3"
            >
              Preferences
            </motion.div>
          )}
        </AnimatePresence>

        {bottomItems.map(item => (
          <NavItem key={item.name} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100 shrink-0">
        <Link
          to="/"
          title={collapsed ? 'Log out' : undefined}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium w-full group overflow-hidden"
        >
          <motion.span
            whileHover={{ x: collapsed ? 0 : -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="shrink-0"
          >
            <LogOut className="w-5 h-5" />
          </motion.span>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="logout-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="whitespace-nowrap overflow-hidden"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
