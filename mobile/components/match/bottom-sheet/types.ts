import type { ICriteria, IMatch, IOdd } from '@/types';

export type BottomSheetType =
  'match-action' | 'match-end-match' | 'match-update-score' |
  'criterion-action' | 'criterion-reprice-update-odds' | 'criterion-lock-and-result' | 'criterion-suspend' |
  'odd-action' | 'odd-reprice' | 'odd-suspend';

  export interface IOddSheetData extends IOdd {
    criterion?: Omit<ICriteria, 'match'>;
  }

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
