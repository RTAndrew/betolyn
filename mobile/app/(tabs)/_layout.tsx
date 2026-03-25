import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.complementary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: colors.greyDark,
            },
            default: {
              backgroundColor: colors.greyDark,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
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
          name="spaces"
          options={{
            title: 'Espaços',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
