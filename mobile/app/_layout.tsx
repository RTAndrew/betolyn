import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ShimmerProvider } from 'react-native-fast-shimmer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import GlobalSheetRegistry from '@/components/bottom-sheet/global-sheets/registry';
import StreamEventSource from '@/components/server-sent-events';
import { colors } from '@/constants/colors';
import { hydrateAuthStore } from '@/stores/auth.store';
import { queryClient } from '@/utils/react-query';
import 'react-native-reanimated';

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
    } catch {
    } finally {
      setIsHydrated(false);
      try {
        await SplashScreen.hideAsync();
      } catch {
        // No native splash screen registered (e.g. iOS Expo Go or view controller not ready).
        // App can continue without hiding the splash.
      }
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
        <GlobalSheetRegistry>
          <ShimmerProvider duration={1500}>
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
                      presentation: 'card',
                      animation: 'fade_from_bottom',
                      animationDuration: 130,
                    }}
                  />

                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style={'light'} backgroundColor={colors.greyDark} />
              </KeyboardProvider>
            </SafeAreaProvider>
          </ShimmerProvider>
        </GlobalSheetRegistry>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
