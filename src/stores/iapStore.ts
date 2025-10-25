/**
 * IAP Store - Zustand
 */

import {create} from 'zustand';
import {Purchase} from '@types/index';

interface IAPState {
  purchases: Purchase[];
  isProActive: boolean;
  isLoading: boolean;
  setPurchases: (purchases: Purchase[]) => void;
  addPurchase: (purchase: Purchase) => void;
  checkProStatus: () => void;
  setLoading: (loading: boolean) => void;
}

export const useIAPStore = create<IAPState>((set, get) => ({
  purchases: [],
  isProActive: false,
  isLoading: false,

  setPurchases: purchases => {
    set({purchases});
    get().checkProStatus();
  },

  addPurchase: purchase => {
    set(state => ({
      purchases: [...state.purchases, purchase],
    }));
    get().checkProStatus();
  },

  checkProStatus: () => {
    const state = get();
    const hasActivePro = state.purchases.some(
      p => p.productId === 'pro_unlock' && p.isActive,
    );
    set({isProActive: hasActivePro});
  },

  setLoading: loading => set({isLoading: loading}),
}));
