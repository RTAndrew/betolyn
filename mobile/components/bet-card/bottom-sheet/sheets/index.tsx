import React from 'react';
import { BottomSheetType } from '../types';
import { MainActionSheet } from './main-action-sheet';
import { EndMatchSheet } from './end-match-sheet';

export interface ISheet {
  visible?: boolean;
}

export interface SheetComponent {
  component: React.ComponentType<ISheet>;
}

export const SHEET_REGISTRY: Record<BottomSheetType, SheetComponent> = {
  'main-action': {
    component: MainActionSheet,
  },
  'end-match': {
    component: EndMatchSheet,
  },
};

export { MainActionSheet, EndMatchSheet };
