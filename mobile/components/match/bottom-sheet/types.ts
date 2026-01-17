import type { IMatch } from '@/types';

export type BottomSheetType = 'main-action' | 'end-match' | 'update-score';

export interface MatchBottomSheetContextType {
  match: IMatch;
  stack: BottomSheetType[];
  pushSheet: (sheet: BottomSheetType) => void;
  goBack: () => void;
  closeAll: () => void;
  currentSheet: BottomSheetType | null;
}
