"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  const sendMessage = async () => {
    if (!input) return;
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play();
      }
      setMessages([
        ...messages,
        { role: 'user', text: input },
        { role: 'bot', text: data.answer },
      ]);
    } catch (err) {
      console.error(err);
    }
    setInput('');
  };

  return (
    <div>
      <div className="h-64 overflow-y-auto border p-2 mb-4">
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`my-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span className="inline-block px-2 py-1 rounded bg-gray-200">{m.text}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
