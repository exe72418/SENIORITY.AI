'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Briefcase, Globe, Shield, Cpu, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSeniority, Industry, Role, Seniority } from '../../context/SeniorityContext';

const industries = [
  { id: 'banking', name: 'Banking', icon: Database, color: 'text-blue-400', desc: 'Core systems & security' },
  { id: 'erp', name: 'ERP Systems', icon: Briefcase, color: 'text-green-400', desc: 'Complex business logic' },
  { id: 'ecommerce', name: 'E-commerce', icon: Globe, color: 'text-purple-400', desc: 'Scale & UX performance' },
  { id: 'cyber', name: 'Cybersecurity', icon: Shield, color: 'text-red-400', desc: 'Identity & Auth' },
  { id: 'agrotech', name: 'AgroTech', icon: Cpu, color: 'text-yellow-400', desc: 'IoT & Data analysis' },
];

export default function OnboardingView() {
  const { career, updateCareer, setAppState } = useSeniority();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-20">
        <h1 className="text-4xl font-black italic tracking-tighter">
          SENIORITY<span className="text-primary">.AI</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <h2 className="text-6xl font-black mb-12 tracking-tight leading-[0.9]">
            EL CAMINO AL <br />
            <span className="text-primary text-8xl">SENIORITY</span>.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industries.map((ind) => (
              <div
                key={ind.id}
                onClick={() => updateCareer({ industry: ind.id as Industry })}
                className={`p-8 rounded-3xl border cursor-pointer transition-all ${
                  career.industry === ind.id 
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/20" 
                  : "bg-white/[0.02] border-white/5 hover:border-white/20"
                }`}
              >
                <ind.icon className={`w-10 h-10 mb-6 ${ind.color}`} />
                <h3 className="text-2xl font-bold mb-2">{ind.name}</h3>
                <p className="text-white/40 text-sm">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="glass p-8 rounded-[2.5rem] sticky top-12">
            <h3 className="text-2xl font-bold mb-8 italic">Postulación</h3>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-primary/50 transition-all cursor-pointer">
                <Upload className="w-10 h-10 mx-auto mb-4 text-white/20" />
                <p className="text-sm font-medium text-white/40">Subí tu CV (Análisis por IA)</p>
              </div>

              <div className="space-y-4">
                <select 
                  onChange={(e) => updateCareer({ role: e.target.value as Role })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-primary"
                >
                  <option value="">Selecciona Rol</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                </select>

                <select 
                  onChange={(e) => updateCareer({ seniority: e.target.value as Seniority })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-primary"
                >
                  <option value="">Selecciona Nivel</option>
                  <option value="Trainee">Trainee</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <Button 
                disabled={!career.industry || !career.role || !career.seniority}
                className="w-full py-6 rounded-2xl"
                onClick={() => setAppState('interview')}
              >
                Iniciar Selección
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
