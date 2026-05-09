import React, { PropsWithChildren } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  type RefreshControlProps,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Wrapps the content in a scroll view.
   * @default
   * ```true```
   */
  scrollable?: boolean;
  statusBarStyle?: 'default' | 'dark-content' | 'light-content';
  backgroundColor?: string; // Background color customization
  safeArea?: boolean;
  /** When scrollable is `true`, this will be the refresh control for the scroll view */
  refreshControl?: RefreshControlProps;
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

const ScreenWrapper = ({
  children,
  scrollable = true,
  statusBarStyle = 'light-content',
  backgroundColor = '#fff',
  safeArea = true,
  refreshControl,
}: PropsWithChildren<ScreenWrapperProps>) => {
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
              refreshControl={refreshControl ? <RefreshControl {...refreshControl} /> : undefined}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 72 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
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
