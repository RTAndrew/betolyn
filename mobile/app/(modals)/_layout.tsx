import { Stack } from 'expo-router'
import React from 'react'

const ModalsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="channels/[id]/create-event/index"
        options={{
          headerShown: false,
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          sheetElevation: 24,
          sheetGrabberVisible: true,
          gestureDirection: 'vertical',
          sheetAllowedDetents: [50],
        }}
      />

      <Stack.Screen name="matches" options={{ headerShown: false }} />
    </Stack>
  )
}

export default ModalsLayout
