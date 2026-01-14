import { GameSave } from './types';

const STORAGE_KEY = 'fitquest_save_v5';

export const storage = {
  load: (): GameSave | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load save:', error);
      return null;
    }
  },

  save: (data: GameSave): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save:', error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

export function isToday(dateString: string): boolean {
  const today = new Date();
  const check = new Date(dateString);
  return (
    today.getFullYear() === check.getFullYear() &&
    today.getMonth() === check.getMonth() &&
    today.getDate() === check.getDate()
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  return `${days[date.getDay()]} • ${date.getDate()} ${months[date.getMonth()]}`;
}

export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
