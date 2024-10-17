import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, Image } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { ScrollView } from "react-native";
import ListItem from "@/components/ListItem";
import AnalyticsListItem from "@/components/AnalyticsListItem";
import { url } from "@/constants/Urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  setAnalyticsData,
  setProductCount,
} from "@/store/Slice/analyticsSlice";
import { BottomSheet } from "react-native-btr";
import NfcManager, { Ndef, NfcEvents, NfcTech } from "react-native-nfc-manager";
import Toast from "react-native-toast-message";
import { setUserData } from "@/store/Slice/userSlice";
import * as SecureStore from 'expo-secure-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const index = () => {
  const colorScheme = useColorScheme();
  const [userName, setUserName] = React.useState("");
  const [userPhoto, setUserPhoto] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [UserId, setUserId] = React.useState<any>();
  const [EditBottomSheet, setEditBottomSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  // we are getting data from redux
  const userData = useSelector((state: any) => state.user.data);
  console.log("userData from profile >>>>>>", userData);


  const toggleEditBottomSheetView = () => {
    //Toggling the visibility state of the bottom sheet
    setEditBottomSheet(!EditBottomSheet);
  };
  // const getUserData = async () => {
  //   const userId = await AsyncStorage.getItem('UserId')
  //   const url = `https://app.tapconnect.in/api/user/${userId}`
  //   axios.get(url, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
  //     console.log("userData from profile >>>>>>", res.data.data)
  //     dispatch(setUserData(res.data.data));
  //   })
  // }

  const dispatch = useDispatch();
  const socialLinks = [
    {
      id: "1",
      icon: "logo-whatsapp",
      label: "whatsapp",
      value: userData.whatsapp,
    },
    {
      id: "2",
      icon: "logo-instagram",
      label: "instagram",
      value: userData.instagram,
    },
    {
      id: "3",
      icon: "logo-facebook",
      label: "facebook",
      value: userData.facebook,
    },
    {
      id: "4",
      icon: "logo-twitter",
      label: "twitter",
      value: userData.twitter,
    },
    { id: "5", icon: "mail", label: "messages", value: userData.message },
    { id: "6", icon: "logo-tiktok", label: "tiktok", value: userData.tiktok },
    { id: "7", icon: "logo-snapchat", label: "snapchat", value: userData.snapchat  },
    { id: "8", icon: "logo-pinterest", label: "pinterest", value: userData.pinterest  },
    { id: "9", icon: "logo-reddit", label: "reddit", value: userData.reddit  },
    { id: "10", icon: "logo-twitch", label: "twitch", value: userData.reddit  },
    { id: "11", icon: "paper-plane-outline", label: "telegram", value: userData.reddit  },
  ];

  // const filteredSocialLinks = socialLinks.filter((link) => link.value !== "");
  const filteredSocialLinks = userData.links;

  const handleExtractSocialPlatfroms = (label: string) => {
    if(label === "Phone") return "call-outline"
    if (label === "Email") return "mail-outline"
    console.log("|||||||||||||||||", label)
    const socialMatch = socialLinks.find((social) => social.label === label?.toLowerCase())
    return socialMatch ? socialMatch.icon : "link-outline"
  }


  const [newPlatform, setNewPlatform] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const handleUpdateLinks = async () => {
    console.log("I have been Clicked")

    const userId = await SecureStore.getItemAsync('UserId');
    // Fetch the current user data from the server
    let existingLinks = [];
    try {
      const response = await axios.get(`https://app.tapconnect.in/api/user/${userId}`);
      existingLinks = response.data.links || []; // Assuming the existing links are stored under "links"
    } catch (error) {
      console.log("Error fetching user data:", error);
    }

    // Prepare the new link
    const newLink = { platform: selectedItem.platform, url: selectedItem.url, label: selectedItem?.label, id: selectedItem?._id };
    // Append the new link to the existing list
    const updatedLinks = existingLinks.map((link:any) => link._id === newLink.id ? { ...link, ...newLink } : link)
    const formData = new FormData();
    formData.append('links', JSON.stringify(updatedLinks));

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `https://app.tapconnect.in/api/user/${userId}`,
      data: formData,
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    };
    
    axios.request(config)
    .then((response) => {
      console.log("This Response is from Edit Link Screen",JSON.stringify(response.data));
      dispatch(setUserData(response.data));
      toggleEditBottomSheetView()
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handlePlatformChange = (text: string) => {
    setSelectedItem((prev:any) => ({ ...prev, platform: text }));
  };
  
  const handleUrlChange = (text: string) => {
    setSelectedItem((prev:any) => ({ ...prev, url: text }));
  };

  const handleDeleteLink = async (id:string) => {
    console.log("I have been Clicked", id)
    const userId = await SecureStore.getItemAsync('UserId');
    // Fetch the current user data from the server
    let existingLinks = [];
    try {
      const response = await axios.get(`https://app.tapconnect.in/api/user/${userId}`);
      existingLinks = response.data.links || []; // Assuming the existing links are stored under "links"
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
    const newLinks = existingLinks.filter((link:any) => link._id !== id)
    const formData = new FormData();
    formData.append('links', JSON.stringify(newLinks));

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `https://app.tapconnect.in/api/user/${userId}`,
      data: formData,
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    };
    
    axios.request(config)
    .then((response) => {
      console.log("This Response is from Delete Link Screen",JSON.stringify(response.data));
      dispatch(setUserData(response.data));
      toggleEditBottomSheetView()
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => {
      setSelectedItem(item)
      setEditBottomSheet(true)
      }} style={{ flexDirection: 'row', padding: 20, gap: 20, alignItems: 'center' }}>

      <Ionicons
        name={handleExtractSocialPlatfroms(item.label) as any}
        size={25}
        color={
          colorScheme === "dark" ? Colors.dark.text : Colors.light.text
        }
      />
      <ThemedText
        type="subtitle"
        lightColor="#000"
        darkColor="#fff"
        style={{ fontSize: 14, fontFamily: 'RobotoRegular', fontWeight: 'regular' }}
      >
        {item.platform}
      </ThemedText>

      <BottomSheet
        visible={EditBottomSheet}
        onBackButtonPress={toggleEditBottomSheetView}
        onBackdropPress={toggleEditBottomSheetView}
      >
        <ThemedView style={styles.EditBottomSheetView}>
            <Ionicons
            name={handleExtractSocialPlatfroms(selectedItem?.label) as any}
            size={35}
            color={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }/>
            <View style={{gap: 10, marginTop: 30}}>
              <View style={styles.inputContainer}>
                <TextInput placeholder="Enter Link" value={selectedItem?.platform} onChangeText={handlePlatformChange} style={{width: "100%"}}/>
              </View>
              <View style={styles.inputContainer}>
                <TextInput placeholder="Enter Link" value={selectedItem?.url} onChangeText={handleUrlChange} style={{width: "100%"}}/>
              </View>
            </View>
            <View style={{gap: 20, marginTop: 30, alignItems: 'center'}}>
              <TouchableOpacity onPress={() =>handleDeleteLink(selectedItem?._id)}>
                <ThemedText style={{color: 'red', fontFamily: 'RobotoMedium'}}>Delete</ThemedText>
              </TouchableOpacity> 
              <TouchableOpacity style={[styles.updateButton, { backgroundColor: Colors.bgColors.Cornflower_Blue, elevation: 3 }]} onPress={handleUpdateLinks}>
                <ThemedText style={{fontFamily: 'RobotoMedium', color: '#fff'}} >Update</ThemedText>
              </TouchableOpacity> 
              <TouchableOpacity onPress={toggleEditBottomSheetView}>
                <ThemedText style={{fontFamily: 'RobotoMedium'}}>Cancel</ThemedText>
              </TouchableOpacity> 
            </View>
        </ThemedView>
      </BottomSheet>

    </TouchableOpacity>
      // <ListItem
      //   titletext={item.platform}
      //   iconName={handleExtractSocialPlatfroms(item.label) as any}
      //   key={item.index}
      //   libName={Ionicons}
      //   backgroundColor={
      //     colorScheme === "dark"
      //       ? Colors.dark.background
      //       : Colors.light.background
      //   }
      // />
  );

  // const [analyticsData, setAnalyticsData] = React.useState<any>(null);
  const [linkTaps, setLinkTaps] = React.useState<any>();
  const baseUrl = url.baseUrl;

  const getAnalytics = async () => {
    const userId = await SecureStore.getItemAsync("UserId");
    setUserId(userId);
    const url = `${baseUrl}/api/track/stats/${userId}`;
    console.log("Analytics url>>>>>>>>", url);
    const config = {
      method: "GET",
      url: url,
    };
    await axios(config)
      .then((response: any) => {
        const data = response.data;
        // setAnalyticsData(response.data)
        dispatch(setAnalyticsData(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getAnalytics();
      // getUserData()
    }, [])
  );

  // ######################Bottom Sheet#######################
  const [visible, setVisible] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };


  const writeTag = async () => {
    const userId = await AsyncStorage.getItem("UserId");
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const url = `tap-connect://tap.me/${userId}`;
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      dispatch(setProductCount(1));
      Toast.show({
        type: "success",
        text1: "URL written to NFC tag successfully!",
      });
      //   await NfcManager.setAlertMessageIOS('URL written successfully!');
    } catch (error:any) {
      if (error.message.includes('NFCError:4099')) {
        console.log('Duplicate registration detected. Please try another tag.');
      } else {
        console.warn('NFC Error:', error);
      }
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  // const formatTag = async () => {
  //   try {
  //     await NfcManager.requestTechnology(NfcTech.Ndef);
  //     await NfcManager.clearBackgroundTag();
  //     console.log("Tag formatted successfully");
  //   } catch (error) {
  //     console.error("Error formatting NFC tag:", error);
  //   } finally {
  //     await NfcManager.cancelTechnologyRequest();
  //   }
  // };

  // const writeTag = async () => {
  //   const userId = await AsyncStorage.getItem("UserId");
  //   try {
  //     await NfcManager.requestTechnology(NfcTech.Ndef);
  //     const url = `tap-connect://tap.me/${userId}`;
  //     const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
  //     await NfcManager.ndefHandler.writeNdefMessage(bytes);
  
  //     dispatch(setProductCount(1));
  //     Toast.show({
  //       type: "success",
  //       text1: "URL written to NFC tag successfully!",
  //     });
  //   } catch (error: any) {
  //     console.error("Error writing NFC tag:", {
  //       message: error.message,
  //       stack: error.stack,
  //       name: error.name,
  //     });
  //     console.dir(error); // For a deeper inspection
  //     console.trace(); // For stack trace
  //     Toast.show({
  //       type: "error",
  //       text1: "Failed to write NFC tag. Please try again.",
  //     });
  //   } finally {
  //     NfcManager.cancelTechnologyRequest();
  //   }
  // };


  // ######################Bottom Sheet#######################

  console.log(
    ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    `${baseUrl}/${userData.self_photo}`
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView>
        <ThemedView style={styles.tapIconsContainer}>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            onPress={() =>
              router.push({
                pathname: "/(screens)/profilescreen",
                params: { userId: UserId },
              })
            }
          >
            <TabBarIcon
              library={Entypo}
              name="eye"
              color={Colors.numberColors.A_color}
              size={25}
            />
            <ThemedText
              style={{
                fontFamily: "RobotoMedium",
                color: Colors.numberColors.A_color,
              }}
            >
              Preview
            </ThemedText>
          </TouchableOpacity>

          <ThemedView style={styles.iconsContainer}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/EditProfile",
                  params: {
                    name: userData.name,
                    designation: userData.designation,
                    company: userData.company,
                    mobile: userData.mobile,
                    email: userData.email,
                    bio: userData.bio,
                    username: userData.username,
                    profile_Photo: userData.self_photo,
                    bgPhoto: userData.background_image,
                  },
                })
              }
            >
              <TabBarIcon
                library={Feather}
                name="edit"
                size={24}
                color={Colors.numberColors.A_color}
              />
            </TouchableOpacity>
            <TabBarIcon
              library={FontAwesome5}
              name="question-circle"
              size={24}
              color={Colors.numberColors.A_color}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView
          style={[
            styles.AccountDetailsContainer,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            },
          ]}
        >
          <Image
            style={styles.ProfileImage}
            source={
              userData && userData.self_photo
                ? { uri: `${baseUrl}/${userData.self_photo}` }
                : {uri: "https://avatar.iran.liara.run/public/boy"} 
            }
          />

          <ThemedText
            type="subtitle"
            lightColor="#000"
            style={{
              display: "flex",
              flex: 1,
              flexWrap: "wrap",
              paddingLeft: 10,
              fontFamily: "RobotoMedium",
              fontSize: 24,
              fontWeight: "bold"
            }}
          >
            {userData.name}
          </ThemedText>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <QRCode
              value={`tap-connect://tap.me/${UserId}`}
              size={50}
              backgroundColor="transparent"
              color={
                colorScheme === "dark" ? Colors.dark.icon : Colors.light.icon
              }
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.twoButtons}>
          <TouchableOpacity
            style={[
              styles.addLink,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? Colors.bgColors.Cornflower_Blue
                    : Colors.bgColors.Cornflower_Blue,
              },
            ]}
            onPress={() => router.push("/(screens)/NewLinkScreen")}
          >
            <TabBarIcon
              library={Fontisto}
              name="link2"
              size={15}
              color={"#fff"}
            />
            <ThemedText
              lightColor={Colors.dark.text}
              darkColor={Colors.dark.text}
              type="small"
              style={{fontFamily: 'RobotoMedium'}}
            >
              Add New Link
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addLink,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? Colors.dark.blue_Button
                    : Colors.numberColors.Link_Water,
              },
            ]}
            onPress={() => toggleBottomNavigationView()}
          >
            <TabBarIcon
              library={FontAwesome6}
              name="nfc-symbol"
              size={15}
              color={Colors.bgColors.Cornflower_Blue}
            />
            <ThemedText
              lightColor={Colors.bgColors.Cornflower_Blue}
              darkColor={Colors.bgColors.Cornflower_Blue}
              type="small"
              style={{fontFamily: 'RobotoMedium'}}
            >
              Activate Product
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView
          style={styles.linksContainer}
          lightColor={Colors.light.background}
          darkColor={Colors.dark.background}
        >
          
          {/* <ScrollView> */}
          <FlatList
            data={filteredSocialLinks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{height: '100%'}}
            horizontal={false}
            
          />
        </ThemedView>
      </ThemedView>
      {/* ################################# activate new product Bottom Sheet starts here################################ */}
      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}
        <View style={styles.bottomNavigationView}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              width: "95%",
              backgroundColor: "1C1C1E",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                padding: 20,
                fontSize: 20,
              }}
            >
              Choose an option
            </Text>
            <TouchableOpacity
              style={styles.bottomSheetButtons}
              onPress={writeTag}
            >
              <Text style={{ color: "#fff" }}>Activate NFC</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.bottomSheetButtons}
              onPress={() => router.navigate('/(screens)/activatenewproducts')}
            >
              <Text style={{ color: "#fff" }}>Activate NFC</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.bottomSheetButtons}
              onPress={toggleBottomNavigationView}
            >
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.bottomSheetButtons}>
                <Text style={{color:'#fff'}}>Option3</Text>
              </TouchableOpacity> */}
          </View>
        </View>
      </BottomSheet>

      {/* ############################# EDIT LINKS Bottom Sheet starts here################################ */}
      
      {/* ################################################################################################# */}
      <Modal
        visible={modalVisible}
        transparent={true} // Ensures the background is transparent
        animationType="fade" // Optional: Choose "slide", "fade", etc.
        onRequestClose={() => setModalVisible(false)} // Close modal when back button is pressed (Android)
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <QRCode
              value={`tap-connect://tap.me/${UserId}`}
              size={250}
              backgroundColor="transparent"
              color={
                colorScheme === "dark" ? Colors.dark.icon : Colors.light.icon
              }
            />
            {/* Close button */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  },
  tapIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  AccountDetailsContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    padding: 15,
    height: screenHeight * 0.15,
    borderRadius: 20,
    elevation: 7,
  },
  ProfileImage: {
    width: Platform.OS === "ios" ? screenWidth * 0.2 : screenWidth * 0.2,
    height: Platform.OS === "ios" ? screenHeight * 0.09 : screenHeight * 0.1,
    backgroundColor: "#DADCE0",
    borderRadius: 50,
  },
  NameAndProduct: {
    width: "100%",
    paddingLeft: 10,
    flexDirection: "row",
    gap: 30,
  },
  ProductsButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: Platform.OS === "ios" ? screenWidth * 0.35 : screenWidth * 0.3,
    height: screenHeight * 0.06,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  twoButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
  },
  addLink: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 15,
    gap: 5,
    width: screenWidth / 2 - 30,
    height: screenHeight * 0.06,
  },
  linksContainer: {
    // flex: 1,
    display: "flex",
    padding: 10,
    marginTop: 20,
    borderRadius: 30,
    elevation: 8,
    height: screenHeight * 0.65,
    paddingBottom: '20%',
  },
  bottomNavigationView: {
    // backgroundColor: "",
    // width: '100%',
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 25,
  },
  bottomSheetButtons: {
    justifyContent: "center",
    backgroundColor: "#000",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background overlay
  },
  modalContent: {
    width: 300,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
  },
  closeButtonText: {
    marginTop: 20,
    color: "blue",
    fontWeight: "bold",
  },
  EditBottomSheetView: {
    width: "100%",
    height: "50%",
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 15,
    borderBlockColor: "#c5c5c7",
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: screenWidth - 40,
    height: 54
  },
  updateButton: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 60,
    width: screenWidth - 40,
    // marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
