'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Terminal, Info, ExternalLink, Code2, Rocket } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import RepoDiscovery from './RepoDiscovery';
import { useSeniority } from '../../core/context/SeniorityContext';

export default function HiredPanel({ industry }: { industry: string }) {
  const { career, updateCareer, setAppState } = useSeniority();
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const handleRepoSelect = (url: string) => {
    setSelectedRepo(url);
    updateCareer({ selectedRepo: url, hired: true });
    // Simulación: Guardamos el repo y vamos al workspace
    setTimeout(() => {
      setAppState('workspace');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-10 rounded-[2.5rem] text-center max-w-2xl mx-auto border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]"
    >
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
      </div>

      <h2 className="text-4xl font-black mb-4 italic text-white uppercase">¡ESTÁS CONTRATADO!</h2>
      <p className="text-white/60 mb-10 text-lg leading-relaxed">
        Pasaste la técnica como <strong>{career.role}</strong>. <br/>
        Bienvenido al equipo de <strong>{industry.toUpperCase()}</strong>.
      </p>

      <AnimatePresence mode="wait">
        {!showDiscovery ? (
          <motion.div key="options" exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left hover:border-primary/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Code2 className="w-6 h-6 text-white" />
                  <h3 className="font-bold text-white uppercase tracking-tighter">Empresa Oficial ({industry})</h3>
                </div>
                <span className="text-[9px] bg-primary/20 text-primary px-2 py-1 rounded font-bold uppercase tracking-wider">Recomendado</span>
              </div>
              <p className="text-xs text-white/40 mb-6 leading-relaxed italic">
                Usaremos la IA para encontrar los mejores proyectos Open Source de este sector en GitHub para que empieces a trabajar.
              </p>
              <Button onClick={() => setShowDiscovery(true)} className="w-full py-4 rounded-xl gap-2 font-black italic">
                EXPLORAR REPOSITORIOS <Rocket className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-left hover:border-white/20 transition-all opacity-50 grayscale hover:grayscale-0">
              <div className="flex items-center gap-3 mb-4 text-white/40">
                <Terminal className="w-6 h-6" />
                <h3 className="font-bold text-white uppercase tracking-tighter">Importar Mi Propio Proyecto</h3>
              </div>
              <p className="text-[10px] text-white/20 mb-6">
                Pegá la URL de tu propio repo. La IA actuará como tu CTO para llevar tu idea al siguiente nivel de Seniority.
              </p>
              <Button variant="outline" className="w-full py-4 rounded-xl border-white/5 text-[10px]">
                PRÓXIMAMENTE
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="discovery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {!selectedRepo ? (
              <RepoDiscovery 
                industry={industry} 
                role={career.role} 
                onSelect={handleRepoSelect} 
              />
            ) : (
              <div className="py-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-[0.3em]">
                  Inyectando Tareas en {selectedRepo.split('/').pop()}...
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] pt-8">
        <Info className="w-3 h-3" /> SENIORITY.AI nunca almacena tu código. Todo corre en tu PC.
      </p>
    </motion.div>
  );
}
