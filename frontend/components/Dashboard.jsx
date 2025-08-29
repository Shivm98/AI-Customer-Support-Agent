"use client";
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/analytics`);
        const data = await res.json();
        const neutral = data.total - (data.angry + data.happy);
        setStats({
          total: data.total,
          angry: data.angry,
          happy: data.happy,
          neutral,
          topQueries: data.top.map((t) => t.question),
        });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border border-gray-700 rounded-lg bg-gray-800 shadow"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiBarChart2 className="text-blue-400" /> Analytics
        </h2>
        <p className="text-gray-300">Loading...</p>
      </motion.div>
    );
  }

  const sentimentData = [
    { name: 'Angry', value: stats.angry },
    { name: 'Happy', value: stats.happy },
    { name: 'Neutral', value: stats.neutral },
  ];

  const COLORS = ['#f87171', '#34d399', '#60a5fa'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border border-gray-700 rounded-lg bg-gray-800 shadow flex flex-col h-full"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FiBarChart2 className="text-blue-400" /> Analytics
      </h2>
      <p className="mb-4 text-gray-300">Total queries answered: {stats.total}</p>
      <div className="h-48 mb-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={sentimentData}
              dataKey="value"
              outerRadius={80}
              label
            >
              {sentimentData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <h3 className="font-medium mb-2">Top queries</h3>
      <ul className="list-disc ml-6 space-y-1 text-gray-300">
        {stats.topQueries.map((q, idx) => (
          <li key={idx}>{q}</li>
        ))}
      </ul>
    </motion.div>
  );
}
