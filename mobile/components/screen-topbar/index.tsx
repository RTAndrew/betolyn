import { Link, router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import SafeHorizontalView from '../safe-horizontal-view';
import { Down, MoreVertical } from '../icons';

interface ScreenTopBarProps {
  style?: ViewStyle;
}

const ScreenTopBar = ({ style }: ScreenTopBarProps) => {
  return (
    <SafeHorizontalView style={{ ...style, ...styles.header }}>
      <TouchableWithoutFeedback onPress={() => router.back()}>
        <Down />
      </TouchableWithoutFeedback>

      <MoreVertical />
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
