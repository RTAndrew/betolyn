import { queryClient } from '@/utils/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { SSEProvider } from '@/SseStore/provider';

if (__DEV__) {
  require('../reactotron-config');
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SSEProvider>

    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <KeyboardProvider>
            <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal/match/[id]"
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
            <Stack.Screen
              options={{
                headerShown: false,
                presentation: 'containedModal',
                animation: 'slide_from_bottom',
                sheetElevation: 24,
                sheetGrabberVisible: true,
                gestureDirection: 'vertical',
                sheetAllowedDetents: [50],
              }}
              name="modal/channels/[id]/create-event/index"
            />

            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={'light'} backgroundColor="#262F3D" />
        </KeyboardProvider>
      </SafeAreaProvider>
      </QueryClientProvider>
    </SSEProvider>

  );
}
