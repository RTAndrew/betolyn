import { CriterionBulkRepriceOddsSheet } from './criterion-sheets/bulk-reprice-odds-sheet';
import { CriterionActionSheet } from './criterion-sheets/criterion-action-sheet';
import { CriterionLockAndResultSheet } from './criterion-sheets/lock-and-result-sheet';
import { EndMatchSheet } from './match-sheets/end-match-sheet';
import { MainActionSheet } from './match-sheets/main-action-sheet';
import UpdateMatchScoreSheet from './match-sheets/update-match-score';
import { OddActionSheet } from './odd-sheets/odd-action-sheet';
import { OddRepriceSheet } from './odd-sheets/odd-reprice-sheet';
import { BottomSheetType } from './types';

export { MatchBottomSheetProvider } from './provider';
export { useMatchBottomSheet } from './context';
export type { BottomSheetType, BottomSheetStackItem } from './types';

export interface ISheet {
  visible?: boolean;
  data?: unknown;
}

export interface SheetComponent {
  component: React.ComponentType<ISheet>;
}

export const SHEET_REGISTRY: Record<BottomSheetType, SheetComponent> = {
  'match-action': {
    component: MainActionSheet,
  },
  'match-end-match': {
    component: EndMatchSheet,
  },
  'match-update-score': {
    component: UpdateMatchScoreSheet,
  },
  'criterion-action': {
    component: CriterionActionSheet,
  },
  'criterion-reprice-update-odds': {
    component: CriterionBulkRepriceOddsSheet,
  },
  'criterion-lock-and-result': {
    component: CriterionLockAndResultSheet,
  },
  'odd-action': {
    component: OddActionSheet,
  },
  'odd-reprice': {
    component: OddRepriceSheet,
  },
};

export { MainActionSheet, EndMatchSheet };
