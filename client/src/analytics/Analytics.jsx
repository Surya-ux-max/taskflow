import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

// --- Typewriter ---
const Typewriter = ({ text, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 38);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return (
    <span>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-7 bg-red-500 ml-1 align-middle"
      />
    </span>
  );
};

// --- Flip metric card ---
const FlipCard = ({ icon, label, value, badge, badgeColor, glowColor, delay }) => {
  const [flipped, setFlipped] = useState(false);

  const sparkline = [30, 55, 40, 70, 60, 85, 75];
  const max = Math.max(...sparkline);
  const points = sparkline
    .map((v, i) => `${(i / (sparkline.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-40 cursor-pointer"
      style={{ perspective: 800 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <div className={`absolute top-0 right-0 w-32 h-32 ${glowColor} blur-2xl rounded-full -mr-10 -mt-10`} />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-gray-50">{icon}</div>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${badgeColor}`}>{badge}</span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold relative z-10">{label}</h3>
          <div className="text-3xl font-bold text-gray-900 mt-1 relative z-10">{value}</div>
        </div>

        {/* Back — sparkline */}
        <div
          className="absolute inset-0 bg-gray-900 p-6 rounded-3xl border border-gray-800 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">7-day trend</p>
          <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points={points}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-white font-bold text-lg">{value}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Bar chart ---
const chartData = [
  { day: 'Mon', completed: 65, pending: 35 },
  { day: 'Tue', completed: 80, pending: 45 },
  { day: 'Wed', completed: 40, pending: 60 },
  { day: 'Thu', completed: 95, pending: 20 },
  { day: 'Fri', completed: 70, pending: 50 },
  { day: 'Sat', completed: 30, pending: 20 },
  { day: 'Sun', completed: 45, pending: 15 },
];

const Analytics = () => {
  const [titleDone, setTitleDone] = useState(false);
  const title = 'Analytics Dashboard';

  useEffect(() => {
    const t = setTimeout(() => setTitleDone(true), title.length * 38 + 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-red-600 shrink-0" />
            {titleDone ? title : <Typewriter text={title} delay={100} />}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Examine performance metrics and task completion rates.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block p-2.5 font-medium outline-none cursor-pointer">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-md"
          >
            Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* Flip metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FlipCard
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          label="Total Task Completion"
          value="84.2%"
          badge="+14.5%"
          badgeColor="text-emerald-600 bg-emerald-50"
          glowColor="bg-emerald-500/10"
          delay={0.05}
        />
        <FlipCard
          icon={<Activity className="w-6 h-6 text-blue-600" />}
          label="Pending vs Completed Ratio"
          value="1:4.5"
          badge="-2.1%"
          badgeColor="text-red-600 bg-red-50"
          glowColor="bg-blue-500/10"
          delay={0.12}
        />
        <FlipCard
          icon={<Users className="w-6 h-6 text-purple-600" />}
          label="Team Efficiency Score"
          value="A-"
          badge="+8.4%"
          badgeColor="text-emerald-600 bg-emerald-50"
          glowColor="bg-purple-500/10"
          delay={0.19}
        />
      </div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Weekly Task Velocity</h2>
            <p className="text-sm text-gray-500">Completed vs pending tasks — last 7 days.</p>
          </div>
          <div className="flex gap-4 text-sm font-semibold">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-3 h-3 rounded-full bg-emerald-500" /> Completed
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-3 h-3 rounded-full bg-gray-300" /> Pending
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between h-72 gap-2 px-2">
          {chartData.map((data, idx) => (
            <div key={data.day} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex justify-center items-end gap-1.5 h-64 bg-gray-50/50 rounded-xl p-1 group-hover:bg-gray-100/60 transition-colors relative">

                {/* Completed bar */}
                <div className="w-full max-w-[24px] bg-emerald-100 rounded-lg relative flex flex-col justify-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.completed}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 + idx * 0.07 }}
                    className="w-full bg-emerald-500 rounded-lg group-hover:shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-shadow"
                  />
                  <div className="absolute top-1 left-0 right-0 text-center opacity-0 group-hover:opacity-100 text-[10px] font-bold text-emerald-900 transition-opacity">
                    {data.completed}
                  </div>
                </div>

                {/* Pending bar */}
                <div className="w-full max-w-[24px] bg-gray-100 rounded-lg relative flex flex-col justify-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.pending}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.55 + idx * 0.07 }}
                    className="w-full bg-gray-300 rounded-lg"
                  />
                  <div className="absolute top-1 left-0 right-0 text-center opacity-0 group-hover:opacity-100 text-[10px] font-bold text-gray-700 transition-opacity">
                    {data.pending}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500 mt-4">{data.day}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
