import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons, FontAwesome6, Fontisto, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import CustomTabBarButton from '@/components/CustomTabBarButton';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        tabBarStyle: {
          backgroundColor: colorScheme === 'light' ? '#fff' : '#000',
          borderTopColor: colorScheme === 'light' ? Colors.light.background : '#000',
          paddingTop: 5,
          paddingLeft: 10,
          // paddingVertical: 20,
          paddingStart: 5,
          paddingEnd: 10,
          width: '100%',
          height: "6.5%",
        },
        tabBarIconStyle: {
          marginTop: 6,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon library={MaterialCommunityIcons} name="account-circle-outline" size={27} color={color} />
          ),
          
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon library={MaterialIcons} name="people-outline" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile_link"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon library={Fontisto} name="link2" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon library={FontAwesome} name="bar-chart" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon library={Ionicons} name="settings-outline" size={25} color={color} />
          ),
        }}
      />
      
      
    </Tabs>
  );
}
