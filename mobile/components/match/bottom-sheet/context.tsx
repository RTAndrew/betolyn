import { createContext, useContext } from 'react';
import { MatchBottomSheetContextType } from './types';

export const MatchBottomSheetContext =
  createContext<MatchBottomSheetContextType | null>(null);

export const useMatchBottomSheet = () => {
  const context = useContext(MatchBottomSheetContext);
  if (!context) {
    throw new Error('useMatchBottomSheet must be used within a MatchBottomSheetProvider');
  }

  return context;
};
