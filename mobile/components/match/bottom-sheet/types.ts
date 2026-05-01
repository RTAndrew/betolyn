import type { ICriterion, IMatch, IOdd } from '@/types';

export type BottomSheetType =
  | 'match-action'
  | 'match-end-match'
  | 'match-suspend-all-markets'
  | 'match-settle-match'
  | 'match-update-score'
  | 'criterion-action'
  | 'criterion-reprice-update-odds'
  | 'criterion-select-winner'
  | 'criterion-suspend'
  | 'criterion-create-odd'
  | 'criterion-publish'
  | 'odd-action'
  | 'odd-reprice'
  | 'odd-suspend'
  | 'odd-publish'
  | 'cancel-and-refund';

export interface IOddSheetData extends IOdd {
  criterion?: Omit<ICriterion, 'match'>;
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
  closeMatchScreen: () => void;
  currentSheet: BottomSheetStackItem | null;
}
