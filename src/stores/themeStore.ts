/**
 * Theme Store - Zustand
 */

import {create} from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  fontScale: number;
  toggleDarkMode: () => void;
  setFontScale: (scale: number) => void;
}

export const useThemeStore = create<ThemeState>(set => ({
  isDarkMode: false,
  fontScale: 1.0,
  toggleDarkMode: () => set(state => ({isDarkMode: !state.isDarkMode})),
  setFontScale: (scale: number) => set({fontScale: scale}),
}));
