import React from 'react';
import { Home, BarChart2, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  currentTab: 'dashboard' | 'analytics' | 'social';
  onTabChange: (tab: 'dashboard' | 'analytics' | 'social') => void;
}

export function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Today' },
    { id: 'analytics', icon: BarChart2, label: 'Stats' },
    { id: 'social', icon: Users, label: 'Buddies' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-[#e6e6da] pb-safe pt-2 px-6 z-40 font-sans">
      <div className="max-w-md mx-auto flex justify-between items-center pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors duration-200",
                isActive ? "text-[#5a5a40]" : "text-[#5a5a40] opacity-50 hover:opacity-100"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-2xl transition-all duration-300",
                isActive ? "bg-[#d9c5b2]/30" : "bg-transparent"
              )}>
                <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "")} />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
