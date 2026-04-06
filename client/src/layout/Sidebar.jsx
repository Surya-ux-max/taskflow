import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, Users, BarChart3, Bell, Settings, LogOut, Rocket } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Notifications', path: '/notifications', icon: Bell },
];

const bottomItems = [
  { name: 'Settings', path: '/profile', icon: Settings },
];

const NavItem = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className="relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm z-10"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute inset-0 bg-red-50 rounded-xl shadow-sm shadow-red-100/50"
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
      )}
      <motion.span
        className="relative z-10"
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
      </motion.span>
      <span className={`relative z-10 transition-colors ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
        {item.name}
      </span>
    </NavLink>
  );
};

const Sidebar = ({ onClose }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <motion.div
            className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20 relative"
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Rocket className="w-5 h-5 text-white relative z-10" />
            <motion.div
              className="absolute inset-0 rounded-lg bg-red-500"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-gray-900">TaskFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu</div>
        {navItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}

        <div className="mt-8 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Preferences</div>
        {bottomItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium w-full group"
        >
          <motion.span whileHover={{ x: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <LogOut className="w-5 h-5" />
          </motion.span>
          Log out
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
