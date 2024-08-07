import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#DDDDDD', // Warna hitam untuk ikon yang aktif
        tabBarInactiveTintColor: '#747474', // Warna putih untuk ikon yang tidak aktif
        tabBarStyle: {
          backgroundColor: '#1d1d1d', // Warna abu-abu untuk tab bar
        },
        headerShown: false, // Menyembunyikan header di tab navigation
      }}
    >
      <Tabs.Screen
        name="MovieListScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="FavoriteMovieScreen"
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'save' : 'save-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
