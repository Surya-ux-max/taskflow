import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, FolderKanban, Users, Rocket, Check, Search } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

const STEPS = ['Details', 'Invite Members', 'Launch'];
const COLORS = [
  { label: 'Red',    value: 'bg-red-500' },
  { label: 'Blue',   value: 'bg-blue-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Green',  value: 'bg-emerald-500' },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Pink',   value: 'bg-pink-500' },
];

const CreateProjectModal = ({ isOpen, onClose }) => {
  const { members, createProject } = useProjects();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', desc: '', deadline: '', color: 'bg-red-500', memberIds: [] });

  const reset = () => { setStep(0); setSearch(''); setForm({ name: '', desc: '', deadline: '', color: 'bg-red-500', memberIds: [] }); };
  const handleClose = () => { reset(); onClose(); };

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      memberIds: f.memberIds.includes(id) ? f.memberIds.filter(m => m !== id) : [...f.memberIds, id],
    }));
  };

  const handleLaunch = () => {
    const project = createProject(form);
    handleClose();
    navigate(`/project/${project.id}`);
  };

  const filteredMembers = members.filter(m => m.id !== 1 &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedMembers = members.filter(m => form.memberIds.includes(m.id));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        style={{ perspective: 1000 }}
      >
        <motion.div
          initial={{ opacity: 0, rotateX: -16, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, rotateX: 10, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{ transformOrigin: 'top center' }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">New Project</h3>
              <motion.button whileHover={{ rotate: 90 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ backgroundColor: i <= step ? '#dc2626' : '#f3f4f6', color: i <= step ? '#fff' : '#9ca3af' }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </motion.div>
                    <span className={`text-xs font-semibold ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <motion.div animate={{ backgroundColor: i < step ? '#dc2626' : '#e5e7eb' }} transition={{ duration: 0.3 }}
                      className="flex-1 h-0.5 rounded-full" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 min-h-[320px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Project Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm font-medium text-gray-900 transition-all"
                      placeholder="e.g., Q1 Marketing Campaign" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm font-medium text-gray-900 min-h-[80px] resize-none transition-all"
                      placeholder="What is this project about?" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Deadline</label>
                      <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm font-medium text-gray-900 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                      <div className="flex gap-2 flex-wrap pt-1">
                        {COLORS.map(c => (
                          <button key={c.value} type="button" onClick={() => setForm(f => ({ ...f, color: c.value }))}
                            className={`w-7 h-7 rounded-full ${c.value} transition-transform ${form.color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }} className="space-y-4">
                  <p className="text-sm text-gray-500">Search and add members to this project. You can only invite people already on the platform.</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm font-medium text-gray-900 transition-all"
                      placeholder="Search by name or email..." />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {filteredMembers.map(m => (
                      <motion.div key={m.id} layout
                        onClick={() => toggleMember(m.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${form.memberIds.includes(m.id) ? 'bg-red-50 border border-red-200' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}`}
                      >
                        <img src={`https://i.pravatar.cc/100?img=${m.avatar}`} alt={m.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">{m.name}</div>
                          <div className="text-xs text-gray-500 truncate">{m.email}</div>
                        </div>
                        <motion.div animate={{ scale: form.memberIds.includes(m.id) ? 1 : 0.8, opacity: form.memberIds.includes(m.id) ? 1 : 0.3 }}
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${form.memberIds.includes(m.id) ? 'bg-red-600' : 'bg-gray-300'}`}>
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                  {selectedMembers.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-semibold text-gray-500">Added:</span>
                      <div className="flex -space-x-2">
                        {selectedMembers.map(m => (
                          <img key={m.id} src={`https://i.pravatar.cc/100?img=${m.avatar}`} alt={m.name}
                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm" title={m.name} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">+ you</span>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }} className="space-y-5">
                  <div className={`${form.color} rounded-2xl p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                    <FolderKanban className="w-8 h-8 mb-3 opacity-80" />
                    <h4 className="text-xl font-bold">{form.name || 'Untitled Project'}</h4>
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">{form.desc || 'No description.'}</p>
                    {form.deadline && <p className="text-white/60 text-xs mt-3 font-medium">Due {new Date(form.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">{selectedMembers.length + 1} members</span>
                    </div>
                    <div className="flex -space-x-2">
                      <img src="https://i.pravatar.cc/100?img=32" alt="you" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                      {selectedMembers.map(m => (
                        <img key={m.id} src={`https://i.pravatar.cc/100?img=${m.avatar}`} alt={m.name} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 2 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { if (step === 0 && !form.name.trim()) return; setStep(s => s + 1); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-500/20 transition-all text-sm">
                Continue <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleLaunch}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-500/20 transition-all text-sm">
                <Rocket className="w-4 h-4" /> Launch Project
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateProjectModal;
