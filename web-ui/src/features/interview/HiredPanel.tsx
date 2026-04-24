'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, CheckCircle, Terminal, Info, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';

export default function HiredPanel({ industry }: { industry: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-10 rounded-[2.5rem] text-center max-w-2xl mx-auto border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]"
    >
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
      </div>

      <h2 className="text-4xl font-black mb-4 italic">¡ESTÁS CONTRATADO!</h2>
      <p className="text-white/60 mb-10 text-lg">
        Pasaste la técnica. Bienvenido al equipo de <strong>{industry.toUpperCase()}</strong>. 
        Ahora necesitamos configurar tu entorno de trabajo.
      </p>

      <div className="space-y-6">
        {/* Opción 1: Repositorio Oficial (Open Source) */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left hover:border-primary/50 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-white" />
              <h3 className="font-bold">Repositorio Oficial {industry}</h3>
            </div>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded font-bold uppercase tracking-wider">Recomendado</span>
          </div>
          <p className="text-xs text-white/40 mb-6 leading-relaxed">
            Clonaremos el proyecto original de la industria y crearemos un fork en tu cuenta de GitHub para que la IA inyecte las tareas.
          </p>
          <Button className="w-full py-4 rounded-xl gap-2">
            Clonar e Importar Proyecto <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Opción 2: Proyecto Propio (Emprendedor) */}
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-left hover:border-white/20 transition-all">
          <div className="flex items-center gap-3 mb-4 text-white/40">
            <Terminal className="w-6 h-6" />
            <h3 className="font-bold">Importar Mi Propio Proyecto</h3>
          </div>
          <p className="text-xs text-white/20 mb-6">
            Pega la URL de tu propio repo. La IA actuará como tu CTO para llevar tu idea al siguiente nivel de Seniority.
          </p>
          <input 
            type="text" 
            placeholder="https://github.com/tu-usuario/tu-repo"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-white/30 mb-4"
          />
          <Button variant="outline" className="w-full py-4 rounded-xl border-white/5">
            Configurar Roadmap Propio
          </Button>
        </div>

        <p className="flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] pt-4">
          <Info className="w-3 h-3" /> SENIORITY.AI nunca almacena tu código. Todo corre en tu PC.
        </p>
      </div>
    </motion.div>
  );
}
