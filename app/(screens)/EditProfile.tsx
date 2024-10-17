import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { url } from "@/constants/Urls";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/store/Slice/userSlice";
import Toast from "react-native-toast-message";
import * as SecureStore from 'expo-secure-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const baseUrl = url.baseUrl;

const EditProfile = () => {
  const previosUserData = useLocalSearchParams()
  const baseUrl = url.baseUrl
  console.log("previosUserData>>>>>>>>>>>>>>>>..", previosUserData)
  const [backgroundImage, setBackgroundImage] = useState(`${baseUrl}/${previosUserData.bgPhoto?.toString()}` || '');
  const [profileImage, setProfileImage] = useState(`${baseUrl}/${previosUserData.profile_Photo?.toString()} `||'');
  console.log("profileImage>>>>>>>>>>>>>>>>..", profileImage)
  console.log("profileImage>>>>>>>>>>>>>>>>..", backgroundImage)

  const [formdata, setFormdata] = useState({
    name: previosUserData.name?.toString() || "",
    designation: previosUserData.designation?.toString() || "",
    company: previosUserData.company?.toString() || "",
    bio:previosUserData.bio?.toString() || "",
    email: previosUserData.email?.toString() || "",
    phone: previosUserData ? previosUserData.mobile?.toString() : "",
    username: previosUserData.username?.toString() || "",
  });

  const colorScheme = useColorScheme();
  const dispatch = useDispatch()

  
  const handleInputChange = (name: string, value: string) => {
    setFormdata({ ...formdata, [name]: value });
  }
  
  // const pickBgImage = async () => {
  //   // Request permission to access the image library
  //   const permissionResult =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (!permissionResult.granted) {
  //     alert("Permission to access the image library is required!");
  //     return;
  //   }

  //   // Let the user pick an image
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     // base64: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   // Handle case where user cancels the image picking
  //   if (result.canceled) {
  //     console.log("Image picking was canceled");
  //     return;
  //   }

  //   if (!result.canceled) {
  //     const data = {uri: 'data:image/jpeg;base64,' + result.assets[0].base64};
  //     // console.log("Image data data", data.uri)
  //     // setBackgroundImage(result.assets[0].uri);
  //     setBackgroundImage(result.assets[0].uri)
  //   }
  // };

  const pickBgImage = async () => {
    try {
      // Request permission to access the image library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (!permissionResult.granted) {
        alert("Permission to access the image library is required!");
        return;
      }
  
      // Let the user pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      // Handle case where user cancels the image picking
      if (result.canceled) {
        console.log("Image picking was canceled");
        return;
      }
  
      // Proceed if an image was selected
      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const base64Data = result.assets[0].base64 ? 'data:image/jpeg;base64,' + result.assets[0].base64 : null;
  
        console.log("Image URI:", imageUri);
        if (base64Data) {
          console.log("Base64 Image Data:", base64Data);
        }
  
        // Set the background image using the selected image URI
        setBackgroundImage(imageUri);
      } else {
        console.log("No valid image data found");
      }
  
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error picking image:", error);
      alert("An error occurred while picking the image. Please try again.");
    }
  };
  

  const pickProfileImage = async () => {
    // Request permission to access the image library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access the image library is required!");
      return;
    }

    // Let the user pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const data = {uri: 'data:image/jpeg;base64,' + result.assets[0].base64};
      setProfileImage(result.assets[0].uri)
    }
  };

  


  const handleSave = async () => {
    try {
      // this is the working code if we didn't send files
      if(formdata.name==="" || formdata.designation==="" || formdata.company==="" || formdata.bio==="" || formdata.email==="" || formdata.phone==="" || profileImage === '' || backgroundImage === ''){
        Toast.show({type: 'error', text1: 'Please fill all the fields'})
        return
      }
      const Data = new FormData();
      Data.append('name', formdata.name);
      Data.append('designation', formdata.designation);
      Data.append('company', formdata.company);
      Data.append('bio', formdata.bio);
      Data.append('email', formdata.email);
      Data.append('mobile', formdata.phone);
      Data.append('username', 'name');
      
      // Data.append('self_photo', profileImage)
      // Data.append('background_image', backgroundImage)
      console.log("Profile Image_____________________________", profileImage)
      // Add images correctly
    if (profileImage) {
      Data.append('self_photo', {
        uri: profileImage,
        type: 'image/jpeg', // Make sure this matches the image type
        name: 'profile.jpg', // Or dynamic file name
      } as any); // Type assertion to bypass TypeScript error
    }

    if (backgroundImage) {
      Data.append('background_image', {
        uri: backgroundImage,
        type: 'image/jpeg', // Make sure this matches the image type
        name: 'background.jpg', // Or dynamic file name
      } as any); // Type assertion to bypass TypeScript error
    }
    
  
      const userId = await SecureStore.getItemAsync("UserId");
      const url = baseUrl + "/api/user/" + userId;
      console.log("URLLL..........",url)
      
      const config = {
        method: 'put',
        url: url,
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
        data: Data,
        timeout: 10000, // Set the timeout to 10 seconds
      };
  
      const response = await axios.request(config).then((response) => {
        console.log("Edit profile response Done")
        dispatch(setUserData(response.data))
      if(response) {
        router.push("/(tabs)")
      }
      }).catch((error) => {
        console.error('Axios error:', error.message);
        console.error('Axios error config:', error.config);
        Toast.show({type: 'error', text1: 'Image Too Big', text2: 'Please choose another Image'})
      });
    } catch (error:any) {
      console.log("ERRRRRROOOOOOOOR", error.message);
    }
  };
  
  console.log("Profile Image", profileImage, profileImage === "https://app.Tapconnect.in/")
  
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => pickBgImage()} style={styles.BgImageContainer}>
        <ImageBackground
          source={(backgroundImage.split(" ")[0] !== "https://app.Tapconnect.in/" && backgroundImage.split(" ")[0] !== "https://app.Tapconnect.in/undefined") ? { uri: backgroundImage } : {uri: 'https://avatar.iran.liara.run/public/boy'}}
          style={styles.backgroundImage}
        >
          <TouchableOpacity style={styles.profilePictureContainer} onPress={() => pickProfileImage()}>
            <Image
              source={(profileImage.split(" ")[0] !== "https://app.Tapconnect.in/" && profileImage.split(" ")[0] !== "https://app.Tapconnect.in/undefined") ?  {uri: profileImage} : { uri: 'https://avatar.iran.liara.run/public/boy' }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={[styles.input, {color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
          placeholder="Name"
          value={formdata.name}
          onChangeText={(value) => handleInputChange("name", value)}
        />
        <TextInput
          style={[styles.input, {color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
          placeholder="Designation"
          value={formdata.designation} 
          onChangeText={(value) => handleInputChange("designation", value)}
        />
        <TextInput
          style={[styles.input, {color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
          placeholder="Company"
          value={formdata.company}
          onChangeText={(value) => handleInputChange("company", value)}
        />
        <TextInput
          style={[styles.input, styles.textArea, {color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
          placeholder="Bio"
          value={formdata.bio}
          onChangeText={(value) => handleInputChange("bio", value)}
          multiline
        />
        <TextInput
          style={[styles.input, {color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
          placeholder="Email"
          value={formdata.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <TextInput
          style={[styles.input, {color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
          placeholder={"Phone No."}
          value={formdata.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
        />
        {/*<TextInput
          style={[styles.input, {color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
          placeholder="Username"
          value={formdata.username}
          onChangeText={(value) => handleInputChange("username", value)}
        />*/}
        <TouchableOpacity onPress={handleSave} style={[styles.button, {backgroundColor: Colors.bgColors.Cornflower_Blue}]}>
          <ThemedText style={{fontFamily: 'RobotoMedium',  fontSize: 14, color: "#fff"}}>Save</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button]} onPress={() => router.push("/(tabs)")}>
          <ThemedText darkColor="#fff" lightColor="#000" style={{fontFamily: 'RobotoMedium',  fontSize: 14}}>Cancel</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  BgImageContainer: {
    width: screenWidth,
    height: screenHeight * 0.3,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'red'
  },
  profilePictureContainer: {
    position: "absolute",
    bottom: -50,
    alignItems: "flex-start",
    width: screenWidth,
    paddingLeft: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontFamily: 'RobotoRegular',
  },
  button: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textArea: {
    height: 100,
  },
});

