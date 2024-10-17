import React, { useState } from "react";
import { ThemedView } from "./ThemedView";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { TabBarIcon } from "./navigation/TabBarIcon";
import { Entypo } from "@expo/vector-icons";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { Colors } from "@/constants/Colors";
import { useDispatch } from "react-redux";
import deleteContact from "@/store/Slice/contactsSlice" //we dont need this as we are using DB
import { url } from "@/constants/Urls";

interface Props {
  Title: string;
  description: string;
  avatar?: any;
  Id: string;
  onDelete: () => void
  onEdit: () => void
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ContastsList = ({Id, Title, description, avatar, onDelete, onEdit }: Props) => {

  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";
  
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  const handleDelete = () => {
    hideMenu();
    //later when we implemnt backend we will add more here
    if(onDelete){
      onDelete()
    }
  }

  const handleEdit = () => {
    onEdit()
  }
  const baseurl = url.baseUrl;

  //menu ViewStyle may implemented hai tu if i give direct list of styles to menu it is giving error
  //so this is the new flatten implementation
  const menuStyles = StyleSheet.flatten([
    styles.menuStyles,
    {backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background}
  ])

  // console.log("BASE url for the Avatar>>", `${baseurl}/${avatar}`)
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.avatarAndName}>
        <Image
          style={styles.avatar}
          source={{ uri: avatar !== "" ? `${baseurl}/${avatar}` : `https://avatar.iran.liara.run/username?username=${Title}` }}
        />

        <ThemedView style={{ width: screenWidth * 0.5 }}>
          <ThemedText darkColor="#FFF" lightColor="1D1B20" style={{ fontSize: 16, fontFamily: 'RobotoMedium'}}>{Title}</ThemedText>
          <ThemedText
            style={{ fontWeight: "300", flexWrap: "wrap", overflow: "hidden", color: "#2E3A59", fontFamily: "RobotoRegular" }}
          >
            {description}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <TouchableOpacity onPress={showMenu}>
        <Menu
          visible={visible}
          anchor={
            <TabBarIcon
              library={Entypo}
              name="dots-three-vertical"
              color={iconColor}
            />
          }
          onRequestClose={hideMenu}
          style={menuStyles}
        >
          {/* <MenuItem onPress={hideMenu} style={styles.menuItemsStyle}>
            <ThemedText>Add Group</ThemedText>
          </MenuItem> */}
          <MenuItem onPress={handleEdit}>
            <ThemedText style={styles.MenuText}>Edit</ThemedText>
          </MenuItem>
          <MenuItem onPress={handleDelete}>
            <ThemedText darkColor="red" lightColor="red" style={styles.MenuText}>Delete</ThemedText>
          </MenuItem>
        </Menu>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default ContastsList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  avatar: {
    width: screenWidth * 0.15,
    height: screenHeight * 0.07,
    borderRadius: 30,
  },
  avatarAndName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  menuStyles: {
    height: screenHeight * 0.12,
    width: screenWidth * 0.3,
    borderRadius: 13,
    alignItems: "center",
  },
  menuItemsStyle: {
    marginBottom: 0,
  },
  MenuText: {
    textAlign: 'center'
  }
});
