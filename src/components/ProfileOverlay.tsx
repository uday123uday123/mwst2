import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { calculateLevelFromXP, getXPForNextLevel } from '../services/habitService';
import { Shield, Sparkles } from 'lucide-react';

export function ProfileOverlay() {
  const user = useAppStore(state => state.user);
  if (!user) return null;

  const calculatedLevel = calculateLevelFromXP(user.totalXP);
  const currentLevelXP = user.currentLevel > 1 ? getXPForNextLevel(user.currentLevel - 1) : 0;
  const nextLevelXP = getXPForNextLevel(calculatedLevel);
  const xpInCurrentLevel = user.totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));

  return (
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-light text-[#5a5a40] tracking-tight mb-1">Project 30</h1>
        <p className="text-sm italic opacity-70">Mental Wellness Tracker</p>
      </div>
      <div className="flex gap-4 items-center">
        <div className="bg-white rounded-full px-4 py-1.5 shadow-sm border border-[#e6e6da] flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest font-sans font-semibold opacity-60">Level {calculatedLevel}</span>
          <span className="text-xs font-sans font-bold">{user.totalXP} XP</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#d9c5b2] flex items-center justify-center text-white shadow-inner mb-1">
            <span className="text-lg">❄️</span>
          </div>
          <span className="text-[10px] uppercase font-sans font-bold opacity-50 leading-none">{user.streakFreezeBalance} Left</span>
        </div>
      </div>
    </div>
  );
}
