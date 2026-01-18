import type { IMatch } from '@/types';

export type BottomSheetType =
  'match-action' | 'match-end-match' | 'match-update-score' |
  'criterion-action' | 'criterion-reprice-update-odds' | 'criterion-lock-and-result';

export interface BottomSheetStackItem {
  type: BottomSheetType;
  data?: unknown;
}

export interface MatchBottomSheetContextType {
  match: IMatch;
  stack: BottomSheetStackItem[];
  pushSheet: (item: BottomSheetStackItem) => void;
  goBack: () => void;
  closeAll: () => void;
  currentSheet: BottomSheetStackItem | null;
}
