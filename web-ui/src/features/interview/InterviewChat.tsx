'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, CheckCircle, Terminal, Github } from 'lucide-react';
import { Button } from './ui/Button';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  type?: 'text' | 'action';
}

export default function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: 'Hola. Soy el Tech Lead de SENIORITY.AI. He revisado tu CV y veo que tienes experiencia en el stack solicitado. Empecemos la técnica.' },
    { id: '2', role: 'bot', text: '¿Cómo manejarías una condición de carrera (race condition) en un sistema de transferencias bancarias masivas?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // Simulación de respuesta de la IA
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: (Date.now()+1).toString(), 
        role: 'bot', 
        text: 'Interesante enfoque. ¿Qué trade-offs ves entre usar Optimistic Locking y Pessimistic Locking para este caso?' 
      }]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[600px] glass rounded-[2rem] overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Tech Lead Interviewer</h3>
            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Online / Analyzing</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-primary text-white ml-12 rounded-tr-none' 
                : 'bg-white/5 border border-white/10 mr-12 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none italic text-white/40 text-xs">
                El Tech Lead está escribiendo...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/[0.02] border-t border-white/5">
        <div className="flex gap-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu respuesta técnica..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm outline-none focus:border-primary/50 transition-all"
          />
          <Button onClick={handleSend} className="px-4 py-2 rounded-xl">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
