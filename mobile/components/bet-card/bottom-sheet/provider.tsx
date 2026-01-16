import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { IMatch } from '@/types';
import { BottomSheetType, BetCardBottomSheetContextType } from './types';
import { BetCardBottomSheetContext, useBetCardBottomSheet } from './context';
import { SHEET_REGISTRY } from './sheets';

interface BetCardBottomSheetProviderProps {
  match: IMatch;
}

export const BetCardSheets = () => {
  const { stack, currentSheet } = useBetCardBottomSheet();

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

/**
 * A LIFO stack of bottom sheets
 */
export const BetCardBottomSheetProvider = ({ children, match }: PropsWithChildren<BetCardBottomSheetProviderProps>) => {
  const [stack, setStack] = useState<BottomSheetType[]>([]);

  const pushSheet = useCallback((sheet: BottomSheetType) => {
    setStack((prev) => [...prev, sheet]);
  }, []);

  const popSheet = useCallback(() => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
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

  const contextValue = useMemo<BetCardBottomSheetContextType>(
    () => ({
      match,
      stack,
      pushSheet,
      popSheet,
      goBack,
      closeAll,
      currentSheet,
    }),

    [match, stack, pushSheet, popSheet, goBack, closeAll, currentSheet]
  );

  return (
    <BetCardBottomSheetContext.Provider value={contextValue}>

      <BetCardSheets />
      {children}
    </BetCardBottomSheetContext.Provider>
  );
};
