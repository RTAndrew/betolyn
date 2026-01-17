export type BottomSheetType = 'main-action' | 'end-match' | 'update-score';

export interface BetCardBottomSheetContextType {
  match: import('@/types').IMatch;
  stack: BottomSheetType[];
  pushSheet: (sheet: BottomSheetType) => void;
  popSheet: () => void;
  goBack: () => void;
  closeAll: () => void;
  currentSheet: BottomSheetType | null;
}
