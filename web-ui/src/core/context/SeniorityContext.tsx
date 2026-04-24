'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos rigurosos para escalabilidad
export type Industry = 'banking' | 'erp' | 'ecommerce' | 'cyber' | 'agrotech' | '';
export type Role = 'Backend Developer' | 'Frontend Developer' | 'Fullstack Developer' | 'Mobile Developer' | 'QA Automation' | '';
export type Seniority = 'Trainee' | 'Junior' | 'Semi-Senior' | 'Senior' | '';
export type AppState = 'onboarding' | 'interview' | 'hired' | 'workspace';

interface UserCareer {
  industry: Industry;
  role: Role;
  seniority: Seniority;
  hired: boolean;
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
  });

  const setAppState = (newState: AppState) => setState(newState);
  
  const updateCareer = (updates: Partial<UserCareer>) => {
    setCareer(prev => ({ ...prev, ...updates }));
  };

  const resetSession = () => {
    setState('onboarding');
    setCareer({ industry: '', role: '', seniority: '', hired: false });
  };

  return (
    <SeniorityContext.Provider value={{ state, career, setAppState, updateCareer, resetSession }}>
      {children}
    </SeniorityContext.Provider>
  );
}

export function useSeniority() {
  const context = useContext(SeniorityContext);
  if (context === undefined) {
    throw new Error('useSeniority must be used within a SeniorityProvider');
  }
  return context;
}
