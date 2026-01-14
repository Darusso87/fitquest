'use client';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const router = useRouter();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      storage.clear();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-neon-cyan font-body flex items-center gap-2">← BACK</button>
        
        <h1 className="font-display text-4xl text-neon-yellow mb-8">SETTINGS</h1>

        <div className="space-y-4">
          <div className="neon-card rounded-lg p-6">
            <h2 className="font-display text-xl text-white mb-2">About FITQUEST</h2>
            <p className="text-gray-400 text-sm font-body mb-4">
              Your personal fitness companion with arcade-style progression. Complete daily missions, earn XP, level up, and track your transformation.
            </p>
            <p className="text-gray-500 text-xs font-body">Version 5.0 • Arcade Edition</p>
          </div>

          <div className="neon-card rounded-lg p-6">
            <h2 className="font-display text-xl text-white mb-2">How It Works</h2>
            <ul className="space-y-2 text-gray-400 text-sm font-body">
              <li>• Complete daily missions for XP</li>
              <li>• Level up as you progress</li>
              <li>• Track workouts, nutrition, sleep, and more</li>
              <li>• Weigh-in every 2 weeks</li>
              <li>• All data stored locally on your device</li>
            </ul>
          </div>

          <div className="neon-card rounded-lg p-6">
            <h2 className="font-display text-xl text-white mb-2">Features</h2>
            <ul className="space-y-2 text-gray-400 text-sm font-body">
              <li>✓ AI-like workout generation</li>
              <li>✓ Personalized nutrition plans</li>
              <li>✓ Progressive overload</li>
              <li>✓ Injury-adaptive exercises</li>
              <li>✓ No login required</li>
              <li>✓ Works offline</li>
            </ul>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-4 px-6 bg-arcade-card border-2 border-neon-pink text-neon-pink rounded-lg font-body hover:bg-neon-pink hover:text-white transition-all"
          >
            RESET ALL DATA
          </button>

          <p className="text-center text-gray-500 text-xs font-body mt-6">
            Made with 💪 for fitness enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
}
