import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal/match/[id]"
          options={{
            headerShown: false,
            presentation: 'formSheet',
            animation: 'slide_from_bottom',
            sheetElevation: 24,
            sheetGrabberVisible: true,
            gestureDirection: 'vertical',
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
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} backgroundColor="#262F3D" />
    </>
  );
}
