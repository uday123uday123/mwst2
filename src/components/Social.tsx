import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, UserPlus, Flame, Heart } from 'lucide-react';

export function Social() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-xl font-medium text-[#3a3a2e] mb-1">Buddies</h2>
        <span className="text-[10px] font-sans uppercase tracking-widest opacity-50">Accountability</span>
      </header>
      
      <div className="bg-white rounded-[32px] p-2 flex items-center gap-2 border border-[#e6e6da] shadow-sm focus-within:border-[#8a9a5b] transition-colors">
        <Search className="w-5 h-5 text-[#5a5a40] opacity-50 ml-3" />
        <input 
          type="text"
          placeholder="Find friends by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-sm text-[#3a3a2e] w-full p-2"
        />
        <button className="bg-[#8a9a5b] hover:bg-[#7a8a4b] text-white p-2.5 rounded-2xl">
          <UserPlus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-sans font-bold uppercase tracking-widest opacity-50 mb-4 mt-8">Your Network</h3>
        
        {/* Placeholder Buddy */}
        <div className="bg-white p-5 rounded-[32px] border border-[#e6e6da] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#d9c5b2] rounded-full flex items-center justify-center font-bold font-sans text-lg text-white">
              AL
            </div>
            <div>
              <h3 className="font-sans font-semibold text-base text-[#3a3a2e]">Alex L.</h3>
              <p className="text-[10px] uppercase tracking-widest font-sans opacity-60 flex items-center gap-1">
                 12 Day Streak <Flame className="w-3 h-3 text-[#d9c5b2]" />
              </p>
            </div>
          </div>
          <button className="text-[10px] font-sans font-bold px-3 py-1.5 border border-[#5a5a40] rounded-full text-[#5a5a40] hover:bg-[#5a5a40] hover:text-white transition-colors">
            NUDGE
          </button>
        </div>
      </div>
    </div>
  );
}
