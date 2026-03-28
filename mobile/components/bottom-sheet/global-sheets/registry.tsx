import { PropsWithChildren } from 'react';
import { SheetDefinition, SheetProvider, SheetRegister } from 'react-native-actions-sheet';

import AsyncProcessingGlobalSheet, { AsyncProcessingGlobalSheetProps } from './async-processing-gs';
import CreateSpaceOptionGC from './create-event-option-gs';
import UnauthenticatedGC from './unauthenticated-gc';

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    unauthenticated: SheetDefinition;
    createEventOptionSelection: SheetDefinition<{
      payload: {
        spaceId: string;
      };
    }>;
    asyncProcessing: SheetDefinition<{
      payload: AsyncProcessingGlobalSheetProps;
    }>;
  }
}

const GlobalSheetRegistry = ({ children }: PropsWithChildren) => {
  return (
    <SheetProvider>
      <SheetRegister
        sheets={{
          unauthenticated: UnauthenticatedGC,
          createEventOptionSelection: CreateSpaceOptionGC,
          asyncProcessing: AsyncProcessingGlobalSheet,
        }}
      />

      {children}
    </SheetProvider>
  );
};

export default GlobalSheetRegistry;
