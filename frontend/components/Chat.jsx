"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiCpu } from 'react-icons/fi';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pdfText, setPdfText] = useState('');
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setPdfText(data.text || '');
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input) return;
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, pdfText }),
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
    <div className="flex flex-col h-full">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="mb-2"
      />
      <div className="flex-1 overflow-y-auto p-4 mb-4 bg-gray-800/50 rounded-lg space-y-2">
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role !== 'user' && <FiCpu className="text-xl text-blue-400" />}
            <span
              className={`px-3 py-2 rounded-lg max-w-[70%] break-words transition-colors ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {m.text}
            </span>
            {m.role === 'user' && <FiUser className="text-xl text-gray-400" />}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          className="flex-1 px-3 py-2 bg-gray-700 text-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-r-md transition-colors flex items-center gap-1"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
