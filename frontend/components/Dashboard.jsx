"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // Dummy stats for UI preview
  const stats = {
    total: 42,
    angry: 10,
    happy: 24,
    neutral: 8,
    topQueries: [
      'How do I reset my password?',
      'Where is my order?',
      'What is the refund policy?',
    ],
  };

  const sentimentData = [
    { name: 'Angry', value: stats.angry },
    { name: 'Happy', value: stats.happy },
    { name: 'Neutral', value: stats.neutral },
  ];

  const COLORS = ['#f87171', '#34d399', '#60a5fa'];

  return (
    <div className="p-4 border rounded mt-8 bg-white">
      <h2 className="text-xl font-semibold mb-4">Analytics (Dummy)</h2>
      <p className="mb-4">Total queries answered: {stats.total}</p>
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
      <ul className="list-disc ml-6">
        {stats.topQueries.map((q, idx) => (
          <li key={idx}>{q}</li>
        ))}
      </ul>
    </div>
  );
}
