import { format, differenceInDays } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Habit, User } from '../types';

/**
 * Gamification Math
 * XP Requirements: XP = 100 * (level)^1.5
 */
export function calculateLevelFromXP(totalXP: number): number {
  if (totalXP < 100) return 1;
  // level = (XP / 100) ^ (1 / 1.5)
  // 1 / 1.5 = 2 / 3
  const level = Math.floor(Math.pow(totalXP / 100, 2 / 3));
  return level <= 0 ? 1 : level;
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.floor(100 * Math.pow(currentLevel + 1, 1.5));
}

/**
 * The "Midnight" Problem solved
 * Returns current date format in User's timezone (YYYY-MM-DD)
 */
export function getLocalDateString(timezone: string): string {
  try {
    return formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
  } catch (error) {
    // Fallback if timezone is invalid
    return format(new Date(), 'yyyy-MM-dd');
  }
}

/**
 * Streak Engine Math
 * Checks if a streak was broken between the last completed date and today in the user's timezone.
 */
export function evaluateStreak(habit: Habit, userDateString: string, freezeBalance: number): { 
  streakBroken: boolean, 
  daysMissed: number, 
  freezesUsed: number 
} {
  if (!habit.lastCompletedDate) {
    return { streakBroken: false, daysMissed: 0, freezesUsed: 0 };
  }

  // Parse strings as Date objects (local implicit midnight)
  const lastDate = new Date(habit.lastCompletedDate);
  const todayDate = new Date(userDateString);
  
  const diffDays = differenceInDays(todayDate, lastDate);

  if (diffDays <= 1) {
    // 0 or 1 days difference = Streak is safe
    return { streakBroken: false, daysMissed: 0, freezesUsed: 0 };
  }

  // Missed days = diffDays - 1
  const daysMissed = diffDays - 1;

  if (freezeBalance >= daysMissed) {
    return { streakBroken: false, daysMissed, freezesUsed: daysMissed };
  }

  return { streakBroken: true, daysMissed, freezesUsed: 0 };
}
