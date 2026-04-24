'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, CheckCircle2, Clock, Terminal as TerminalIcon, 
  Settings, Bug, Sparkles, Wand2, ArrowRight, Loader2, Send, User, Bot
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useSeniority } from '../../core/context/SeniorityContext';
import { AIClient, AIProvider } from '../../shared/lib/ai-client';

interface Task {
  id: string;
  type: 'bug' | 'feature' | 'refactor';
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimate: string;
  desc: string;
}

export default function WorkspaceView() {
  const { career } = useSeniority();
  const [activeTab, setActiveTab] = useState<'jira' | 'slack'>('slack');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([
    { id: '1', sender: 'Boss', text: '¡Bienvenido al equipo! Tomá un ticket del Jira para arrancar con el sprint.' }
  ]);
  
  const [backlog, setBacklog] = useState<Task[]>([
    { id: 'BANK-101', type: 'bug', title: 'Fix: Validación de montos negativos', priority: 'HIGH', estimate: '2h', desc: 'Error crítico que permite saldos negativos en transferencias.' },
    { id: 'BANK-102', type: 'feature', title: 'Add: Webhook de alertas masivas', priority: 'MEDIUM', estimate: '4h', desc: 'Notificar al sistema de auditoría en transacciones > 10k.' },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    
    const userMsg = { id: Date.now().toString(), sender: 'Me', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const provider = localStorage.getItem('ai_provider') as AIProvider || 'gemini';
      const apiKey = localStorage.getItem('ai_api_key');
      
      if (!apiKey) throw new Error("No API Key");

      const ai = new AIClient(provider, apiKey);
      const systemPrompt = `ACTÚA COMO: Un Tech Lead Senior exigente (The Boss) de la empresa ${career.industry}. 
      TONO: Spanglish técnico, serio, directo. 
      CONTEXTO: El usuario es un desarrollador ${career.role} ${career.seniority}. Tarea actual: ${currentTask?.id || 'Ninguna'}.`;

      const response = await ai.sendMessage(systemPrompt, messages.slice(-5).map(m => ({
        role: m.sender === 'Me' ? 'user' : 'assistant',
        content: m.text
      })).concat([{ role: 'user', content: currentInput }]));

      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'Boss', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', sender: 'System', text: 'Error: Conectá tu IA para hablar con el Boss.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTakeTask = (task: Task) => {
    setCurrentTask(task);
    setBacklog(prev => prev.filter(t => t.id !== task.id));
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'Boss',
      text: `"Buenísimo que agarraste el ticket ${task.id}. Revisá bien la lógica antes de mandarlo a review."`
    }]);
    setActiveTab('slack');
  };

  const handleOpenPR = async () => {
    if (!currentTask) return;
    setIsEvaluating(true);
    setMessages(prev => [...prev, { id: 'eval-1', sender: 'Boss', text: '"Revisando tu código... Aguantame un toque."' }]);
    
    setTimeout(() => {
      setIsEvaluating(false);
      setMessages(prev => [...prev, { id: 'eval-2', sender: 'Boss', text: `"Excelente laburo. El ticket ${currentTask.id} fue aprobado. Siguiente tarea, please."` }]);
      setCurrentTask(null);
    }, 4000);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black">S</div>
          <span className="font-bold tracking-tighter italic">SENIORITY<span className="text-primary">.AI</span></span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <div>
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 px-2 italic">Empresa</h4>
            <div className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">{career.industry}</p>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Canales</h4>
            <div className="space-y-1">
              {['general', 'dev-team', 'hotfixes'].map(channel => (
                <button key={channel} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${channel === 'dev-team' ? 'bg-white/5 text-white shadow-lg shadow-white/5' : 'text-white/40 hover:text-white/10'}`}>
                  <Hash className="w-3 h-3" /> {channel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-white/5 bg-[#050505] flex items-center justify-between px-8 z-20">
          <div className="flex gap-8 h-full">
            <button onClick={() => setActiveTab('slack')} className={`text-[10px] font-black uppercase tracking-[0.2em] border-b-2 h-full ${activeTab === 'slack' ? 'text-primary border-primary' : 'text-white/40 border-transparent'}`}>Slack Terminal</button>
            <button onClick={() => setActiveTab('jira')} className={`text-[10px] font-black uppercase tracking-[0.2em] border-b-2 h-full ${activeTab === 'jira' ? 'text-primary border-primary' : 'text-white/40 border-transparent'}`}>Jira Board</button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'slack' ? (
              <>
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'Me' ? 'bg-primary text-white rounded-tr-none' : 'glass border border-white/10 text-white/80 rounded-tl-none italic'}`}>
                        <p className="text-[9px] font-black uppercase mb-1 opacity-40">{msg.sender}</p>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && <div className="text-[10px] font-bold text-primary animate-pulse italic uppercase">Boss está escribiendo...</div>}
                  <div ref={chatEndRef} />
                </div>
                {/* Chat Input */}
                <div className="p-8 bg-white/[0.01] border-t border-white/5">
                  <div className="flex gap-4 max-w-4xl mx-auto">
                    <input 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Hablá con tu Tech Lead..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm outline-none focus:border-primary/50 text-white"
                    />
                    <Button onClick={handleSendMessage} isLoading={isTyping} className="px-6 rounded-xl h-14">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-black italic mb-8 uppercase">Backlog <span className="text-primary">Sprint #1</span></h2>
                <div className="grid grid-cols-1 gap-4">
                  {backlog.map((task) => (
                    <div key={task.id} className="glass p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all flex justify-between items-center group">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Bug className="w-3 h-3 text-red-500" />
                           <span className="text-[10px] font-black text-white/20">{task.id}</span>
                        </div>
                        <h4 className="font-bold text-white">{task.title}</h4>
                      </div>
                      <Button onClick={() => handleTakeTask(task)} variant="outline" className="opacity-0 group-hover:opacity-100 rounded-xl text-[10px] font-black">START TASK</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="w-80 border-l border-white/5 bg-[#080808] p-6 flex flex-col">
            <div className="flex-1">
               <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 italic"><TerminalIcon className="w-3 h-3" /> System Hub</h4>
               <div className="bg-black rounded-xl p-4 font-mono text-[10px] text-emerald-500/60 h-40 border border-white/5">
                  <p>{'>'} engine online</p>
                  {currentTask && <p className="text-yellow-500">{`> [ACTIVE] ${currentTask.id}`}</p>}
               </div>
            </div>
            {currentTask && (
              <Button onClick={handleOpenPR} disabled={isEvaluating} className="w-full py-5 rounded-2xl text-xs bg-primary shadow-xl shadow-primary/20 font-black italic tracking-widest">
                {isEvaluating ? "EVALUATING..." : "OPEN PULL REQUEST"}
              </Button>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
