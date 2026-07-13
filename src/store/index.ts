import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createConversionLogSlice, type ConversionLogSlice } from './conversion-log-slice.ts';
import { createFavoriteSlice, type FavoriteSlice } from './favorite-slice.ts';

export const useFXStore = create<FavoriteSlice & ConversionLogSlice>()(
  persist(
    (...actions) => ({
      ...createFavoriteSlice(...actions),
      ...createConversionLogSlice(...actions),
    }),
    { name: 'fx-checker-store' },
  ),
);
