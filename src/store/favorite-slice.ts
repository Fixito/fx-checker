import type { StateCreator } from 'zustand';

import { pairEq, type Pair } from '@/types';

import type { ConversionLogSlice } from './conversion-log-slice.ts';

export interface FavoriteSlice {
  favorites: Pair[];
  isFavorite: (pair: Pair) => boolean;
  toggleFavorite: (pair: Pair) => void;
}

export const createFavoriteSlice: StateCreator<
  FavoriteSlice & ConversionLogSlice,
  [],
  [],
  FavoriteSlice
> = (set, get) => ({
  favorites: [],

  isFavorite: (pair) => get().favorites.some((favorite) => pairEq(favorite, pair)),

  toggleFavorite: (pair) => {
    const { favorites } = get();
    const exists = favorites.some((favorite) => pairEq(favorite, pair));
    set({
      favorites: exists
        ? favorites.filter((favorite) => !pairEq(favorite, pair))
        : [...favorites, pair],
    });
  },
});
