import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { IMatch } from '@/types';
import { BottomSheetType, MatchBottomSheetContextType } from './types';
import { MatchBottomSheetContext, useMatchBottomSheet } from './context';
import { SHEET_REGISTRY } from './sheets';

interface MatchBottomSheetProviderProps {
  match: IMatch;
}

export const MatchSheets = () => {
  const { stack, currentSheet } = useMatchBottomSheet();

  // Only render the current sheet to prevent multiple ActionSheet instances
  // Use stack length as key to ensure proper unmounting when switching
  const renderSheet = useMemo(() => {
    if (!currentSheet) return null;

    const sheetConfig = SHEET_REGISTRY[currentSheet];
    if (!sheetConfig) return null;

    const SheetComponent = sheetConfig.component;

    return <SheetComponent key={`${currentSheet}-${stack.length}`} visible={true} />;
  }, [currentSheet, stack.length]);

  return <>{renderSheet}</>;
};

export const MatchBottomSheetProvider = ({ children, match }: PropsWithChildren<MatchBottomSheetProviderProps>) => {
  /**A LIFO stack of bottom sheets */
  const [stack, setStack] = useState<BottomSheetType[]>([]);

  const pushSheet = useCallback((sheet: BottomSheetType) => {
    setStack((prev) => [...prev, sheet]);
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return [];
      return prev.slice(0, -1);
    });
  }, []);

  const closeAll = useCallback(() => {
    setStack([]);
  }, []);

  const currentSheet = useMemo(() => {
    return stack.length > 0 ? stack[stack.length - 1] : null;
  }, [stack]);

  const contextValue = useMemo<MatchBottomSheetContextType>(
    () => ({
      match,
      stack,
      pushSheet,
      goBack,
      closeAll,
      currentSheet,
    }),

    [match, stack, pushSheet, goBack, closeAll, currentSheet]
  );

  return (
    <MatchBottomSheetContext.Provider value={contextValue}>

      <MatchSheets />
      {children}
    </MatchBottomSheetContext.Provider>
  );
};
