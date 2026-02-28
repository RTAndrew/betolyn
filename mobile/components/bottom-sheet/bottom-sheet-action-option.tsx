import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ThemedText } from '../ThemedText';
import BottomSheetSafeHorizontalView from './bottom-sheet-safe-horizontal-view';

export interface BottomSheetActionOptionProps
  extends Omit<TouchableOpacityProps, 'children' | 'activeOpacity'> {
  text: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const BottomSheetActionOption = ({
  text,
  icon,
  disabled,
  ...props
}: BottomSheetActionOptionProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} disabled={disabled} {...props}>
      <BottomSheetSafeHorizontalView
        style={StyleSheet.flatten([styles.actionOption, disabled && styles.disabled])}
      >
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
  disabled: {
    opacity: 0.5,
  },
});

export default BottomSheetActionOption;
