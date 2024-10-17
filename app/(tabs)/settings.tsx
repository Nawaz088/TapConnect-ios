import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, Image } from "react-native";
import ListItem from "@/components/ListItem";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
  Fontisto,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { url } from "@/constants/Urls";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import nfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { setProductCount } from "@/store/Slice/analyticsSlice";
import Toast from "react-native-toast-message";
import { BottomSheet } from "react-native-btr";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const settings = () => {
  const userData = useSelector((state:any) => state.user.data)
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [visible, setVisible] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };



  console.log("userData: ", userData)
  const baseUrl = url.baseUrl;
  const signOutAsync = async () => {
    try {
      await GoogleSignin.signOut();
      setIsSignedIn(false);
      // router.push({ pathname: '/(screens)'})
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  const handleLogOut = async () => {
    console.log("Logout")
    await SecureStore.deleteItemAsync("MobileNo");
    await SecureStore.deleteItemAsync('email')
    await AsyncStorage.removeItem('UserId')
    await SecureStore.deleteItemAsync('UserId')
    signOutAsync();
    router.push('/(screens)')
  }

  const dispatch = useDispatch();
  const writeTag = async () => {
    const userId = await SecureStore.getItemAsync("UserId")
    try {
      await nfcManager.requestTechnology(NfcTech.Ndef);
      const url = `tap-connect://tap.me/${userId}`;
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
      await nfcManager.ndefHandler.writeNdefMessage(bytes);
      dispatch(setProductCount(1))
      Toast.show({type: 'success', text1: 'URL written to NFC tag successfully!'})
    //   await NfcManager.setAlertMessageIOS('URL written successfully!');
    } catch (ex) {
      console.log('Error writing NFC tag:', ex);
      Toast.show({type: 'error', text1: 'Failed to write NFC tag. Please try again.'})
    } finally {
      nfcManager.cancelTechnologyRequest();
    }
  };

  

  // const productCount = useSelector((state: any) => state.analyticsData.productCount) || 0;
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView>
        <ThemedText style={styles.headingText} darkColor="#FFFFFF">
          Settings
        </ThemedText>
        <ThemedView style={styles.SettingsContentRapper}>
          <ThemedView style={styles.AccountDetailsContainer}>
            <Image
              style={styles.ProfileImage}
              source={
                userData.self_photo !== ""
                  ? { uri: `${baseUrl}/${userData.self_photo}` }
                  : {uri: "https://avatar.iran.liara.run/public/48"}
              }
            />
            <ThemedView style={styles.NameAndProduct}>
              <ThemedText
                lightColor="#fff"
                style={{
                  marginBottom: 12,
                  // paddingTop: 10,
                  flexWrap: "wrap",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#F6F6F6",
                  fontFamily: "RobotoMedium",
                }}
              >
                {userData.name}
              </ThemedText>
              <TouchableOpacity style={styles.ProductsButton}>
                <ThemedText lightColor="#fff" type="defaultSemiBold">
                  {" "}
                  {0} Products
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          {/* <Text>List View</Text> */}
          <ListItem
            titletext="Shop New Product"
            backgroundColor={Colors.bgColors.Amour}
            libName={Feather}
            iconName="shopping-cart"
            iconColor={Colors.numberColors.Froly}
            onClick={() => router.navigate("https://tapconnect.in")}
          />
          <ListItem
            titletext="Activate New Product"
            backgroundColor={Colors.bgColors.Black_squeez}
            iconName="nfc-symbol"
            libName={FontAwesome6}
            iconColor={Colors.numberColors.Fountain_Blue}
            onClick={toggleBottomNavigationView}
          />
          <ListItem
            titletext="My Products"
            backgroundColor={Colors.bgColors.Provincial_Pink}
            libName={Feather}
            iconName="credit-card"
            iconColor={Colors.numberColors.Tulip_Tree}
          />
          <ListItem
            titletext="Account Information"
            backgroundColor={Colors.light.background}
            libName={Ionicons}
            iconName="information-circle-outline"
            iconColor={Colors.numberColors.Figma_black}
            onClick={() =>
              router.push({
                pathname: "/(screens)/profilescreen",
                params: { userId: userData._id },
              })
            }
          />
          <ListItem
            titletext="Edit Profile"
            backgroundColor={Colors.light.background}
            libName={Feather}
            iconName="edit"
            iconColor={Colors.numberColors.Figma_black}
            onClick={() =>
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
                  bgPhoto: userData.background_image
                },
              })
            }
          />
          <ListItem
            titletext="Log Out"
            backgroundColor={"#FFCCCC"}
            libName={MaterialIcons}
            iconName="logout"
            iconColor="#BE1E2F"
            onClick={handleLogOut}
          />
          {/* <ListItem titletext="Dark Mode" libName={MaterialCommunityIcons} iconName="email-outline" needSwitch={true} /> */}
        </ThemedView>
      </ThemedView>
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
              width: '95%',
              backgroundColor: '1C1C1E',
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
            <TouchableOpacity style={styles.bottomSheetButtons} onPress={() => writeTag()}>
                <Text style={{color:'#fff'}}>Activate NFC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomSheetButtons} onPress={toggleBottomNavigationView} >
                <Text style={{color:'red'}}>Cancel</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.bottomSheetButtons}>
                <Text style={{color:'#fff'}}>Option3</Text>
              </TouchableOpacity> */}
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  },
  headingText: {
    fontSize: 36,
    paddingVertical: Platform.OS === "android" ? 14 : 20,
    // paddingTop: 15,
    // backgroundColor:'red',
    fontWeight: 'medium',
    fontFamily: "RobotoMedium"
  },
  AccountDetailsContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 34,
    padding: 25,
    height: screenHeight * 0.2,
    backgroundColor: "#8275FE",
    borderRadius: 20,
    marginBottom: 12,
  },
  SettingsContentRapper: {
    display: "flex",
    justifyContent: "center",
  },
  ProfileImage: {
    width: Platform.OS === "ios" ? screenWidth * 0.25 : screenWidth * 0.2,
    height: Platform.OS === "ios" ? screenHeight * 0.111 : screenHeight * 0.1,
    backgroundColor: "#DADCE0",
    borderRadius: 50,
  },
  NameAndProduct: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: "100%",
    padding: Platform.OS === 'android' ? 30 : 15,
  },
  ProductsButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: Platform.OS === "ios" ? screenWidth * 0.35 : screenWidth * 0.3,
    height: screenHeight * 0.04,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 30
  },
  otpButton: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    width: screenWidth - 40,
    height: screenHeight * 0.06,
    backgroundColor: Colors.bgColors.Cornflower_Blue,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
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
});
