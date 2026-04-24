'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X, Key, Zap, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

export default function AIConfigModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const savedProvider = localStorage.getItem('ai_provider');
    const savedKey = localStorage.getItem('ai_api_key');
    if (savedProvider) setProvider(savedProvider);
    if (savedKey) setApiKey(savedKey);
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Intento de ping real a Gemini 3.0 Flash Preview
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Responde solo con la palabra OK" }] }]
        })
      });

      const data = await response.json();
      console.log("[AI-TEST] Response from Gemini:", data);

      if (response.ok && data.candidates) {
        setTestResult('success');
      } else {
        console.error("[AI-TEST] Error details:", data.error || data);
        setTestResult('error');
      }
    } catch (error) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('ai_api_key', apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 rounded-[2.5rem] border-primary/20 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 italic">
          <Cpu className="w-6 h-6 text-primary" /> Configurar <span className="text-primary">IA</span>
        </h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 text-white">Elegí tu motor gratuito</label>
            <div className="grid grid-cols-3 gap-2">
              {['gemini', 'groq', 'openai'].map(p => (
                <button
                  key={p}
                  onClick={() => { setProvider(p); setTestResult(null); }}
                  className={`py-3 rounded-xl text-[10px] font-bold border transition-all uppercase ${
                    provider === p ? "bg-primary border-primary text-white" : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 text-white text-white">Tu Token / API Key</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
                placeholder="Pegá tu token de AI Studio..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs outline-none focus:border-primary/50 transition-all text-white"
              />
            </div>
            
            {/* Feedback de Test */}
            <div className="flex justify-between items-center px-1">
              <button 
                onClick={testConnection}
                disabled={!apiKey || isTesting}
                className="text-[9px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Testear Conexión
              </button>
              
              <AnimatePresence>
                {testResult === 'success' && (
                  <motion.span initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 uppercase">
                    <Check className="w-3 h-3" /> Token Válido
                  </motion.span>
                )}
                {testResult === 'error' && (
                  <motion.span initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] font-bold text-red-400 flex items-center gap-1 uppercase">
                    <AlertCircle className="w-3 h-3" /> Token Inválido
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={!apiKey || testResult !== 'success'}
            className={`w-full py-6 rounded-2xl text-lg gap-2 transition-all ${isSaved ? 'bg-emerald-600 border-none' : ''}`}
          >
            {isSaved ? "Todo Listo 🚀" : "Confirmar y Empezar"}
          </Button>
          
          <p className="text-[9px] text-white/20 text-center px-4 leading-relaxed">
            Conseguí tu Key gratis de Gemini en <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-primary underline">Google AI Studio</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
