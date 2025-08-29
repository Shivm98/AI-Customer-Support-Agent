"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiUser, FiCpu, FiTrash2, FiUploadCloud, FiVolume2, FiVolumeX } from "react-icons/fi";

export default function Chat() {
  const [messages, setMessages] = useState([]); // {role: 'user'|'bot', text: string, ts: number}
  const [input, setInput] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [sending, setSending] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";
  const listRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- Utils
  const scrollToBottom = useCallback(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const playAudio = (base64) => {
    if (muted || !base64) return;
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      audio.play();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Upload Handlers
  const handleUpload = async (file) => {
    if (!file) return;
    setError("");
    setPdfName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setPdfText(data.text || "");
    } catch (err) {
      console.error(err);
      setError("Failed to process PDF. Please try again.");
      setPdfText("");
      setPdfName("");
    }
  };

  const onFileChange = async (e) => handleUpload(e.target.files?.[0]);

  // Drag & Drop
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") handleUpload(file);
  };

  // --- Send
  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    setError("");

    const userMsg = { role: "user", text: input.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text, pdfText }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      playAudio(data.audio);
      const botMsg = { role: "bot", text: data.answer || "(No answer)", ts: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setPdfText("");
    setPdfName("");
    setError("");
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="relative mb-3">
        <div className="absolute inset-0 blur-2xl opacity-60 bg-gradient-to-r from-violet-600/30 via-green-400/20 to-yellow-400/20 -z-10" />
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 grid place-items-center text-white shadow-lg">
              <FiCpu />
            </div>
            <div>
              <div className="text-white font-semibold leading-tight">AI Customer Support</div>
              <div className="text-xs text-white/60">Ask questions, upload a PDF, get answers + audio.</div>
            </div>
            {pdfName && (
              <span className="ml-2 text-xs rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-1 border border-emerald-500/30">PDF: {pdfName}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10 transition"
              title={muted ? "Unmute voice" : "Mute voice"}
            >
              {muted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <button
              onClick={clearChat}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10 transition"
              title="Clear chat"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      {/* Dropzone + File */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`mb-3 rounded-xl border-2 border-dashed ${isDragging ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-white/5"} p-4 text-sm text-white/80 flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg grid place-items-center bg-white/5 border border-white/10">
            <FiUploadCloud className="text-white/80" />
          </div>
          <div>
            <div className="font-medium">Drag & drop a PDF here</div>
            <div className="text-white/60">or click to select a file to ground the chat</div>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-white shadow hover:opacity-95"
        >
          Choose PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-red-200"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-2 mb-3 rounded-xl bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-white/10 backdrop-blur-md">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <motion.div
                key={m.ts + idx}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" && (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 grid place-items-center">
                    <FiCpu />
                  </div>
                )}
                <div className={`${m.role === "user" ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white" : "bg-white/8 text-white border border-white/10"} px-3 py-2 rounded-2xl max-w-[78%] shadow-sm backdrop-blur-sm`}
                >
                  <div className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed">{m.text}</div>
                  <div className="mt-1 text-[10px] opacity-60">
                    {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-white/10 border border-white/15 text-white/80 grid place-items-center">
                    <FiUser />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 justify-start"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 grid place-items-center">
                  <FiCpu />
                </div>
                <div className="px-3 py-2 rounded-2xl bg-white/8 border border-white/10 text-white/80">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-400/40 transition"
          placeholder="Ask anything… (Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={sendMessage}
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow disabled:opacity-60"
        >
          <FiSend />
          {sending ? "Sending…" : "Send"}
        </motion.button>
      </div>
    </div>
  );
}
