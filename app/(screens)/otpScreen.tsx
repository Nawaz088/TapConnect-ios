import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";

import { url } from "@/constants/Urls";
import Toast from "react-native-toast-message"

// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/store/Slice/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const otpScreen = () => {
//   const [isSignedIn, setIsSignedIn] = useState(false);

const [otp, setOtp] = useState('');
const route = useRoute();
const navigation = useNavigation();

// Extract confirmResult from route params
// const { confirmResult } = useLocalSearchParams();
const dispatch = useDispatch();
const confirmResult = useSelector((state:any) => state.auth.confirmResult);
const phone = useLocalSearchParams().phoneNo

const axiosPost = async (mobileNo: String) => {
  try {
    const baseurl = `${url.baseUrl}/api/login`
    const data = { 
      mobile: mobileNo 
    };

    // console.log("dataaaaaaaaaaaaaaaaaaaaa", data)

    const response = await axios.post(baseurl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    await SecureStore.setItemAsync("UserId", response.data.data._id); // Store the user ID in AsyncStorage
    console.log("UserId", response.data.data._id);
    if(response.data.data.username) {
      router.push('/(tabs)')
    } else {
      router.push("/(screens)/EditProfile")
    }

    dispatch(setUserData(response.data.data)); // Dispatch the action to update the user data
    // console.log("Response data:", response.data);
  } catch (error:any) {
    console.error("Error occurred>>>>>>>>:", error.response ? error.response.data : error.message);
  }
};
const handleConfirmOtp = async () => {
  if (otp.length !== 6) {
    Toast.show({type: 'error', text1: 'Invalid OTP', text2: 'Please enter a 6-digit OTP.'})
    return;
  }
    try {
      console.log("THe OTP is==", otp);
      await confirmResult.confirm(otp);
      Toast.show({type: 'info', text1:"OTP Verified Successfully"});
    } catch (error: any) {
      Toast.show({type: 'error', text1: error.message})
      // InfoToast({text1: error.message});
    }

};
  

//   const signInAsync = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       await GoogleSignin.signIn();
//       setIsSignedIn(true);
//     } catch (error: any) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//         console.log('Login cancelled');
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // in-app browser not available, show fallback UI
//         console.log('In-app browser not available');
//       } else {
//         console.log(error);
//       }
//     }
//   };

//   const signOutAsync = async () => {
//     try {
//       await GoogleSignin.signOut();
//       setIsSignedIn(false);
//     } catch (error) {
//       console.log('Error signing out: ', error);
//     }
//   };

//   const configureGoogleSignIn = async () => {
//     GoogleSignin.configure({
//         // androidClientId : '485882343571-gcn18p7a73mgq8ija8b2hcns41tu53oq.apps.googleusercontent.com'
//     })
//   }

//   useEffect(() => {
//     configureGoogleSignIn();
//   })

  return (
    <ThemedView
      style={styles.container}
      darkColor={Colors.dark.background}
      lightColor={Colors.light.background}
    >
      <Image source={require("@/assets/images/signUp_logo.png")} />
      <TextInput
        style={styles.inputStyles}
        placeholder="Enter OTP"
        keyboardType="phone-pad"
        onChangeText={(text) => setOtp(text)}
        value={otp}
      />
      <TouchableOpacity
        style={styles.otpButton}
        onPress={() => {
          handleConfirmOtp();
        }}
      >
        <ThemedText lightColor="#fff" darkColor="#fff">
          Verify OTP
        </ThemedText>
      </TouchableOpacity>
      {/* <ThemedView style={styles.divider}>
        <View style={styles.line} />
        <ThemedText
          style={{
            fontSize: 16,
            color: Colors.bgColors.border_color,
            padding: 10,
          }}
        >
          OR
        </ThemedText>
        <View style={styles.line} />
      </ThemedView>
      <TouchableOpacity
        style={[
          styles.otpButton,
          { backgroundColor: Colors.bgColors.Onahau, opacity: 0.7 },
        ]}
        // onPress={signInAsync}
      >
        <Image source={require("@/assets/images/Google-Original.png")} />
        <ThemedText
          lightColor={Colors.numberColors.Blue}
          darkColor={Colors.numberColors.Blue}
        >
          Continue with Google
        </ThemedText> */}
        {/* {isSignedIn ? 
        <Text>Welcome, {isSignedIn}!</Text> :
        <Text>Please sign in using your Google account</Text>
      }

      { !isSignedIn && <GoogleSigninButton
        style={{width: '100%', height: 60, marginBottom: 20}}
        onPress={signInAsync}
      /> }

      { isSignedIn && <GoogleSigninButton
        type="standard"
        size={23}
        color="dark"
        mode="contained"
        text="Logout"
        onPress={signOutAsync}
        style={{width: '100%', height: 60}}
      /> } */}
      {/* </TouchableOpacity> */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  inputStyles: {
    width: screenWidth - 40,
    height: screenHeight * 0.06,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.bgColors.border_color,
    padding: 10,
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
  divider: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: screenWidth * 0.6 - 80,
    height: 0,
    borderWidth: 1,
    borderColor: Colors.bgColors.border_color,
  },
});

export default otpScreen;
