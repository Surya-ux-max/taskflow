import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, FolderKanban, Users, X, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';

const Topbar = ({ onMenuClick, collapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  const { projects, members } = useProjects();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const q = query.trim().toLowerCase();

  const matchedProjects = q
    ? projects.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedMembers = q
    ? members.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const hasResults = matchedProjects.length > 0 || matchedMembers.length > 0;
  const showDropdown = focused && q.length > 0;

  const handleSelect = (path) => {
    setQuery('');
    setFocused(false);
    navigate(path);
  };

  const displayName = user?.name || 'Alex Morgan';
  const displayRole = user?.accountType === 'Organization' ? 'Organization Admin' : 'Individual User';

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 shrink-0 shadow-sm shadow-gray-100/30">

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors mr-2"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar toggle */}
      <motion.button
        onClick={onToggleCollapse}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-2 shrink-0"
      >
        {collapsed
          ? <PanelLeftOpen className="w-4 h-4" />
          : <PanelLeftClose className="w-4 h-4" />}
      </motion.button>

      {/* Search */}
      <div ref={wrapperRef} className="flex-1 max-w-lg relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            className="block w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
            placeholder="Search projects or people..."
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
            >
              {!hasResults && (
                <div className="px-4 py-6 text-center text-sm text-gray-400 font-medium">
                  No results for "{query}"
                </div>
              )}

              {matchedProjects.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Projects</div>
                  {matchedProjects.map(p => (
                    <button key={p.id} onClick={() => handleSelect(`/project/${p.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                      <div className={`w-7 h-7 ${p.color} rounded-lg flex items-center justify-center shrink-0`}>
                        <FolderKanban className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
                        <div className="text-xs text-gray-400 truncate">{p.status}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {matchedMembers.length > 0 && (
                <div className="border-t border-gray-50">
                  <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">People</div>
                  {matchedMembers.map(m => (
                    <button key={m.id} onClick={() => handleSelect('/team')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                      <img src={`https://i.pravatar.cc/100?img=${m.avatar}`} alt={m.name} className="w-7 h-7 rounded-full shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{m.name}</div>
                        <div className="text-xs text-gray-400 truncate">{m.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400 font-medium">Press Enter to search all results</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right actions */}
      <div className="ml-4 flex items-center gap-3 md:gap-5">
        <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-5 w-5" />
        </Link>

        <div className="h-7 w-px bg-gray-200 hidden md:block" />

        <Link to="/profile" className="flex items-center gap-3 group">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">{displayName}</span>
            <span className="text-xs text-gray-500 font-medium">{displayRole}</span>
          </div>
          <div className="h-9 w-9 rounded-xl border-2 border-white shadow-md overflow-hidden">
            <img src={`https://i.pravatar.cc/150?img=${user?.avatar || 32}`} alt="Profile" className="h-full w-full object-cover" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
