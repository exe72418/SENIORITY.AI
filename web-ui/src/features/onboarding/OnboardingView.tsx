'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Briefcase, Globe, Shield, Cpu, 
  Truck, HeartPulse, GraduationCap, Building2, 
  MapPin, Factory, Smartphone, Search, CheckCircle2,
  Upload, Link as LinkIcon, FileText, Check, Settings
} from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useSeniority, Industry, Role, Seniority } from '../../core/context/SeniorityContext';
import AIConfigModal from './AIConfigModal';

const industries = [
  { id: 'banking', name: 'Global Banking', icon: Database, color: 'from-blue-600 to-cyan-500', desc: 'Sistemas core bancarios y transacciones de alta seguridad con tolerancia a fallos.', skills: ['Java', 'Spring', 'Security'] },
  { id: 'erp', name: 'ERP Enterprise', icon: Briefcase, color: 'from-emerald-600 to-teal-500', desc: 'Lógica de negocio compleja para la gestión masiva de recursos y procesos contables.', skills: ['Python', 'MariaDB', 'Logic'] },
  { id: 'ecommerce', name: 'E-commerce Pro', icon: Globe, color: 'from-purple-600 to-fuchsia-500', desc: 'Plataformas de retail a gran escala con foco en performance de UI y escalabilidad.', skills: ['React', 'GraphQL', 'Scale'] },
  { id: 'cyber', name: 'Cybersecurity', icon: Shield, color: 'from-red-600 to-orange-500', desc: 'Gestión de identidades, protocolos de auth y prevención de amenazas en tiempo real.', skills: ['Go', 'Auth', 'Networking'] },
  { id: 'delivery', name: 'Super-Apps', icon: Smartphone, color: 'from-orange-500 to-yellow-500', desc: 'Logística urbana y tracking en vivo con microservicios y notificaciones push.', skills: ['Flutter', 'Node.js', 'Push'] },
  { id: 'agrotech', name: 'AgroTech', icon: Cpu, color: 'from-lime-600 to-emerald-500', desc: 'Monitoreo de cultivos y gestión de sensores IoT integrados con análisis de datos.', skills: ['Go', 'IoT', 'Sensors'] },
  { id: 'cctv', name: 'AI Surveillance', icon: Search, color: 'from-slate-600 to-slate-400', desc: 'Procesamiento de video en tiempo real y detección de objetos mediante IA.', skills: ['Node.js', 'FFmpeg', 'AI'] },
  { id: 'healthtech', name: 'HealthTech', icon: HeartPulse, color: 'from-rose-600 to-pink-500', desc: 'Registros médicos sensibles y sistemas de salud interoperables bajo normativas HIPAA.', skills: ['React', 'CouchDB', 'Security'] },
  { id: 'edtech', name: 'EdTech Global', icon: GraduationCap, color: 'from-indigo-600 to-blue-500', desc: 'Plataformas de e-learning masivas y sistemas de certificación digital dinámica.', skills: ['PHP', 'Python', 'LMS'] },
  { id: 'govtech', name: 'GovTech', icon: Building2, color: 'from-sky-700 to-indigo-600', desc: 'Digitalización estatal y trámites ciudadanos con base de datos a escala nacional.', skills: ['SQL', 'Scale', 'Citizens'] },
  { id: 'logistics', name: 'Logistics', icon: Truck, color: 'from-amber-700 to-orange-600', desc: 'Optimización de rutas y gestión de flotas multimodales con algoritmos avanzados.', skills: ['Java', 'Algorithms', 'Maps'] },
  { id: 'factory', name: 'Software Factory', icon: Factory, color: 'from-gray-700 to-slate-500', desc: 'Entorno dinámico con rotación de proyectos y stacks variados (Globant Style).', skills: ['Adaptability', 'Agile'] },
  { id: 'geotracking', name: 'Geo-Tracking', icon: MapPin, color: 'from-green-700 to-lime-600', desc: 'Rastreo satelital y telemetría de vehículos en tiempo real mediante protocolos GPS.', skills: ['Java', 'Maps', 'GPS'] },
];

const rolesList = ['Backend', 'Frontend', 'Fullstack', 'Mobile', 'QA Automation', 'Business Analyst'];

export default function OnboardingView() {
  const { career, updateCareer, setAppState } = useSeniority();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateCareer({ cvName: file.name });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <AIConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
      
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-black italic tracking-tighter">
          SENIORITY<span className="text-primary">.AI</span>
        </h1>
        <div className="flex items-center gap-6">
          <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40 text-center hidden md:block">
            Elite Simulator | 13 Industrias | 6 Roles
          </div>
          <button 
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" /> Configuración IA
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-6xl font-black mb-12 tracking-tighter leading-none italic uppercase text-white/90">
              Elegí tu <span className="text-primary text-7xl block md:inline">Carrera</span>.
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => updateCareer({ industry: ind.id as Industry })}
                className={`group relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col ${
                  career.industry === ind.id 
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/20" 
                  : "bg-white/[0.01] border-white/5 hover:border-white/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ind.color} flex items-center justify-center mb-4 shadow-lg shadow-black/40`}>
                  <ind.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors text-white">{ind.name}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed mb-4 flex-1">
                  {ind.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {ind.skills.map((s) => (
                    <span key={s} className="text-[8px] font-black text-white/30 uppercase tracking-tighter">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="glass p-8 rounded-[2.5rem] sticky top-12 border-white/5">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 italic uppercase tracking-tighter text-white">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Perfil de Candidato
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> CV / Experiencia
                </label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.txt,.doc,.docx"
                />

                <div 
                  onClick={triggerFileInput}
                  className={`group relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    career.cvName 
                    ? "border-emerald-500/50 bg-emerald-500/5" 
                    : "border-white/5 bg-white/[0.01] hover:border-primary/40"
                  }`}
                >
                  {career.cvName ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <Check className="w-8 h-8 mb-3 text-emerald-400" />
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest truncate max-w-full px-2">
                        {career.cvName}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-3 text-white/10 group-hover:text-primary transition-colors" />
                      <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Subir CV (PDF / TXT)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Especialización</label>
                <div className="grid grid-cols-2 gap-2">
                  {rolesList.map(r => (
                    <button
                      key={r}
                      onClick={() => updateCareer({ role: (r + (r === 'Business Analyst' ? '' : ' Developer')) as Role })}
                      className={`py-3 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                        career.role.includes(r) 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Dificultad (Seniority)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Trainee', 'Junior', 'Semi-Senior', 'Senior'].map(l => (
                    <button
                      key={l}
                      onClick={() => updateCareer({ seniority: l as Seniority })}
                      className={`py-3 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${
                        career.seniority === l 
                        ? "bg-white/10 border-white/30 text-white italic shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)]" 
                        : "bg-white/5 border-white/5 text-white/20 hover:border-white/10"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                disabled={!career.industry || !career.role || !career.seniority || !career.cvName}
                className="w-full py-6 rounded-2xl text-lg shadow-2xl shadow-primary/40 mt-4 group"
                onClick={() => setAppState('interview')}
              >
                Postularse Ahora <motion.span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">🚀</motion.span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
