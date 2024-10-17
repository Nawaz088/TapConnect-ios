import React from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { StyleSheet, Dimensions, useColorScheme } from "react-native";
import { TabBarIcon } from "./navigation/TabBarIcon";
import {
    Ionicons,
    MaterialCommunityIcons,
    FontAwesome6,
    Fontisto,
    FontAwesome,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { socialLinks } from "@/constants/SocialIcons"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type IconLibrary =
  | typeof Ionicons
  | typeof MaterialCommunityIcons
  | typeof FontAwesome6
  | typeof Fontisto
  | typeof FontAwesome;

interface Props {
    iconLib?: IconLibrary;
    iconName: string;
    disc: string;
    reachNumber: string
}

const handleExtractSocialPlatfroms = (label: string) => {
  if(label === "logo-phone") return "call-outline"
  if (label === "logo-mail") return "mail-outline"
  console.log("|||||||||||||||||", label)
  const socialMatch = socialLinks.find((social) => social.icon === label?.toLowerCase())
  return socialMatch ? socialMatch.icon : "link-outline"
}
const AnalyticsListItem = ({iconLib={Ionicons}, iconName="globe-outline", disc, reachNumber} : Props) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  return (
    <ThemedView style={styles.listContainer}>
      <ThemedView style={styles.iconAndTitle}>
        <TabBarIcon
          library={iconLib}
          name={handleExtractSocialPlatfroms(iconName)}
          size={24}
          color={Colors.numberColors.Figma_black}
        />
        <ThemedText style={[styles.text, {color: Colors.numberColors.Figma_black}]}>{disc}</ThemedText>
      </ThemedView>
      <ThemedText style={[styles.text, {color: Colors.numberColors.Figma_black}]}>{reachNumber}</ThemedText>
    </ThemedView>
  );
};

export default AnalyticsListItem;

const styles = StyleSheet.create({
  listContainer: {
    width: "auto",
    height: screenHeight * 0.08,
    padding: 20,
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconAndTitle: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontFamily: "RobotoMedium",
    fontSize: 14
  }
});
