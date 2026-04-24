'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SeniorityProvider, useSeniority } from '../core/context/SeniorityContext';
import OnboardingView from '../features/onboarding/OnboardingView';
import InterviewView from '../features/interview/InterviewView';
import HiredView from '../features/interview/HiredView';
import WorkspaceView from '../features/workspace/WorkspaceView';

function AppOrchestrator() {
  const { state } = useSeniority();

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {state === 'onboarding' && (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              <OnboardingView />
            </motion.div>
          )}
          {state === 'interview' && (
            <motion.div key="interview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <InterviewView />
            </motion.div>
          )}
          {state === 'hired' && (
            <motion.div key="hired" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <HiredView />
            </motion.div>
          )}
          {state === 'workspace' && (
            <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <WorkspaceView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <SeniorityProvider>
      <AppOrchestrator />
    </SeniorityProvider>
  );
}
