"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Chat() {
  // Pre-populate with dummy messages so the UI can be previewed without a backend.
  const [messages, setMessages] = useState([
    { role: 'user', text: 'What is your refund policy?' },
    {
      role: 'bot',
      text: 'You can request a refund within 30 days of purchase. Please provide your order ID.',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;
    const res = await fetch('/api/chat', {
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
