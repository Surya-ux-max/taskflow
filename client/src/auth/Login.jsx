import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, name: email.split('@')[0], accountType: 'Organization' }); // Mocking Org for simplicty on login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Floating Background Objects */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[10%] w-32 h-32 bg-red-400/20 backdrop-blur-3xl rounded-3xl mix-blend-multiply border border-red-200/50"
      />
      
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -20, 0], rotate: [0, -90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[15%] w-48 h-48 bg-orange-400/20 backdrop-blur-3xl rounded-full mix-blend-multiply border border-orange-200/50"
      />

      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/80"
      >
        {/* Left Panel: Graphic/Brand */}
        <div className="w-full md:w-5/12 bg-white/40 p-12 flex flex-col justify-between relative overflow-hidden border-r border-white/50">
          
          <div className="relative z-10">
            <Link to="/">
              <div className="w-12 h-12 bg-red-600 rounded-[1rem] flex items-center justify-center shadow-lg shadow-red-500/30 mb-8 hover:scale-105 transition-transform cursor-pointer">
                <span className="font-bold text-xl text-white tracking-tighter">TF</span>
              </div>
            </Link>
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900 leading-tight tracking-tight">
              Welcome back to <span className="text-red-600">TaskFlow.</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Log in to manage your projects, teams, and tasks with unparalleled clarity and speed.
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/60 p-4 rounded-2xl border border-white">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Trusted by teams at</p>
            <div className="flex gap-4 opacity-60 grayscale filter">
              <div className="h-6 w-16 bg-gray-400 rounded"></div>
              <div className="h-6 w-16 bg-gray-400 rounded"></div>
              <div className="h-6 w-16 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white/80">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Access Your Account</h1>
            <p className="text-gray-500 text-sm font-medium">Don't have an account? <Link to="/register" className="text-red-600 font-bold hover:underline">Create an account</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none sm:text-sm font-medium text-gray-900 shadow-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <a href="#" className="text-red-600 hover:text-red-700 text-xs font-bold transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none sm:text-sm font-medium text-gray-900 shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all shadow-lg shadow-red-500/30 group"
            >
              Sign In to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-400 font-semibold">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm font-bold text-gray-700 text-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </button>
              <button className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm font-bold text-gray-700 text-sm">
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5 mr-2" />
                GitHub
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
