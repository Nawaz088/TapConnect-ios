import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, Image } from "react-native";
import SearchBar from "@/components/SearchBar";
import List from "@/components/List";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { router, useFocusEffect } from "expo-router";
import ScanButton from "@/components/ScanButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "@/constants/Urls";
import axios from "axios";
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { addContact, setcontacts } from "@/store/Slice/contactsSlice";
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as SecureStore from 'expo-secure-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const contacts = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [contactsClicked, setContactsclicked] = useState(true);
  const [groups, setGroups] = useState<any>();
  const [contactsList, setContactsList] = useState<string[] | any>();

  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const contactsFromSlice = useSelector(
    (state: RootState) => state.contacts.contacts
  );

  
  const baseUrl = url.baseUrl;

  const getGroups = async () => {
    const Id = await SecureStore.getItemAsync("UserId");

    try {
      const config = {
        method: "get",
        maxbodysize: Infinity,
        url: `${baseUrl}/api/groups/${Id}`,
      };
      await axios.request(config).then((response) => {
        console.log(
          "Response from get Group data",
          JSON.stringify(response.data)
        );
        setGroups(response.data);
        // console.log("this was the groups??????????????", response.data);
      });
    } catch (error) {
      console.log("Error while getting groups", error);
    }
  };

  const getContacts = async () => {
    const userId = await SecureStore.getItemAsync("UserId");
    
    try{
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/contact/${userId}`,
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        console.log("CONTACTS response >>>>>>>>>>>>>>>",JSON.stringify(response.data));
        // console.log("this was the url for setting contacts??????????????", `${baseUrl}/api/contact/${userId}`);
        setContactsList(response.data);
        dispatch(setcontacts(response.data));
        // console.log("this was the contacts list??????????????", contactsList);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch(error) {
      console.log("Error while getting contacts", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const config = {
        method: 'delete',
        url: `${baseUrl}/api/contact/${id}`,
      };
      await axios.request(config);
      console.log("this was the contact delete url>>>>>", `${baseUrl}/api/contact/${id}`)
      // Update local contactsList state after successful deletion
      setContactsList((prevContacts:any) => prevContacts.filter((contact:any) => contact._id !== id));
    } catch (error) {
      console.log("Error while deleting contact", error);
    }
  };

  const handleGroupDelete = async (id: string) => {
    try {
      const data = {
        "users": id
      }
      const config = {
        method: 'put',
        url: `${baseUrl}/api/group/${id}/remove-users`,
        data: data
      }
      await axios.request(config).then((response) => {
        console.log("Response from delete group data");
        setGroups((prevGroups: any) => prevGroups.filter((group: any) => group._id !== id))
      }).catch((error) => {
        console.log("Error while deleting group", error);
      })
    } catch (error) {
      console.log("Error while deleting group", error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getGroups();
      getContacts();
    }, [])
  );

 
  const handleExcelExport = async () => {
    const DataToBeSaved = await contactsList.map((item: any) => ({
      Name: item.name,
      Email: item.email,
      PhoneNo: item.mobile,
      Designation: item.designation,
      Company: item.company
    }));
  
    console.log("this was the data to be saved", DataToBeSaved)
    var ws = XLSX.utils.json_to_sheet(DataToBeSaved);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cities");
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri = FileSystem.cacheDirectory + "contacts.xlsx";
    // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "MyWater data",
      UTI: "com.microsoft.excel.xlsx",
    });
  }

  // console.log("Groups", groups);
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: 'center',
            top: 0
          }}
        >
          <ThemedText
            lightColor="black"
            darkColor="#FFFFFF"
            style={styles.headerText}
          >
            Contacts
          </ThemedText>
          <TouchableOpacity
            // style={{
            //   display: "flex",
            //   flexDirection: "row",
            //   alignItems: "center",
            //   gap: 5,
            //   marginLeft: "auto",
            //   padding: 20,
            // }}
            onPress={handleExcelExport}
          >
            <Image
              style={{ width: 27*1.2, height: 26*1.2 }}
              source={require("@/assets/images/icons8-excel-48.png")}
            />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            clicked={clicked}
            setClicked={setClicked}
          />
          {contactsClicked ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/newContacts")}
            >
              <Text style={{ color: Colors.numberColors.Radical_Red, fontFamily: "RobotoMedium", fontSize: 14  }}>
                + Add
              </Text>
            </TouchableOpacity>
          ) : (
            // this button is for the create groupe page
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/contacts/NewGroup")}
            >
              <Text style={{ color: Colors.numberColors.Radical_Red, fontFamily: "RobotoMedium", fontSize: 14 }}>
                + Add
              </Text>
            </TouchableOpacity>
          )}
        </ThemedView>

        <ThemedView
          style={styles.segmented_Buttons}
          lightColor={Colors.light.background}
          darkColor={Colors.dark.background}
        >
          <TouchableOpacity
            style={[
              styles.contactsButton,
              contactsClicked ? styles.activeButton : null,
            ]}
            onPress={() => setContactsclicked(true)}
          >
            <TabBarIcon
              library={MaterialIcons}
              name="person-outline"
              size={20}
              color={colorScheme === 'dark' ? contactsClicked ? "#fff" : "#aaa" : contactsClicked ? "#fff" : "#000"}
            />
            <ThemedText
              style={{
                fontSize: 14,
                // fontWeight: "medium",
                fontFamily: 'roboto-medium',
                color: colorScheme === 'dark' ? contactsClicked ? "#fff" : "#aaa" : contactsClicked ? "#fff" : "#000",
              }}
            >
              Contacts
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={[
              styles.groupsButton,
              contactsClicked ? null : styles.activeButton,
            ]}
            onPress={() => setContactsclicked(false)}
          >
            <TabBarIcon
              library={MaterialCommunityIcons}
              name="account-group-outline"
              size={20}
              color={colorScheme === 'dark' ? contactsClicked ? "#aaa" : "#fff" : contactsClicked ? "#000" : "#fff"}
            />
            <ThemedText style={{ color: colorScheme === 'dark' ? contactsClicked ? "#aaa" : "#fff" : contactsClicked ? "#000" : "#fff" , fontFamily: "RobotoMedium", fontSize: 14 }} >
              Groups
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* ##############################SCAN Button #################### */}
        <ThemedView style={styles.scanButton}>
          <ScanButton />
        </ThemedView>
        {/* ############################################################## */}

{/* ############################COntacts LIST################################################### */}
        <ThemedView
          style={styles.listContainer}
          lightColor="#fff"
          darkColor="#181823"
        >
          {contactsClicked ? (
            <List
              searchPhrase={searchPhrase}
              data={contactsList}
              setClicked={setClicked}
              onDelete={handleDelete}
            />
// #############################################################################################
          ) : (
            <ScrollView>
              {groups ? (
                groups.map((group: any) => (
                  <TouchableOpacity
                    style={{
                      padding: 20,
                      paddingBottom: 30,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    // key={group._id}
                    onPress={() =>
                      router.push({
                        pathname: "/contacts/Group",
                        params: {
                          title: group.name,
                          Id: group._id,
                        },
                      })
                    }
                  >
                    <ThemedText
                      type="subtitle"
                      darkColor="#FFFFFF"
                      lightColor="#000000"
                    >
                      {group.name}
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => handleGroupDelete(group._id)}
                    >
                      <TabBarIcon
                        library={AntDesign}
                        name="delete"
                        size={25}
                        color={colorScheme === "dark" ? "red" : "red"}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              ) : (
                <ThemedText
                  type="subtitle"
                  style={{color: colorScheme === 'dark' ? '#fff' : '#000'}}
                >
                  No Groups Added
                </ThemedText>
              )}
            </ScrollView>
          )}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "android" ? 20 : 20,
    paddingTop: Platform.OS === "android" ? 16 : 20,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgColors.Amour,
    borderRadius: 15,
    width: screenWidth * 0.2,
    height: screenHeight * 0.06,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "medium",
    fontFamily: "RobotoMedium",
    paddingVertical: Platform.OS === "android" ? 15 : 15
  },
  segmented_Buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    width: screenWidth * 0.9,
    height: screenHeight * 0.07,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "grey",
  },
  line: {
    borderWidth: 1,
    height: screenHeight * 0.07,
    borderColor: "grey",
  },
  contactsButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    width: (screenWidth * 0.9) / 2,
    height: screenHeight * 0.07,
  },
  activeButton: {
    backgroundColor: Colors.bgColors.Cornflower_Blue,
    color: "#fff"
  },
  groupsButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    width: (screenWidth * 0.9) / 2,
    height: screenHeight * 0.07,
  },
  listContainer: {
    marginTop: 30,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 100,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: Platform.OS === "ios" ? screenHeight * 0.68 : screenHeight * 0.7,
    elevation: 5,
    zIndex: 1,
  },
  scanButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // marginBottom: screenHeight * 0.05,
    width: screenWidth - 40,
    height: screenHeight * 0.2,
  },
});
