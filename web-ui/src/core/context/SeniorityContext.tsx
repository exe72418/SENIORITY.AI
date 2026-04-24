'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Industry = 
  | 'banking' | 'erp' | 'ecommerce' | 'cyber' | 'delivery' 
  | 'agrotech' | 'cctv' | 'healthtech' | 'edtech' | 'govtech' 
  | 'logistics' | 'factory' | 'geotracking' | '';

export type Role = 
  | 'Backend Developer' | 'Frontend Developer' | 'Fullstack Developer' 
  | 'Mobile Developer' | 'QA Automation' | 'Business Analyst' | '';

export type Seniority = 'Trainee' | 'Junior' | 'Semi-Senior' | 'Senior' | '';
export type AppState = 'onboarding' | 'interview' | 'hired' | 'workspace';

interface UserCareer {
  industry: Industry;
  role: Role;
  seniority: Seniority;
  hired: boolean;
  cvName: string;
  selectedRepo?: string;
}

interface SeniorityContextType {
  state: AppState;
  career: UserCareer;
  setAppState: (state: AppState) => void;
  updateCareer: (updates: Partial<UserCareer>) => void;
  resetSession: () => void;
}

const SeniorityContext = createContext<SeniorityContextType | undefined>(undefined);

export function SeniorityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>('onboarding');
  const [career, setCareer] = useState<UserCareer>({
    industry: '',
    role: '',
    seniority: '',
    hired: false,
    cvName: '',
  });

  // CARGAR SESIÓN AL INICIAR
  useEffect(() => {
    const savedState = localStorage.getItem('seniority_app_state') as AppState;
    const savedCareer = localStorage.getItem('seniority_career');
    
    if (savedState) setState(savedState);
    if (savedCareer) setCareer(JSON.parse(savedCareer));
  }, []);

  // GUARDAR CADA VEZ QUE CAMBIA EL ESTADO
  useEffect(() => {
    localStorage.setItem('seniority_app_state', state);
    localStorage.setItem('seniority_career', JSON.stringify(career));
  }, [state, career]);

  const setAppState = (newState: AppState) => setState(newState);
  const updateCareer = (updates: Partial<UserCareer>) => setCareer(prev => ({ ...prev, ...updates }));
  
  const resetSession = () => {
    localStorage.removeItem('seniority_app_state');
    localStorage.removeItem('seniority_career');
    setState('onboarding');
    setCareer({ industry: '', role: '', seniority: '', hired: false, cvName: '' });
  };

  return (
    <SeniorityContext.Provider value={{ state, career, setAppState, updateCareer, resetSession }}>
      {children}
    </SeniorityContext.Provider>
  );
}

export function useSeniority() {
  const context = useContext(SeniorityContext);
  if (context === undefined) throw new Error('useSeniority must be used within a SeniorityProvider');
  return context;
}
