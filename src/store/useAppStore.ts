import { create } from 'zustand';
import { User, Habit, HabitLog } from '../types';

interface AppState {
  user: User | null;
  habits: Habit[];
  logs: HabitLog[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setHabits: (habits: Habit[]) => void;
  setLogs: (logs: HabitLog[]) => void;
  addXP: (amount: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  habits: [],
  logs: [],
  isLoading: true,
  setUser: (user) => set({ user }),
  setHabits: (habits) => set({ habits }),
  setLogs: (logs) => set({ logs }),
  addXP: (amount) => set((state) => {
    if (!state.user) return state;
    const newXP = state.user.totalXP + amount;
    return {
      user: {
        ...state.user,
        totalXP: newXP
        // Current level should be re-calculated during Firebase sync mostly, 
        // but we handle optimistic UI here if needed
      }
    }
  })
}));
