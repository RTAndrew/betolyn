import { Stack } from 'expo-router'
import React from 'react'

const FormSheetLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]/index" options={{ headerShown: false }} />
    </Stack>
  )
}

export default FormSheetLayout