import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, CheckCircle2, ShieldCheck, CreditCard, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const sectionVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const sectionItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => {
    if (user) setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!user) return null;

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={sectionItem}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-6">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
            className="relative"
          >
            <img
              src={`https://i.pravatar.cc/150?img=${user.avatar || 32}`}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.4 }}
              className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
            <p className="text-gray-500 text-sm font-medium">
              {user.accountType === 'Organization' ? 'Organization Admin' : 'Individual User'}
            </p>
          </div>
        </div>
        <div className="relative z-10 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left col */}
        <div className="flex-1 space-y-6">
          {/* General */}
          <motion.div variants={sectionItem} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              General Information
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm font-medium text-gray-900 shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm font-medium text-gray-900 shadow-sm" />
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Security */}
          <motion.div variants={sectionItem} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              Security & Password
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm font-medium text-gray-900 shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['newPassword', 'confirmPassword'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input type="password" name={field} value={formData[field]} onChange={handleChange} placeholder="••••••••"
                        className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm font-medium text-gray-900 shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-md"
                >
                  Update Password
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right col — subscription */}
        <motion.div variants={sectionItem} className="w-full lg:w-80">
          <div className="bg-gray-900 rounded-3xl border border-gray-800 shadow-xl p-8 text-white relative overflow-hidden group">
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-red-600/30 blur-2xl rounded-full -mr-10 -mt-10"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold tracking-tight">Active Plan</h2>
              </div>
              <div className="text-3xl font-extrabold mb-1">Organization</div>
              <p className="text-gray-400 text-sm mb-6">Billed $199/month</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'Custom Roles'].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Manage Billing
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
