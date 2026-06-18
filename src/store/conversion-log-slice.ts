import type { StateCreator } from 'zustand';

import type { ConversionEntry } from '@/types/index.ts';

import type { FavoriteSlice } from './favorite-slice.ts';

export interface ConversionLogSlice {
  conversionLog: ConversionEntry[];
  clearLog: () => void;
  deleteLog: (id: string) => void;
  logConversion: (entry: Omit<ConversionEntry, 'id' | 'timestamp'>) => void;
}

export const createConversionLogSlice: StateCreator<
  FavoriteSlice & ConversionLogSlice,
  [],
  [],
  ConversionLogSlice
> = (set, get) => ({
  clearLog: () => set({ conversionLog: [] }),

  conversionLog: [],

  deleteLog: (id) => {
    const { conversionLog } = get();
    set({ conversionLog: conversionLog.filter((entry) => entry.id !== id) });
  },

  logConversion: (entry) => {
    const { conversionLog } = get();
    const newEntry: ConversionEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    set({ conversionLog: [newEntry, ...conversionLog].slice(0, 50) });
  },
});
