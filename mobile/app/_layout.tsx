import { queryClient } from '@/utils/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import StreamEventSource from '@/server-sent-events';
import { useEffect, useState } from 'react';
import { hydrateAuthStore } from '@/stores/auth.store';

if (__DEV__) {
  require('../reactotron-config');
}

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from automatically hiding

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isHydrated, setIsHydrated] = useState(true);

  const handleHydration = async () => {
    try {
      await hydrateAuthStore();
    } catch (error) {
    } finally {
      setIsHydrated(false);
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    handleHydration();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (isHydrated) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StreamEventSource />
        <SafeAreaProvider>
          <KeyboardProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen
                name="(modals)"
                options={{
                  headerShown: false,
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
              />

              {/* This has to be here otherwise the form sheet will not work */}
              <Stack.Screen
                name="(form-sheet)"
                options={{
                  headerShown: false,
                  presentation: 'formSheet',
                  animation: 'slide_from_bottom',
                  contentStyle: { height: '100%' },
                  sheetElevation: 24,
                  sheetGrabberVisible: false,
                  gestureDirection: 'vertical',
                  gestureEnabled: true,
                  sheetAllowedDetents: [1],
                }}
              />

              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={'light'} backgroundColor="#262F3D" />
          </KeyboardProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
