import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomTabBarButton = (props: any) => {
  const { children, onPress, accessibilityState } = props;
  const isSelected = accessibilityState.selected;

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.activeContainer]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Adjust the border radius as needed
  },
  activeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E71FF', // Active tab background color
    width: screenWidth * 0.01,
    height: screenHeight * 0.057,
    borderRadius: 50, // Ensure the radius matches
  },
});

export default CustomTabBarButton;
