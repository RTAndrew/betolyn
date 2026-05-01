import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

/** Vertically and horizontally centers content inside a flex parent (e.g. full screen). */
export default function FullScreenCentered({ children }: PropsWithChildren) {
  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
