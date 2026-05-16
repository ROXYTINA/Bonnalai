import React from 'react';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="subject"
        options={{
          title: 'Subject',
          tabBarIcon: ({ color }) => <IconSymbol name="book.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="years"
        options={{
          title: 'Years',
          tabBarIcon: ({ color }) => <IconSymbol name="eye.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="others"
        options={{
          title: 'Others',
          tabBarIcon: ({ color }) => <IconSymbol name="doc.text" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

