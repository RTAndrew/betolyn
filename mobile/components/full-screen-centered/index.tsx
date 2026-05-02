import React, { PropsWithChildren, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface FullScreenCenteredProps extends PropsWithChildren {
  /** Whether to include the tab bar height in the padding bottom */
  includeTabBar?: boolean;
}

/** Vertically and horizontally centers content inside a flex parent (e.g. full screen). */
export default function FullScreenCentered({
  children,
  includeTabBar = false,
}: FullScreenCenteredProps) {
  const shouldIncludeTabBar = useMemo(() => {
    // Android handles the tab bar height differently,
    if (includeTabBar && Platform.OS === 'android') return false;
    return includeTabBar;
  }, [includeTabBar]);

  return (
    <View style={[styles.root, { paddingBottom: shouldIncludeTabBar ? 100 : 0 }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
