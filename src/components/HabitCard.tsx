import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '../types';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: (habit: Habit) => void;
}

export function HabitCard({ habit, isCompleted, onComplete }: HabitCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-[32px] p-5 select-none cursor-pointer border transition-all",
        isCompleted 
          ? "bg-[#f5f5f0] border-[#e6e6da] shadow-none" 
          : "bg-white border-[#e6e6da] hover:border-[#d9c5b2] shadow-sm"
      )}
      onClick={() => onComplete(habit)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-colors bg-[#f0ede6]"
            style={{ 
              opacity: isCompleted ? 0.5 : 1
            }}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className={cn(
              "font-sans font-semibold text-base transition-colors",
              isCompleted ? "text-[#3a3a2e] opacity-40 line-through" : "text-[#3a3a2e]"
            )}>
              {habit.name}
            </h3>
            <p className={cn(
               "text-xs italic transition-colors flex items-center gap-1",
               isCompleted ? "opacity-40" : "opacity-60 text-[#5a5a40]"
            )}>
              {habit.currentStreak} day streak
            </p>
          </div>
        </div>
        
        <div className={cn(
          "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
          isCompleted 
            ? "bg-[#8a9a5b] border-[#8a9a5b] text-white" 
            : "border-[#d1cfc0] bg-transparent text-[#d1cfc0]"
        )}>
          {isCompleted && <Check className="w-5 h-5" />}
        </div>
      </div>
    </motion.div>
  );
}
