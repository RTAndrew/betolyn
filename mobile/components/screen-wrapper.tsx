import React, { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean; // Enable scrollable screen
  statusBarStyle?: 'default' | 'dark-content' | 'light-content';
  backgroundColor?: string; // Background color customization
  safeArea?: boolean;
}

const WithSafeArea = ({
  children,
  backgroundColor,
  safeArea = true,
}: PropsWithChildren<{ backgroundColor: string; safeArea?: boolean }>) => {
  const insets = useSafeAreaInsets();

  if (safeArea) {
    return <View style={{ flex: 1, backgroundColor, paddingTop: insets.top }}>{children}</View>;
  }

  return <View style={{ flex: 1, backgroundColor }}>{children}</View>;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = true,
  statusBarStyle = 'dark-content',
  backgroundColor = '#fff',
  safeArea = true,
}) => {
  return (
    <WithSafeArea backgroundColor={backgroundColor} safeArea={safeArea}>
      <StatusBar barStyle={statusBarStyle} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {scrollable ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 72 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1 }}>{children}</View>
            </ScrollView>
          ) : (
            <View>{children}</View>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </WithSafeArea>
  );
};

export default ScreenWrapper;
