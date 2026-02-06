import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#F3CA41',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: '#262F3D',
            },
            default: {
              backgroundColor: '#262F3D',
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Apostas',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="betslips"
          options={{
            title: 'Apostas',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="dollarsign" color={color} />,
          }}
        />
        <Tabs.Screen
          name="channels"
          options={{
            title: 'Canais',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
