import React, { useEffect, useRef } from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import ActionSheet, { ActionSheetProps, ActionSheetRef } from 'react-native-actions-sheet';
import BottomSheetSafeHorizontalView from './bottom-sheet-safe-horizontal-view';
import BottomSheetHeader from './bottom-sheet-header';
import BottomSheetActionOption from './bottom-sheet-action-option';

export interface BottomSheetProps extends ActionSheetProps {
  title?: string;
  visible?: boolean;
  minHeight?: number;
  onClose: () => void;
}

const BottomSheet = ({
  containerStyle,
  visible = true,
  minHeight,
  children,
  onClose,
  title,
  ...props
}: BottomSheetProps) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    const actionSheet = actionSheetRef.current;
    if (visible) {
      actionSheet?.show();
      // TODO: change navigation bar color
    } else {
      actionSheet?.hide();
    }
  }, [visible]);

  return (
    <ActionSheet
      gestureEnabled
      onClose={onClose}
      ref={actionSheetRef}
      containerStyle={{ ...styles.container, ...(containerStyle as object) }}
      {...props}
    >
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.root}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: '#61687E',
  },
  root: { paddingBottom: Platform.OS === 'ios' ? '10%' : '20%', paddingTop: 24 },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 32,
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

BottomSheet.SafeHorizontalView = BottomSheetSafeHorizontalView;
BottomSheet.Header = BottomSheetHeader;
BottomSheet.ActionOption = BottomSheetActionOption;

export default BottomSheet;
