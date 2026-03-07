import { PropsWithChildren } from 'react';
import { SheetDefinition, SheetRegister } from 'react-native-actions-sheet';
import { SheetProvider } from 'react-native-actions-sheet';

import UnauthenticatedGC from './unauthenticated-gc';

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    unauthenticated: SheetDefinition;
  }
}

const GlobalSheetRegistry = ({ children }: PropsWithChildren) => {
  return (
    <SheetProvider>
      <SheetRegister sheets={{ unauthenticated: UnauthenticatedGC }} />

      {children}
    </SheetProvider>
  );
};

export default GlobalSheetRegistry;
