'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  const [hasSave, setHasSave] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const save = storage.load();
    setHasSave(!!save);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan text-2xl font-display animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border-4 border-neon-cyan opacity-20 rotate-45 animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-40 h-40 border-4 border-neon-pink opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-neon-yellow opacity-20 rotate-12 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="font-display text-7xl mb-4 neon-text text-neon-cyan tracking-wider">
            FITQUEST
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
          <p className="mt-6 text-gray-400 text-lg font-body">
            Level up your fitness journey
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          {hasSave && (
            <button
              onClick={() => router.push('/dashboard')}
              className="arcade-btn w-full py-4 px-8 bg-gradient-to-r from-neon-cyan to-neon-pink text-white font-display text-xl rounded-lg shadow-neon-cyan hover:scale-105 transition-transform"
            >
              CONTINUE
            </button>
          )}
          
          <button
            onClick={() => router.push('/onboarding')}
            className="arcade-btn w-full py-4 px-8 bg-arcade-card border-2 border-neon-yellow text-neon-yellow font-display text-xl rounded-lg hover:bg-neon-yellow hover:text-arcade-bg transition-all"
          >
            {hasSave ? 'NEW GAME' : 'START QUEST'}
          </button>
        </div>

        {/* Version */}
        <div className="mt-12 text-gray-600 text-sm font-body">
          v5.0 • ARCADE EDITION
        </div>
      </div>
    </div>
  );
}
