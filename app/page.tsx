"use client";
import { useState, useRef, useEffect } from 'react';

// --- কাস্টমাইজেশন সেকশন (এখান থেকে আপনি সব চেঞ্জ করতে পারবেন) ---
const CONFIG = {
  botName: "Mistral Assistant",       // বটের নাম
  botAvatar: "🤖",                    // বটের লোগো/ইমোজি
  themeColor: "bg-indigo-600",        // বাটনের রঙ (Tailwind class)
  userBubbleColor: "bg-indigo-500",   // ইউজারের মেসেজের রঙ
  headerTextColor: "text-indigo-600", // হেডারের লেখার রঙ
  placeholderText: "কিছু একটা লিখুন...", // ইনপুট বক্সের টেক্সট
  systemPrompt: "You are a helpful assistant.", // বট কেমন আচরণ করবে
};
// ---------------------------------------------------------

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: input };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages,
          systemPrompt: CONFIG.systemPrompt // আপনি চাইলে প্রোম্পট পাঠাতে পারেন
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header - কাস্টমাইজড */}
      <header className="bg-white border-b p-4 shadow-sm flex items-center justify-center gap-2">
        <span className="text-2xl">{CONFIG.botAvatar}</span>
        <h1 className={`text-xl font-bold ${CONFIG.headerTextColor}`}>
          {CONFIG.botName}
        </h1>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20 animate-bounce">
            <p className="text-5xl mb-4">{CONFIG.botAvatar}</p>
            <p className="text-lg">হাই! আমি {CONFIG.botName}। আপনাকে আজ কীভাবে সাহায্য করতে পারি?</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-md transition-all ${
              m.role === 'user' 
              ? `${CONFIG.userBubbleColor} text-white rounded-tr-none` 
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
            }`}>
              <p className="leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border p-3 rounded-2xl shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          <input 
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors bg-gray-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={CONFIG.placeholderText}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className={`${CONFIG.themeColor} text-white w-12 h-12 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:bg-gray-400`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
               <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          Powered by Mistral AI | Developed by You
        </p>
      </div>
    </div>
  );
}
