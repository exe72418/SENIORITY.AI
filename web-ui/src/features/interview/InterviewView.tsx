'use client';

import React from 'react';
import { useSeniority } from '../../core/context/SeniorityContext';
import InterviewChat from './InterviewChat';
import { Button } from '../../shared/ui/Button';
import { ChevronLeft } from 'lucide-react';

export default function InterviewView() {
  const { career, setAppState } = useSeniority();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <Button 
          variant="ghost" 
          onClick={() => setAppState('onboarding')}
          className="text-white/40 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
        <div className="text-right">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Entrevista en Proceso</h2>
          <p className="text-xs text-white/40">{career.industry.toUpperCase()} - {career.role}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <InterviewChat />
        </div>
        
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold mb-4">Instrucciones</h3>
            <ul className="text-xs text-white/50 space-y-4 leading-relaxed">
              <li>• Respondé con precisión técnica.</li>
              <li>• El Tech Lead evaluará tu capacidad de razonamiento.</li>
              <li>• Si pasás la técnica, se desbloqueará el entorno de trabajo.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
