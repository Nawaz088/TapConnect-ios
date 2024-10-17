import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/Slice/userSlice";
import * as SecureStore from 'expo-secure-store';


export default function AddLink({ route }: any) {
  const {link, icon, color}  = useLocalSearchParams(); // This will receive the selected social media link
  
  const [socialLink, setSocialLink] = useState("");
  const [socialLinkName, setSocialLinkName] = useState("");
  const [userLinks, setUserLinks] = useState<any>([]);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const handleSaveLink = async () => {
    // Handle saving the link and username to the user's profile
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
    const newLink = { platform: socialLinkName, url: socialLink, label: link };
    // Append the new link to the existing list
    const updatedLinks = [...existingLinks, newLink];
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
      console.log("This Response is from Add Link Screen",JSON.stringify(response.data));
      dispatch(setUserData(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

    navigation.goBack();
  };

  const validIcon = icon ? icon.toString() as keyof typeof Ionicons.glyphMap : "link";

  // COLOR SCHEME def
  const colorScheme = useColorScheme();
  
  const handlePlaceHolder = (type: string) => {
    if(link === "Email") {
      return "Enter your email address";
    } else if (link === "Phone") {
      return "Enter your phone number";
    } else {
      return "Link"
    }

  }

  const handleKeyBoardType = () => {
    if(link === "Email") {
      return "email-address"
    } else if (link === "Phone") {
      return "phone-pad"
    } else {
      return "default"
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView>
        <ThemedText
          darkColor={Colors.dark.text}
          lightColor={Colors.light.text}
          type="title"
          style={styles.headerText}
        >
          Add Link
        </ThemedText>
        <ThemedView style={styles.iconContainer}>
          <Ionicons name={validIcon} size={84} color={color?.toString()} />
        </ThemedView>
        <View style={[styles.inputContainer, {marginBottom: 12}]}>
          <TextInput
            style={[styles.textInput, {color: colorScheme === 'dark' ? '#fff' : '#000'}]}
            placeholder={link?.toString()}
            value={socialLinkName}
            onChangeText={setSocialLinkName}
            placeholderTextColor={"#c5c5c7"}
          />
          <Ionicons
            name="close-circle-outline"
            size={20}
            color="#888"
            style={styles.clearIcon}
            onPress={() => setSocialLinkName("")}
          />
        </View>
        <View style={[styles.inputContainer, {marginBottom: 43} ]}>
          <TextInput
            style={[styles.textInput, {color: colorScheme === 'dark' ? '#fff' : '#000'}]}
            placeholder= {handlePlaceHolder(link as any)}
            keyboardType= {handleKeyBoardType()}
            placeholderTextColor={"#c5c5c7"}
            value={socialLink}
            onChangeText={setSocialLink}
          />
        </View>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: Colors.bgColors.Cornflower_Blue, elevation: 3 },
            ]}
            onPress={handleSaveLink}
          >
            <Text style={styles.saveButtonText}>Save Link</Text>
          </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.saveButton}
        >
          <Text style={[styles.cancelText, {color: colorScheme === 'dark' ? '#fff' : '#000'}]}>Cancel</Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "medium",
    marginBottom: 43,
    paddingVertical: 5,
    fontFamily: 'RobotoMedium'
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 43
  },
  iconImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
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
    width: "100%",
    height: 54
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'RobotoRegular'
  },
  clearIcon: {
    marginLeft: 10,
  },
  linkInput: {
    marginBottom: 20,
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    height: 10,
  },
  saveButton: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: 'medium',
    fontFamily: 'RobotoMedium'
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'medium',
    fontFamily: 'RobotoMedium'
  },
});
