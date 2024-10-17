import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { url } from "@/constants/Urls";
import Toast from "react-native-toast-message";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
// import auth from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "@/store/Slice/userSlice";
import * as SecureStore from 'expo-secure-store';


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SignUp = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState<any>();
  const [login, setLogin] = useState<boolean>(false)

  const colorScheme = useColorScheme();


  // ################# FIREBASE GOOGLE SIGNIN #################
  // const [error, setError] = useState();
  // const [userInfo, setUserInfo] = useState({});
  // ##########################################################

  // GCP ka Oauth function
  const signInAsync = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setIsSignedIn(true);
      handlePostGmailId(userInfo.user.email);
      await SecureStore.setItemAsync('email', userInfo.user.email)
      console.log("User Info from google signin>>", userInfo.user.email);
      setUserInfo(userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("Login cancelled");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // in-app browser not available, show fallback UI
        console.log("In-app browser not available");
      } else {
        console.log(error);
      }
    }
  };

  const handlePostGmailId = async (emailData: string) => {
    try {
      const fullurl = `${url.baseUrl}/api/login-email`;
      const data = { email: emailData };
      const config = {
        method: 'post',
        url: fullurl,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };
  
      const response = await axios.request(config);
      console.log("Response from login-email>>>>>>>>>>>>>>>>>>", response.data);
      dispatch(setUserData(response.data.data));
      await SecureStore.setItemAsync('UserId', response.data.data._id)
      await AsyncStorage.setItem('UserId', response.data.data._id)
      if(response.data.data.name === "") {
        router.push("/(screens)/EditProfile");
      } else {
        router.replace("/(tabs)")
      }
    } catch (error) {
      console.log("Error from login-email>>", error);
    }
  };
  

  const signOutAsync = async () => {
    try {
      await GoogleSignin.signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  const configureGoogleSignIn = async () => {
    GoogleSignin.configure({
      
      androidClientId:
        "152965494921-k9dvjp1m3n7btsheud130g7guruv8tm9.apps.googleusercontent.com",
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });


  // ################ OTP Verification ######################
  const [phone, setPhone] = useState<string>("");
  const [optclicked, setOptClicked] = useState<boolean>(false); //this is conditional rendering for the otp screen
  const [otp, setOtp] = useState("");

  const validatePhoneNumber = (): boolean => {
    // Add your phone number validation logic here
    return /^(\+?\d{1,4}[-.\s]?|\()?\d{1,4}(\))?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      phone
    );
  };

  const dispatch = useDispatch();
  const getAllData = async () => {
    try {
      const baseurl = `${url.baseUrl}/api/login`
      const data = { 
        mobile: phone 
      };

      // console.log("dataaaaaaaaaaaaaaaaaaaaa", data)
  
      const response = await axios.post(baseurl, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      const userid = response.data.data._id;
      await AsyncStorage.setItem("UserId", userId);// Store the user ID in AsyncStorage
      console.log("UserId", userid);
      console.log("?????????????????????????????", response.data.data.username)
      if(response.data.data.username === "") {
        router.push('/(tabs)')
      } else {
        router.push("/(screens)/EditProfile")
      }
  
      dispatch(setUserData(response.data.data)); // Dispatch the action to update the user data
      // console.log("Response data:", response.data);
    } catch (error:any) {
      console.error("Error occurred>>>>>>>>:", error.response ? error.response.data : error.message);
    }
  }
  const handleSendCode = async () => {
    // if (validatePhoneNumber()) {
    //   try {
    //     const result: any = await auth().signInWithPhoneNumber(phone)
    //       .then((result) => {
    //         console.log("The result is==", result)
    //         setOptClicked(true);
    //         setConfirmResult(result);
    //       })
    //       .catch((error) => {
    //         Toast.show({ type: 'error', text1: error.message });
    //         console.log(error);
    //       });
    //     console.log("The phone number is==", phone)
        

    //   } catch (error: any) {
    //     Toast.show({ type: 'error', text1: error.message });
    //     console.log(error);
    //   }
    // } else {
    //   Toast.show({ type: 'error', text1: "Invalid Phone Number" });
    // }

 
      if(validatePhoneNumber()){
        await SecureStore.setItemAsync('MobileNo', phone)
        try {
          const baseurl = `${url.baseUrl}/api/login`
          const data = { 
            mobile: phone 
          };
    
          console.log("dataaaaaaaaaaaaaaaaaaaaa", data)
      
          const response = await axios.post(baseurl, data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          });
          console.log("Response data:", response.data)
          const userid = response.data.data._id;
          await AsyncStorage.setItem("UserId", userid);
          await SecureStore.setItemAsync('UserId', userid)
          console.log("UserId", userid);
      
          dispatch(setUserData(response.data.data)); // Dispatch the action to update the user data
          setLogin(true)
          // console.log("Response data:", response.data);
        } catch (error:any) {
          console.error("Error occurred>>>>>>>>:", error.response ? error.response.data : error.message);
        } 
        setOptClicked(true)
      }
  };
  

  const handleConfirmOtp = async () => {
    const msgUrl = `https://app.tapconnect.in/api/verify-otp`
    const data = {
      mobile: phone,
      otp: otp
    }
    const config = {
      method: 'post',
      url: msgUrl,
      data: data
    }
    await axios.request(config).then((response) => {
      console.log("Handle Confirem OTP",response.data)
      if(response.data.user.name === "" || response.data.user.username === ""){
        router.navigate("/(screens)/EditProfile")
      } else {
        router.replace("/(tabs)")
      }
    })
  };

  // ################ secure store ##########################################
  useEffect(() => {
    const checkUserPhone = async () => {
      const MobileNo = await SecureStore.getItemAsync('MobileNo');
      const id = await SecureStore.getItemAsync('UserId')
      const email = await SecureStore.getItemAsync('email')
      console.log(MobileNo, id, email)
      if ((MobileNo && id) || (email && id)) {
        // router.push("/(tabs)")
        try {
          const baseurl = `${url.baseUrl}/api/user/${id}`
      
          await axios.get(baseurl).then((response) => {
            console.log("Response data>>>>>>>>>:", response.data)
            const userid = response.data._id;
            // AsyncStorage.setItem("UserId", id);
            SecureStore.setItemAsync('UserId', userId)
            console.log("UserId form Async storeeee>>>>>>>>>>>>>>", id);
            if(response.data.name !== "") {
              router.replace('/(tabs)')
            } else {
              router.push("/(screens)/EditProfile")
            }
        
            dispatch(setUserData(response.data));
          });
        } catch (error:any) {
          console.error("Error occurred>>>>///>>>>:", error.response ? error.response.data : error.message);
        }    
      } 
    };
    checkUserPhone();
    
  }, []);


  // #######################################################################
  return (
    <ThemedView
      style={styles.container}
      darkColor={Colors.dark.background}
      lightColor={Colors.light.background}
    >
      <Image source={require("@/assets/images/signUp_logo.png")} />
      {!optclicked ? (
        <>
          <TextInput
            style={[styles.inputStyles, {color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text}]}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            onChangeText={(text) => setPhone(text)}
            value={phone}
          />
          <TouchableOpacity
            style={styles.otpButton}
            onPress={() => {
              handleSendCode();
              // router.push('EditProfile')
            }}
          >
            <ThemedText lightColor="#fff" darkColor="#fff">
              Request OTP
            </ThemedText>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={[styles.inputStyles, {color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text}]}
            placeholder="Enter OTP"
            keyboardType="phone-pad"
            onChangeText={(text) => {
              if(!text) {
                Toast.show({ type: 'error', text1: "Please Enter OTP"})
              }
              setOtp(text)
            }}
            // value={otp}
          />
          <TouchableOpacity
            style={styles.otpButton}
            onPress={handleConfirmOtp}
          >
            <ThemedText lightColor="#fff" darkColor="#fff">
              Verify OTP
            </ThemedText>
          </TouchableOpacity>
        </>
      )}

      <ThemedView style={styles.divider}>
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
        onPress={signInAsync}
      >
        <Image source={require("@/assets/images/Google-Original.png")} />
        <ThemedText
          lightColor={Colors.numberColors.Blue}
          darkColor={Colors.numberColors.Blue}
        >
          Continue with Google
        </ThemedText>
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
      </TouchableOpacity>
      
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
    height: screenHeight * 0.07,
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
    height: screenHeight * 0.07,
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

export default SignUp;
