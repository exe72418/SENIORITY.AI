'use client';

import React from 'react';
import { useSeniority } from '../../core/context/SeniorityContext';
import HiredPanel from './HiredPanel';

export default function HiredView() {
  const { career } = useSeniority();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <HiredPanel industry={career.industry} />
    </div>
  );
}
