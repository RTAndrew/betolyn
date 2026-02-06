import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import SafeHorizontalView from '../safe-horizontal-view';
import { Down, MoreVertical } from '../icons';
import { useMatchBottomSheet } from '@/components/match/bottom-sheet';

interface ScreenTopBarProps {
  style?: ViewStyle;
}

const ScreenTopBar = ({ style }: ScreenTopBarProps) => {
  const { pushSheet } = useMatchBottomSheet();

  return (
    <SafeHorizontalView style={{ ...style, ...styles.header }}>
      <TouchableWithoutFeedback onPress={() => router.back()}>
        <Down />
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        delayLongPress={200}
        onLongPress={() => pushSheet({ type: 'match-action' })}
        onPress={() => pushSheet({ type: 'match-action' })}
      >
        <MoreVertical />
      </TouchableWithoutFeedback>
    </SafeHorizontalView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'fixed',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});

export default ScreenTopBar;
