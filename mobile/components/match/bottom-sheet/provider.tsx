import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';

import { IMatch } from '@/types';

import { MatchBottomSheetContext, useMatchBottomSheet } from './context';
import { SHEET_REGISTRY } from './registry';
import { BottomSheetStackItem, MatchBottomSheetContextType } from './types';
import { useCanMutateSpace } from './use-can-mutate-match';

interface MatchBottomSheetProviderProps {
  match: Omit<IMatch, 'mainCriterion'>;
}

export const MatchSheets = () => {
  const { stack, currentSheet } = useMatchBottomSheet();

  // Only render the current sheet to prevent multiple ActionSheet instances
  // Use stack length as key to ensure proper unmounting when switching
  const renderSheet = useMemo(() => {
    if (!currentSheet) return null;

    const sheetConfig = SHEET_REGISTRY[currentSheet.type];
    if (!sheetConfig) return null;

    const SheetComponent = sheetConfig.component;

    return (
      <SheetComponent
        key={`${currentSheet.type}-${stack.length}`}
        visible={true}
        data={currentSheet.data}
      />
    );
  }, [currentSheet, stack.length]);

  return <>{renderSheet}</>;
};

export const MatchBottomSheetProvider = ({
  children,
  match,
}: PropsWithChildren<MatchBottomSheetProviderProps>) => {
  /**A LIFO stack of bottom sheets */
  const [stack, setStack] = useState<BottomSheetStackItem[]>([]);

  const { canMutateMatchActions, isMatchActionPermissionPending } = useCanMutateSpace(
    match.spaceId
  );

  const pushSheet = useCallback(
    (item: BottomSheetStackItem) => {
      if (isMatchActionPermissionPending || !canMutateMatchActions) {
        return;
      }
      setStack((prev) => [...prev, item]);
    },
    [canMutateMatchActions, isMatchActionPermissionPending]
  );

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return [];
      return prev.slice(0, -1);
    });
  }, []);

  const closeAll = useCallback(() => {
    setStack([]);
  }, []);

  const closeMatchScreen = useCallback(() => {
    setStack([]);
    SheetManager.hide('match');
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
      closeMatchScreen,
      currentSheet,
      canMutateMatchActions,
      isMatchActionPermissionPending,
    }),

    [
      match,
      stack,
      pushSheet,
      goBack,
      closeAll,
      closeMatchScreen,
      currentSheet,
      canMutateMatchActions,
      isMatchActionPermissionPending,
    ]
  );

  return (
    <MatchBottomSheetContext.Provider value={contextValue}>
      <SheetProvider context={`match-action-sheets-for-${match.id}`}>
        <MatchSheets />
        {children}
      </SheetProvider>
    </MatchBottomSheetContext.Provider>
  );
};
