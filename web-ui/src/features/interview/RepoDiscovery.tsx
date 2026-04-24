'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Search, Check, RefreshCw } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { AIClient, AIProvider } from '../../shared/lib/ai-client';

interface RepoSuggestion {
  name: string;
  url: string;
  desc: string;
  stack: string;
}

export default function RepoDiscovery({ industry, role, onSelect }: { industry: string, role: string, onSelect: (url: string) => void }) {
  const [repos, setRepos] = useState<RepoSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRepos = async () => {
    setIsLoading(true);
    try {
      const provider = localStorage.getItem('ai_provider') as AIProvider || 'gemini';
      const apiKey = localStorage.getItem('ai_api_key');
      if (!apiKey) return;

      const ai = new AIClient(provider, apiKey);
      const prompt = `ACTÚA COMO: Un experto en Open Source.
      CONTEXTO: El usuario eligió trabajar en la industria ${industry} como ${role}.
      TAREA: Sugerí los 5 mejores repositorios reales de GitHub para esta industria. 
      FORMATO: Respondé ÚNICAMENTE con un array JSON de objetos: [{"name": "...", "url": "...", "desc": "...", "stack": "..."}]`;

      const response = await ai.sendMessage("Responde solo JSON.", [{ role: 'user', content: prompt }]);
      
      // Limpiar el JSON de posibles backticks de markdown
      const cleanJson = response.replace(/```json|```/g, '').trim();
      setRepos(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Error fetching repos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRepos(); }, []);

  return (
    <div className="space-y-6 mt-8">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Seleccioná tu Empresa (Repo)</h3>
        <button onClick={fetchRepos} className="text-[10px] text-primary hover:text-white transition-colors flex items-center gap-1 font-bold">
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Refrescar Lista
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl border border-white/5" />)
        ) : (
          repos.map((repo, i) => (
            <motion.div
              key={repo.url}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(repo.url)}
              className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Github className="w-4 h-4 text-white/60" />
                    <h4 className="font-bold text-sm text-white group-hover:text-primary transition-colors">{repo.name}</h4>
                  </div>
                  <p className="text-[10px] text-white/30 leading-relaxed max-w-md line-clamp-2">
                    {repo.desc}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[8px] font-black bg-white/5 text-white/40 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-white/5">
                      {repo.stack}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
