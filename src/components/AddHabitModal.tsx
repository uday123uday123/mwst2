import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

interface AddHabitModalProps {
  onClose: () => void;
}

const PRESET_HABITS = [
  { name: 'Meditate', icon: '🧘', color: '#8b5cf6' },
  { name: 'Read', icon: '📚', color: '#3b82f6' },
  { name: 'Exercise', icon: '🏃', color: '#10b981' },
  { name: 'Journal', icon: '📔', color: '#f59e0b' },
];

export function AddHabitModal({ onClose }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✨');
  const [color, setColor] = useState('#6366f1');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    const habitRef = doc(collection(db, 'habits'));
    await setDoc(habitRef, {
      userId: auth.currentUser.uid,
      name,
      icon,
      color,
      frequency: 'daily',
      isCustom: true,
      currentStreak: 0,
      lastCompletedDate: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    onClose();
  };

  const setPreset = (preset: typeof PRESET_HABITS[0]) => {
    setName(preset.name);
    setIcon(preset.icon);
    setColor(preset.color);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden relative shadow-2xl pb-safe">
        <div className="p-6 sm:p-8">
          <button onClick={onClose} className="absolute top-6 right-6 text-[#5a5a40] opacity-50 hover:opacity-100 p-2">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-light text-[#3a3a2e] mb-6">Create Ritual</h2>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {PRESET_HABITS.map(preset => (
              <button 
                key={preset.name}
                type="button"
                onClick={() => setPreset(preset)}
                className="flex-shrink-0 px-4 py-2 bg-[#f0ede6] hover:bg-[#e6e6da] rounded-full text-xs font-sans font-medium text-[#3a3a2e] transition-colors"
              >
                {preset.icon} {preset.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#5a5a40] opacity-70 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-[#f5f5f0] border border-[#e6e6da] rounded-[16px] px-4 py-3 font-sans text-sm text-[#3a3a2e] focus:ring-1 focus:ring-[#8a9a5b] focus:border-[#8a9a5b] outline-none transition-all"
                placeholder="E.g., Drink Water"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-[2]">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#5a5a40] opacity-70 mb-2">Icon</label>
                <input
                  type="text"
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  className="w-full bg-[#f5f5f0] border border-[#e6e6da] rounded-[16px] px-4 py-3 font-sans text-sm text-[#3a3a2e] focus:ring-1 focus:ring-[#8a9a5b] focus:border-[#8a9a5b] outline-none text-center text-xl transition-all"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#5a5a40] opacity-70 mb-2">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full h-12 bg-transparent rounded-lg cursor-pointer p-0 border-0"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8a9a5b] hover:bg-[#7a8a4b] text-white font-sans font-medium py-3 rounded-full mt-6 shadow-sm transition-colors text-sm"
            >
              Add Ritual
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
