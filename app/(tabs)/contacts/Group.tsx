import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import List from "@/components/List";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { url } from "@/constants/Urls";
import axios from "axios";
import ContastsList from "@/components/ContastsList";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Menu, MenuItem } from "react-native-material-menu";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Group = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [contacts, setContacts] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  // const [wholeData, setWholeData] = useState([])

  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";
  const { title, Id } = useLocalSearchParams();
  // const contacts = useSelector((state: RootState) => state.contacts.contacts)

  const baseUrl = url.baseUrl;
  const getContacts = async () => {
    const config = {
      method: "get",
      url: `${baseUrl}/api/group/${Id}`,
    };
    await axios(config)
      .then((response) => {
        // console.log(
        //   "this is the data we got from..............",
        //   response.data
        // );
        setContacts(response.data.user);
        setGroupId(response.data._id);
        setDescription(response.data.description);
        // setWholeData(response.data)
      })
      .catch((error) => {
        console.log("this is the error we got from..............", error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getContacts();
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      const data = {
        users: id,
      };
      const config = {
        method: "put",
        url: `${baseUrl}/api/group/${groupId}/remove-users`,
        data: data,
      };
      await axios.request(config);
      console.log(
        "Contact deleted successfully",
        `${baseUrl}/api/contact/${id}`
      );
      // Update local contactsList state after successful deletion
      setContacts((prevContacts: any) =>
        prevContacts.filter((contact: any) => contact._id !== id)
      );
    } catch (error) {
      console.log("Error while deleting contact", error);
    }
  };

  const menuStyles = StyleSheet.flatten([
    styles.menuStyles,
    {
      backgroundColor:
        colorScheme === "dark"
          ? Colors.dark.background
          : Colors.light.background,
    },
  ]);

  const renderItem = (item: any) => {
    return (
      <ThemedView
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <Image
            source={{
              uri: `https://app.tapconnect.in/${item.item.self_photo}`,
            }}
            width = {screenWidth * 0.15}
      			height = {screenWidth * 0.15}
            style={{ borderRadius: 25 }}
          />
          <View>
            <ThemedText style={{ fontFamily: "RobotoMedium", fontSize: 16 }}>
              {item.item.name}
            </ThemedText>
            <ThemedText style={{ fontFamily: "RobotoRegular", fontSize: 14 }}>
              {item.item.designation}
            </ThemedText>
          </View>
        </View>

        {/* <TabBarIcon library={Entypo} name={"dots-three-vertical"} size={20} /> */}
        <TouchableOpacity onPress={() => showMenu(item.item._id)}>
          <Menu
            visible={visibleMenuId === item.item._id}
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
            <MenuItem onPress={() => handleDelete(item.item._id)}>
              <ThemedText
                darkColor="red"
                lightColor="red"
                style={styles.MenuText}
              >
                Delete
              </ThemedText>
            </MenuItem>
          </Menu>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  const showMenu = (id: string) => {
    setVisibleMenuId(id);
  };

  const hideMenu = () => {
    setVisibleMenuId(null);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
        }}
      >
        <ThemedText type="title" style={{ fontFamily: "RobotoMedium" }}>
          {title}
        </ThemedText>
        <ThemedView style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors.bgColors.Cornflower_Blue },
            ]}
            onPress={() =>
              router.push({ pathname: "/contacts/AddContacts", params: { Id } })
            }
          >
            <ThemedText style={{ color: "#fff" }}>+ Add Contact</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors.numberColors.Link_Water },
            ]}
            onPress={() =>
              router.navigate({
                pathname: "/(tabs)/contacts/EditGroup",
                params: { name: title, desc: description, Id: groupId },
              })
            }
          >
            <ThemedText style={{ color: Colors.numberColors.Edit_blue }}>
              Edit Group
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView
          style={[
            styles.groupListContainer,
            { backgroundColor: colorScheme === "dark" ? "#121212" : "#fff" },
          ]}
        >
          {/* <List
            searchPhrase={searchPhrase}
            data={contacts}
            setClicked={setClicked}
            onDelete={handleDelete}
          /> */}
          <FlatList
            data={contacts}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default Group;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    width: "50%",
    height: screenHeight * 0.07,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  groupListContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 3,
    marginTop: 20,
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  menuStyles: {
    height: screenHeight * 0.06,
    width: screenWidth * 0.3,
    borderRadius: 13,
    alignItems: "center",
  },
  MenuText: {
    textAlign: "center",
  },
});
