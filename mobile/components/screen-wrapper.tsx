import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean; // Enable scrollable screen
  statusBarStyle?: 'default' | 'dark-content' | 'light-content';
  backgroundColor?: string; // Background color customization
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = true,
  statusBarStyle = 'dark-content',
  backgroundColor = '#fff',
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={statusBarStyle} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {scrollable ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1, paddingHorizontal: 16 }}>{children}</View>
            </ScrollView>
          ) : (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>{children}</View>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
