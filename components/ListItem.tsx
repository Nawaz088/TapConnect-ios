import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Dimensions, TouchableOpacity, Switch, useColorScheme } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { TabBarIcon } from "./navigation/TabBarIcon";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
  Fontisto,
  FontAwesome,
} from "@expo/vector-icons";

import { get, save } from '../constants/Storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { BottomSheet } from "react-native-btr";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type IconLibrary =
  | typeof Ionicons
  | typeof MaterialCommunityIcons
  | typeof FontAwesome6
  | typeof Fontisto
  | typeof FontAwesome;

interface Props {
  titletext?: string;
  backgroundColor?: string;
  libName?: IconLibrary;
  iconName?: string;
  iconColor?: string;
  needSwitch?: boolean;
  onClick?: () => void
}

const ListItem = ({
  titletext,
  backgroundColor,
  libName = MaterialCommunityIcons,
  iconName = "person-outline",
  iconColor,
  needSwitch,
  onClick
}: Props) => {
  const colorScheme = useColorScheme();
  const defaultIconColor = colorScheme === 'dark' ? '#fff' : Colors.numberColors.Figma_black;
  const [isEnabled, setIsEnabled] = useState(false);
  const [EditBottomSheet, setEditBottomSheet] = useState(false);


  const containerStyle = [
    styles.Container,
    { backgroundColor: backgroundColor || (colorScheme === 'dark' ? '#181823' : '#fff') }
  ];

  const textStyles = [
    styles.TitleStyles,
    iconColor ? { color: iconColor } : {}, //this icon color is being added to the text also
  ];


  const toggleSwitch = () => {
    setIsEnabled(prevState => {
      const newIsEnabled = !prevState;
      console.log("The new value of the toggle switch is == ", newIsEnabled);
      AsyncStorage.setItem('isEnabled', JSON.stringify(newIsEnabled));
      return newIsEnabled;
    });
  };

  return (
    <ThemedView style={containerStyle}>
      
      <TouchableOpacity onPress={onClick} style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
        <TabBarIcon
          library={libName}
          name={iconName}
          size={24}
          color={iconColor ? iconColor : defaultIconColor}
        />
        <ThemedText
          lightColor="#000"
          darkColor="#fff"
          style={textStyles}
        >
          {titletext}
        </ThemedText>
      </TouchableOpacity>

      {needSwitch ? (
        <ThemedView style={styles.SwitchStyles}>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </ThemedView>
      ) : null}
    </ThemedView>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
    width: screenWidth * 0.9,
    height: screenHeight * 0.07,
    opacity: 1,
    paddingStart: 12,
    paddingEnd: 12,
    marginTop: 10,
    // elevation: 0.4
  },
  TitleStyles: {
    paddingStart: 20,
    fontSize: 14,
    fontWeight: 'medium',
    color: '#2E3A59',
    fontFamily: 'RobotoMedium'
  },
  SwitchStyles: {
    marginLeft: 'auto'
  },
  EditBottomSheetView: {
    width: '100%',
    height: "70%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff'
  }
});
