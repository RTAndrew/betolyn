import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ThemedText } from '../ThemedText';
import BottomSheetSafeHorizontalView from './bottom-sheet-safe-horizontal-view';

export interface BottomSheetActionOptionProps
  extends Omit<TouchableOpacityProps, 'children' | 'activeOpacity'> {
  text: string;
  icon?: React.ReactNode;
}

const BottomSheetActionOption = ({ text, icon, ...props }: BottomSheetActionOptionProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      <BottomSheetSafeHorizontalView style={styles.actionOption}>
        {icon}
        <ThemedText style={styles.actionOptionText}>{text}</ThemedText>
      </BottomSheetSafeHorizontalView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 15,
  },
  actionOptionText: {
    color: 'white',
  },
});

export default BottomSheetActionOption;
