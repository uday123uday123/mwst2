export type User = {
  uid: string;
  email: string;
  displayName: string;
  totalXP: number;
  currentLevel: number;
  streakFreezeBalance: number;
  timezone: string;
  createdAt?: string;
};

export type Habit = {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  frequency: string;
  isCustom: boolean;
  currentStreak: number;
  lastCompletedDate?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type HabitLog = {
  id: string;
  userId: string;
  habitId: string;
  localDate: string;
  completedAt: any;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const AVAILABLE_BADGES: Record<string, Badge> = {
  '7_day': { id: '7_day', name: '7-Day Streak', description: 'Maintained a habit for 7 days', icon: '🔥' },
  '30_day': { id: '30_day', name: '30-Day Streak', description: 'Maintained a habit for 30 days', icon: '💎' },
  'level_5': { id: 'level_5', name: 'Level 5 Achieved', description: 'Reached Level 5', icon: '🚀' },
};
