import React, { PropsWithChildren, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export interface FullScreenCenteredProps extends PropsWithChildren {
  /** Whether to include the tab bar height in the padding bottom
   * @default ```false (100)```
   */
  includeTabBar?: boolean | number;
}

/** Vertically and horizontally centers content inside a flex parent (e.g. full screen). */
export default function FullScreenCentered({
  children,
  includeTabBar = false,
}: FullScreenCenteredProps) {
  const paddingBottom = useMemo(() => {
    // Android handles the tab bar height differently,
    if (includeTabBar && Platform.OS === 'android') return 0;
    if (typeof includeTabBar === 'number') return includeTabBar;
    return includeTabBar ? 100 : 0;
  }, [includeTabBar]);

  return <View style={[styles.root, { paddingBottom }]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
