import React from 'react';
import { StyleProp, ViewStyle, useColorScheme } from 'react-native';
import {Ionicons, MaterialCommunityIcons, FontAwesome6, Fontisto, FontAwesome, Entypo } from '@expo/vector-icons';


type IconLibrary = typeof Ionicons | typeof MaterialCommunityIcons | typeof FontAwesome6 | typeof Fontisto | typeof FontAwesome | typeof Entypo;

interface IconProps {
  library: IconLibrary;
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export function TabBarIcon({ 
  library: IconComponent,
  name,
  size = 28, 
  style, 
  color,
  ...rest 
}: IconProps) {
  return (
    <IconComponent 
      name={name}
      size={size} 
      style={[{ marginBottom: -3 }, style]} 
      color={color}
      {...rest} 
    />
  );
}