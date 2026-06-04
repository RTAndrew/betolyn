import React, { PropsWithChildren } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  type RefreshControlProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps extends Omit<WithSafeAreaProps, 'backgroundColor'> {
  children: React.ReactNode;
  /** Wrapps the content in a scroll view.
   * @default ```true```
   */
  scrollable?: boolean;
  statusBarStyle?: 'default' | 'dark-content' | 'light-content';
  backgroundColor?: string; // Background color customization
  /** When scrollable is `true`, this will be the refresh control for the scroll view */
  refreshControl?: RefreshControlProps;
  style?: StyleProp<ViewStyle>;
}

interface WithSafeAreaProps {
  backgroundColor: string;
  safeArea?: boolean;
  bottomSafeArea?: boolean;
}

const WithSafeArea = ({
  children,
  backgroundColor,
  safeArea = true,
  bottomSafeArea = false,
}: PropsWithChildren<WithSafeAreaProps>) => {
  const insets = useSafeAreaInsets();

  if (safeArea) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor,
          paddingTop: insets.top,
          paddingBottom: bottomSafeArea ? insets.bottom : 0,
        }}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor, paddingBottom: bottomSafeArea ? insets.bottom : 0 }}>
      {children}
    </View>
  );
};

const ScreenWrapper = ({
  children,
  scrollable = true,
  statusBarStyle = 'light-content',
  backgroundColor = '#fff',
  safeArea = true,
  refreshControl,
  bottomSafeArea = false,
  style,
}: PropsWithChildren<ScreenWrapperProps>) => {
  return (
    <WithSafeArea
      backgroundColor={backgroundColor}
      safeArea={safeArea}
      bottomSafeArea={bottomSafeArea}
    >
      <StatusBar barStyle={statusBarStyle} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // Removes the empty space or margin between the keyboard and the content
        keyboardVerticalOffset={Platform.OS === 'ios' ? -40 : undefined}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {scrollable ? (
            <ScrollView
              style={style}
              refreshControl={refreshControl ? <RefreshControl {...refreshControl} /> : undefined}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 72 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={style}>{children}</View>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </WithSafeArea>
  );
};

export default ScreenWrapper;
