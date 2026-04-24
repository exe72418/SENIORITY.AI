'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trophy, AlertCircle, FastForward } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useSeniority } from '../../core/context/SeniorityContext';
import { AIClient, AIProvider } from '../../shared/lib/ai-client';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

export default function InterviewChat() {
  const { career, setAppState } = useSeniority();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      { 
        id: '1', 
        role: 'assistant', 
        text: `Hola, ¿cómo va? Soy el Tech Lead de ${career.industry.toUpperCase()}. Vi tu CV y tu perfil como ${career.role} nivel ${career.seniority} nos interesa.` 
      },
      {
        id: '2',
        role: 'assistant',
        text: 'Para arrancar, contame: ¿Cuál es el mayor desafío técnico que enfrentaste y cómo lo resolviste?'
      }
    ]);
  }, [career.industry, career.role, career.seniority]);

  const handleSend = async (forcedText?: string) => {
    const messageToSend = forcedText || input;
    if (!messageToSend.trim() || isFinished || isTyping) return;
    
    const provider = localStorage.getItem('ai_provider') as AIProvider || 'gemini';
    const apiKey = localStorage.getItem('ai_api_key');

    if (!apiKey) {
      setError("No configuraste tu IA. Hacé clic en 'Configuración IA' arriba.");
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: messageToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const ai = new AIClient(provider, apiKey);
      
      const systemPrompt = `ACTÚA COMO: Un Tech Lead Senior exigente de ${career.industry}. 
      ROL A EVALUAR: ${career.role} (${career.seniority}).
      INSTRUCCIÓN CRÍTICA: Si el candidato te convence o si te pide terminar y su nivel es bueno, DEBES decir la palabra "CONTRATADO" o "HIRED" para finalizar el simulacro. 
      LENGUAJE: Spanglish técnico.`;

      const response = await ai.sendMessage(systemPrompt, [
        ...messages.map(m => ({ role: m.role as 'assistant' | 'user', content: m.text })),
        { role: 'user', content: messageToSend }
      ]);

      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', text: response }]);

      // Detección más flexible de éxito
      const successWords = ['contratado', 'hired', 'bienvenido', 'welcome', 'adentro', 'pasaste'];
      if (successWords.some(word => response.toLowerCase().includes(word))) {
        setIsFinished(true);
      }

    } catch (err: any) {
      setError("Error al conectar con la IA. Verificá tu Token.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] glass rounded-[2.5rem] overflow-hidden border-white/5 relative shadow-2xl shadow-black">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight uppercase italic text-white">Tech Lead <span className="text-primary">Assistant</span></h3>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold italic">
              {isFinished ? 'Verdict Ready' : 'Live Interview'}
            </p>
          </div>
        </div>
        
        {/* BOTÓN DE SKIP (Para el dueño) */}
        {!isFinished && (
          <button 
            onClick={() => setIsFinished(true)}
            className="flex items-center gap-2 text-[9px] font-bold text-white/20 hover:text-primary transition-colors uppercase tracking-widest"
          >
            <FastForward className="w-3 h-3" /> Skip Interview
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' : 'bg-white/[0.03] border border-white/10 text-white/80 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start ml-4">
              <span className="text-[10px] font-bold text-white/20 animate-pulse uppercase tracking-[0.3em]">IA Analizando...</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input / Action Area */}
      <div className="p-8 bg-white/[0.01] border-t border-white/5 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <div className="relative flex gap-4 max-w-4xl mx-auto">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu respuesta técnica..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary/50 transition-all text-white"
              />
              <Button onClick={() => handleSend()} isLoading={isTyping} className="px-8 rounded-2xl h-14">
                Enviar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase tracking-[0.3em]">
                <Sparkles className="w-4 h-4" /> Selección Exitosa <Sparkles className="w-4 h-4" />
              </div>
              <Button 
                onClick={() => setAppState('hired')}
                className="w-full max-w-md py-6 rounded-2xl text-xl bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)]"
              >
                ACEPTAR OFERTA <Trophy className="w-6 h-6 ml-3" />
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
