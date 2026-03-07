import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionSheet, { ActionSheetProps, ActionSheetRef } from 'react-native-actions-sheet';

import { colors } from '@/constants/colors';

import { Button } from '../button';
import { ThemedText } from '../ThemedText';
import BottomSheetActionOption from './bottom-sheet-action-option';
import BottomSheetHeader from './bottom-sheet-header';
import BottomSheetSafeHorizontalView from './bottom-sheet-safe-horizontal-view';

export interface BottomSheetProps extends ActionSheetProps {
  title?: string;
  visible?: boolean;
  minHeight?: number;
  onClose?: () => void;
}

const BottomSheet = ({
  containerStyle,
  indicatorStyle,
  visible = true,
  minHeight: _minHeight,
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
      openAnimationConfig={{ duration: 250 }}
      indicatorStyle={[styles.indicator, indicatorStyle]}
      containerStyle={{ ...styles.container, ...(containerStyle as object) }}
      {...props}
    >
      <View style={styles.root}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 10,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    paddingVertical: 8,
    backgroundColor: colors.greyLight,
  },
  indicator: {
    width: 45,
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

interface ModalConfirmationProps extends BottomSheetProps {
  title: string;
  visible?: boolean;
  onClose: () => void;
  description?: string;
  destructive?: boolean;
  onConfirmText?: string;
  onCancelText?: string;
  onConfirm?: () => Promise<void> | void;
}

const ModalConfirmation = ({
  onConfirmText = 'Confirm',
  onCancelText = 'Cancel',
  destructive = false,
  visible = true,
  description,
  onConfirm,
  onClose,
  title,
  children,
  ...props
}: ModalConfirmationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm?.();
      onClose();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return <></>;

  return (
    <BottomSheet onClose={onClose} visible={true} {...props}>
      <BottomSheet.SafeHorizontalView>
        <ThemedText style={modalConfirmationStyles.title}>{title}</ThemedText>
        {description && (
          <ThemedText style={modalConfirmationStyles.description}>{description}</ThemedText>
        )}

        {children}

        <View style={modalConfirmationStyles.actions}>
          {onConfirm && (
            <Button.Root
              loading={isLoading}
              onPress={handleConfirm}
              style={{ backgroundColor: destructive ? colors.secondary : colors.terciary }}
            >
              {onConfirmText}
            </Button.Root>
          )}
          <Button.Root variant="text" onPress={onClose}>
            {onCancelText}
          </Button.Root>
        </View>
      </BottomSheet.SafeHorizontalView>
    </BottomSheet>
  );
};

const modalConfirmationStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 10,
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'left',
  },
  description: {},
  actions: {
    gap: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 30,
  },
});

BottomSheet.SafeHorizontalView = BottomSheetSafeHorizontalView;
BottomSheet.Header = BottomSheetHeader;
BottomSheet.ActionOption = BottomSheetActionOption;

BottomSheet.ModalConfirmation = ModalConfirmation;

export default BottomSheet;
