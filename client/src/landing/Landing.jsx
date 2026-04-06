import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Users, BarChart3, Clock, Rocket } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const cards = [
    {
      id: 1,
      title: 'Real-time Tracking',
      description: 'Monitor your progress instantly with live updates and dynamic charts.',
      icon: <Zap className="w-6 h-6 text-red-500" />,
      delay: 0.1,
    },
    {
      id: 2,
      title: 'Effortless Collaboration',
      description: 'Bring your team together with seamless communication tools.',
      icon: <Users className="w-6 h-6 text-red-500" />,
      delay: 0.2,
    },
    {
      id: 3,
      title: 'Smart Analytics',
      description: 'Gain deep insights into your productivity with our advanced analytics engine.',
      icon: <BarChart3 className="w-6 h-6 text-red-500" />,
      delay: 0.3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden selection:bg-red-100 selection:text-red-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              TaskFlow <span className="text-red-600">- Survex</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Product</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Pricing</a>
            <Link to="/login" className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5 active:scale-95 inline-block">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-semibold mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Accelerate your workflow
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8"
          >
            Master your tasks with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
              Elite Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Experience the future of productivity. TaskFlow - Survex helps you organize, 
            optimize, and dominate your daily routine with a premium, seamless interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-500/25 hover:-translate-y-1 transform active:scale-95 text-center inline-block">
              Start Your Free Trial
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all hover:-translate-y-1 transform active:scale-95">
              Watch Demo
            </button>
          </motion.div>

          {/* Floating Cards Demo */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full -z-10 transform -translate-y-12"></div>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: card.delay, ease: "easeOut" }}
                whileHover={{ y: -10 }}
                className="p-8 bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col items-start text-left">
                  <div className="mb-6 p-3 bg-red-50 rounded-2xl shadow-inner group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                    {React.cloneElement(card.icon, { className: 'w-6 h-6 group-hover:text-white transition-colors duration-500' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Social Proof */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-12">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
            <div className="text-3xl font-bold text-gray-900 tracking-tighter">SURVEX</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tighter">FLOW</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tighter">STITCH</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tighter">VOX</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to elevate your flow?</h2>
          <p className="text-red-100 text-lg mb-12 max-w-xl mx-auto">
            Join thousands of professionals who have already optimized their life with TaskFlow - Survex.
          </p>
          <Link to="/login" className="px-12 py-5 bg-white text-red-600 font-bold rounded-2xl shadow-2xl shadow-red-950/20 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 inline-block">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">TaskFlow</span>
        </div>
        <p className="text-gray-500 text-sm">© 2026 Survex Inc. Built with elite obsession.</p>
      </footer>
    </div>
  );
};

export default Landing;
