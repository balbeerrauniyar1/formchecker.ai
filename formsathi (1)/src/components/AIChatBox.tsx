import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, X, ShieldCheck } from 'lucide-react';
import { User, VerifiedProfile, UploadedDocument } from '../types';

interface AIChatBoxProps {
  currentUser: User | null;
  profileData: VerifiedProfile | null;
  documents: UploadedDocument[];
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function AIChatBox({ currentUser, profileData, documents }: AIChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I am FormSathi AI. I have learned your document catalog and profile securely. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    if (!isOpen) setIsOpen(true);

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const summaryDocs = documents.map(d => ({
        type: d.type,
        name: d.fileName,
        uploadDate: d.uploadDate
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          profileData: profileData || {},
          documentsData: summaryDocs
        })
      });

      if (!res.ok) throw new Error('Chat API failed');
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="w-full relative font-sans">
      <AnimatePresence>
        {isOpen && (
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-[calc(100%+16px)] left-0 right-0 h-[400px] bg-white border border-[#EBEFF8] rounded-2.5xl shadow-xl overflow-hidden flex flex-col z-50 shadow-[#3B66F5]/5"
           >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[#EBEFF8] bg-[#FAFBFD]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#3B66F5] stroke-[2.2]" />
                  <span className="text-xs font-bold text-[#1A1D24]">FormSathi AI Companion</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[#8C95A6] hover:text-[#1A1D24] transition-colors cursor-pointer">
                  <X className="h-4.5 w-4.5 stroke-[2.2]" />
                </button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4.5 py-3 font-semibold ${
                      msg.role === 'user'
                        ? 'bg-[#3B66F5] text-white rounded-br-none shadow-md shadow-[#3B66F5]/10'
                        : 'bg-[#F3F6FD] text-[#1A1D24] rounded-bl-none border border-[#3B66F5]/10'
                    }`}>
                      <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#F3F6FD] rounded-2xl rounded-bl-none px-4 py-3 border border-[#3B66F5]/10 flex items-center gap-1.5">
                      <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 bg-[#3B66F5] rounded-full" />
                      <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 bg-[#3B66F5] rounded-full" />
                      <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 bg-[#3B66F5] rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSend} className="relative group">
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#3B66F5]" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Ask FormSathi AI any question about forms, deadlines, or docs..."
          className="w-full bg-white border border-[#EBEFF8] hover:border-[#3B66F5]/40 focus:border-[#3B66F5] rounded-2xl pl-12 pr-14 py-4 text-xs text-[#1A1D24] font-bold placeholder:text-[#8C95A6] outline-none transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#3B66F5] text-white p-2.5 rounded-xl hover:bg-[#2F52C7] disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Send className="h-4 w-4 stroke-[2.2]" />
        </button>
      </form>
    </div>
  );
}
