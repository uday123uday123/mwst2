import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AddHabitModal } from './AddHabitModal';
import { HabitCard } from './HabitCard';
import { Habit } from '../types';
import { getLocalDateString } from '../services/habitService';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, collection, writeBatch, Timestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const habits = useAppStore(state => state.habits);
  const logs = useAppStore(state => state.logs);
  const user = useAppStore(state => state.user);

  if (!user) return null;

  const todayStr = getLocalDateString(user.timezone);
  const completedHabitIds = new Set(
    logs.filter(log => log.localDate === todayStr).map(log => log.habitId)
  );

  const handleCompleteHabit = async (habit: Habit) => {
    if (completedHabitIds.has(habit.id)) {
      // In a real app we might allow undo, but let's keep gamification strictly additive for now
      return;
    }

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [habit.color, '#ffffff', '#eab308']
    });

    try {
      const batch = writeBatch(db);
      
      // 1. Create Log
      const logRef = doc(collection(db, 'habitLogs'));
      batch.set(logRef, {
        userId: user.uid,
        habitId: habit.id,
        localDate: todayStr,
        completedAt: Timestamp.now()
      });

      // 2. Update Habit
      const newStreak = habit.currentStreak + 1;
      const habitRef = doc(db, 'habits', habit.id);
      batch.update(habitRef, {
        currentStreak: newStreak,
        lastCompletedDate: todayStr,
        updatedAt: Timestamp.now()
      });

      // 3. Add XP to User (optimistic + batch)
      const xpGained = 15; // 15 XP per habit completed
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        totalXP: user.totalXP + xpGained
      });

      await batch.commit();

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `habits/${habit.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-[#3a3a2e]">Today’s Rituals</h2>
          <span className="text-xs font-sans px-3 py-1 bg-[#5a5a40] text-white rounded-full mt-2 inline-block">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#8a9a5b] hover:bg-[#7a8a4b] text-white p-3 rounded-full shadow-sm transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {habits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-[#d9c5b2] shadow-sm">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-lg font-sans font-semibold text-[#5a5a40] mb-2">No habits yet</h3>
          <p className="text-[#3a3a2e] opacity-70 max-w-sm mx-auto font-sans text-sm">Start a new streak by adding your first habit. Relax your mind.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompleted={completedHabitIds.has(habit.id)}
              onComplete={handleCompleteHabit}
            />
          ))}
        </div>
      )}

      {showAddModal && <AddHabitModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
