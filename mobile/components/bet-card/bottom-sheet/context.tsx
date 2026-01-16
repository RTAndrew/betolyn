import { createContext, useContext } from 'react';
import { BetCardBottomSheetContextType } from './types';

export const BetCardBottomSheetContext =
  createContext<BetCardBottomSheetContextType | null>(null);

export const useBetCardBottomSheet = () => {
  const context = useContext(BetCardBottomSheetContext);
  if (!context) {
    throw new Error('useBetCardBottomSheet must be used within a BetCardBottomSheetProvider');
  }

  return context;
};
