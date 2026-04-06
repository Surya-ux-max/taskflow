import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Building2, UserCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'Individual', // 'Individual' | 'Organization'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setAccountType = (type) => {
    setFormData({ ...formData, accountType: type });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Floating Background Objects */}
      <motion.div 
        animate={{ y: [0, 50, 0], x: [0, 30, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -right-10 w-64 h-64 bg-orange-400/20 backdrop-blur-3xl rounded-full mix-blend-multiply border border-orange-200/50"
      />
      
      <motion.div 
        animate={{ y: [0, -60, 0], x: [0, -40, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-[5%] w-48 h-48 bg-red-400/20 backdrop-blur-3xl rounded-[3rem] mix-blend-multiply border border-red-200/50"
      />

      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white/70 backdrop-blur-3xl border border-white overflow-hidden rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 flex flex-col md:flex-row"
      >
        {/* Left Form Area */}
        <div className="w-full md:w-3/5 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white/60">
          <div className="mb-8 items-center justify-between flex w-full">
             <div className="w-10 h-10 bg-red-600 rounded-[10px] flex items-center justify-center shadow-md">
                <span className="font-bold text-white tracking-tighter">TF</span>
             </div>
             <p className="text-gray-500 text-sm font-semibold">
                Already have an account? <Link to="/login" className="text-red-600 hover:underline">Log in</Link>
             </p>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Create your account</h1>
            <p className="text-gray-500 font-medium text-sm">Select your account type and start managing projects perfectly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Account Type Toggle */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex relative w-full mb-8">
              <motion.div
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm z-0"
                initial={false}
                animate={{
                  x: formData.accountType === 'Individual' ? '0%' : '100%',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
              
              <button
                type="button"
                onClick={() => setAccountType('Individual')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors z-10 ${formData.accountType === 'Individual' ? 'text-gray-900' : 'text-gray-500'}`}
              >
                <UserCircle className="w-4 h-4" />
                Individual
              </button>
              
              <button
                type="button"
                onClick={() => setAccountType('Organization')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors z-10 ${formData.accountType === 'Organization' ? 'text-gray-900' : 'text-gray-500'}`}
              >
                <Building2 className="w-4 h-4" />
                Organization
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={formData.accountType}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                         {formData.accountType === 'Organization' ? 'Organization Name' : 'Full Name'}
                      </label>
                      <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none text-sm font-medium text-gray-900 shadow-sm"
                            placeholder={formData.accountType === 'Organization' ? 'Acme Corp' : 'John Doe'}
                            required
                          />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none text-sm font-medium text-gray-900 shadow-sm"
                          placeholder="name@company.com"
                          required
                        />
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none text-sm font-medium text-gray-900 shadow-sm"
                      placeholder="8+ characters, robust"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all shadow-lg shadow-red-500/30 group mt-4!"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <p className="text-center text-xs text-gray-500 mt-4">
              By registering, you agree to our <a href="#" className="underline hover:text-gray-800">Terms of Service</a> and <a href="#" className="underline hover:text-gray-800">Privacy Policy</a>
            </p>
          </form>
        </div>

        {/* Right Info Area */}
        <div className="w-full md:w-2/5 flex flex-col justify-center items-start text-left p-12 bg-red-600 rounded-l-3xl md:rounded-l-[3rem] relative overflow-hidden border-t-8 md:border-t-0 md:border-l-8 border-red-500 shadow-inner">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/30 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 w-full">
             <h3 className="text-3xl font-extrabold text-white mb-6 leading-tight">Simplify your <br/>workflow today.</h3>
             
             <ul className="space-y-5">
                {[
                  "Unlimited Projects & Tasks",
                  "Advanced Team Collaboration",
                  "Automated Reminders",
                  "Enterprise Grade Security"
                ].map((feature, i) => (
                   <li key={i} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                      <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                      {feature}
                   </li>
                ))}
             </ul>

             <div className="mt-12 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm">
                <p className="text-white text-sm italic font-medium leading-relaxed">
                   "TaskFlow dramatically improved how our teams organize sprints. The analytics feature alone is worth it!"
                </p>
                <div className="mt-4 flex items-center gap-3">
                   <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full border border-white/40" alt="Reviewer" />
                   <div>
                      <div className="text-white font-bold text-xs">Sarah Jenkins</div>
                      <div className="text-white/60 text-xs">VP of Product, TechCorp</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;
