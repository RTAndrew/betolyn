import { CriterionBulkRepriceOddsSheet } from './criterion-sheets/bulk-reprice-odds-sheet';
import { CreateOddSheet } from './criterion-sheets/create-odd-sheet';
import { CriterionActionSheet } from './criterion-sheets/criterion-action-sheet';
import { CriterionSuspendSheet } from './criterion-sheets/criterion-suspend-sheet';
import { PublishCriterionSheet } from './criterion-sheets/publish';
import { CriterionSelectWinningOutcomeSheet } from './criterion-sheets/select-winning-odds-sheet';
import { EndMatchSheet } from './match-sheets/end-match-sheet';
import { MainActionSheet } from './match-sheets/main-action-sheet';
import { SettleMatchSheet } from './match-sheets/settle-match-sheet';
import { SuspendAllMarketsSheet } from './match-sheets/suspend-all-markets-sheet';
import UpdateMatchScoreSheet from './match-sheets/update-match-score';
import { OddActionSheet } from './odd-sheets/odd-action-sheet';
import { OddRepriceSheet } from './odd-sheets/odd-reprice-sheet';
import { PublishOddSheet } from './odd-sheets/publish';
import { SuspendOddSheet } from './odd-sheets/suspend-odd-sheet';
import CancelAndRefundSheet from './shared-sheets/cancel-and-refund';
import { BottomSheetType } from './types';

export interface ISheet {
  visible?: boolean;
  data?: unknown;
}

export interface SheetComponent {
  component: React.ComponentType<ISheet>;
}

export const SHEET_REGISTRY: Record<BottomSheetType, SheetComponent> = {
  'cancel-and-refund': {
    component: CancelAndRefundSheet,
  },
  'match-action': {
    component: MainActionSheet,
  },
  'match-end-match': {
    component: EndMatchSheet,
  },
  'match-suspend-all-markets': {
    component: SuspendAllMarketsSheet,
  },
  'match-settle-match': {
    component: SettleMatchSheet,
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
  'criterion-select-winner': {
    component: CriterionSelectWinningOutcomeSheet,
  },
  'criterion-suspend': {
    component: CriterionSuspendSheet,
  },
  'criterion-publish': {
    component: PublishCriterionSheet,
  },
  'criterion-create-odd': {
    component: CreateOddSheet,
  },
  'odd-action': {
    component: OddActionSheet,
  },
  'odd-reprice': {
    component: OddRepriceSheet,
  },
  'odd-suspend': {
    component: SuspendOddSheet,
  },
  'odd-publish': {
    component: PublishOddSheet,
  },
};
