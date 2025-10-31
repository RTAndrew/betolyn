import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionSheet, { ActionSheetProps, ActionSheetRef } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <SafeAreaView style={{ paddingVertical: 16 }}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </SafeAreaView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: '#61687E',
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 32,
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BottomSheet;
