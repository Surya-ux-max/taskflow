import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Search, MoreVertical, ShieldCheck, User, Building, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const getRoleIcon = (role) => {
  if (role === 'Admin') return <ShieldCheck className="w-4 h-4 text-red-500" />;
  if (role === 'Manager') return <Building className="w-4 h-4 text-blue-500" />;
  return <User className="w-4 h-4 text-gray-500" />;
};

const getRoleColor = (role) => {
  if (role === 'Admin') return 'bg-red-50 text-red-700';
  if (role === 'Manager') return 'bg-blue-50 text-blue-700';
  return 'bg-gray-100 text-gray-700';
};

const MemberRow = ({ member, idx, onRemove }) => (
  <motion.tr
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -80, transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] } }}
    transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="hover:bg-gray-50/50 transition-colors group"
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-4">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
          src={`https://i.pravatar.cc/150?img=${member.avatar}`}
          alt=""
        />
        <div>
          <div className="text-sm font-bold text-gray-900">{member.name}</div>
          <div className="text-sm text-gray-500">{member.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold ${getRoleColor(member.role)}`}>
        {getRoleIcon(member.role)}
        {member.role}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(member.id)}
        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 mr-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Trash2 className="w-5 h-5" />
      </motion.button>
      <button className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100">
        <MoreVertical className="w-5 h-5" />
      </button>
    </td>
  </motion.tr>
);

const TeamManagement = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Member');

  const [members, setMembers] = useState([
    { id: 1, name: 'Alex Morgan', email: 'alex@survex.com', role: 'Admin', avatar: 32 },
    { id: 2, name: 'Jordan Lee', email: 'jordan@survex.com', role: 'Manager', avatar: 48 },
    { id: 3, name: 'Taylor Swift', email: 'taylor@survex.com', role: 'Member', avatar: 12 },
    { id: 4, name: 'Chris Hemsworth', email: 'chris@survex.com', role: 'Member', avatar: 53 },
  ]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    setMembers(prev => [...prev, {
      id: prev.length + 1,
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: newMemberRole,
      avatar: Math.floor(Math.random() * 50) + 1,
    }]);
    setNewMemberEmail('');
    setNewMemberRole('Member');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
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
            <Users className="w-8 h-8 text-red-600" />
            Team Management
          </h1>
          <p className="text-gray-500 text-sm mt-2">Manage members, assign roles, and control access permissions.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsInviteModalOpen(true)}
          className="relative z-10 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-xl group"
        >
          <motion.span whileHover={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
            <UserPlus className="w-4 h-4" />
          </motion.span>
          Invite Member
        </motion.button>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm shadow-sm font-medium"
            placeholder="Search by name or email..."
          />
        </div>
        <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block p-3 font-medium outline-none cursor-pointer">
          <option>All Roles</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Member</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              <AnimatePresence initial={false}>
                {members.map((member, idx) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    idx={idx}
                    onRemove={(id) => setMembers(prev => prev.filter(m => m.id !== id))}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm font-medium text-gray-900"
              placeholder="colleague@survex.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Assign Role</label>
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm font-medium text-gray-900"
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Manager">Manager (Edit Capabilities)</option>
              <option value="Member">Member (Read & Comment)</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsInviteModalOpen(false)} className="flex-1 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-500/20 transition-all active:scale-95">
              Send Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamManagement;
