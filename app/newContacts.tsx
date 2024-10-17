import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
  useColorScheme,
} from "react-native";
// import { useContacts } from '@/ContactsContext';
import { ThemedView } from "@/components/ThemedView"; // Assuming you have Themed components
import { ThemedText } from "@/components/ThemedText"; // Assuming you have Themed components
import { Colors } from "@/constants/Colors";
import { useDispatch } from "react-redux";
import { addContact } from "@/store/Slice/contactsSlice";
import { router, useFocusEffect, useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { url } from "@/constants/Urls";
import axios from "axios";
import mime from 'mime';
import * as FileSystem from 'expo-file-system';
import Toast from "react-native-toast-message";
import * as SecureStore from 'expo-secure-store';

const newContacts = ({ navigation }: any) => {

  const info  = useLocalSearchParams();
  // console.log("info from newContacts", info)


  const [name, setName] = useState(info.name?.toString() ||"");
  const [designation, setDesignation] = useState(info.designation?.toString() ||"");
  const [company, setCompany] = useState(info.company?.toString() ||"");
  const [email, setEmail] = useState(info.email?.toString() ||"");
  const [phoneNumber, setPhoneNumber] = useState(info.phone?.toString() ||"");
  const [description, setDescription] = useState(info.bio?.toString() ||"");
  const [profileImage, setProfileImage] = useState(`https://app.tapconnect.in/${info.self_photo?.toString()}` ||'')
  
  const dispatch = useDispatch();
  
  const colorScheme = useColorScheme();

  const baseUrl = url.baseUrl;
  
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
      base64: true,
      aspect: [1, 1],
      // quality: 1,
    });

    if(result.canceled) {
      setProfileImage("https://avatar.iran.liara.run/public/48")
    }

    if (!result.canceled) {
      const data = {uri: 'data:image/jpeg;base64,' + result.assets[0].base64};
      setProfileImage(result.assets[0].uri);
      // console.log(result.assets[0].uri);
    }
  };


  const handleSave = async () => {
    console.log("handle save button clicked::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    try {
      const userId = await SecureStore.getItemAsync("UserId");
      const data = new FormData();
      data.append("name", name);
      data.append("designation", designation);
      data.append("company", company);
      data.append("email", email);
      data.append("mobile", phoneNumber);
      data.append("bio", description);

      if (!name || !description || !designation || !company || !email || !phoneNumber || !profileImage) {
        Toast.show({type: 'error', text1: 'Please fill all the fields'}); // Show error toast message
        return; // Exit the function early if any field is empty
      }
      
        // Add images correctly
      if (profileImage) {
        data.append('self_photo', {
          uri: profileImage === "https://app.tapconnect.in/undefined" ? "https://avatar.iran.liara.run/public/48" : profileImage, // Replace with the actual image URI or path
          type: 'image/jpeg', // Make sure this matches the image type
          name: 'profile.jpg', // Or dynamic file name
        } as any); // Type assertion to bypass TypeScript error
      }

      // console.log("Data to be sent:", data);
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/contact/${userId}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data,
      };
  
      console.log("NEW CONTACT DATA>>>>>>>>>>>>>>>", data)
      await axios.request(config).then((response) => {
        console.log("Response from server: was a success")
      router.back(); // Navigate back to the previous screen

      });
      // console.log(JSON.stringify(response.data));
    } catch (error:any) {
      console.error("Error during contact save:", error.toJSON());
      if (error.response) {
        console.log("Error response:", error.response.data.message);
      } else {
        console.log("Unknown error:", error.message);
      }
    }
  };

  console.log("profileImage--------------------------", profileImage)

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView>
      <ThemedText style={styles.headerText}>New Contact</ThemedText>
        <TouchableOpacity onPress={pickProfileImage} style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            // // {
            //   uri: avatar || "https://www.w3schools.com/howto/img_avatar.png",
            // }
            source={profileImage !== 'https://app.tapconnect.in/undefined' ? {uri : `${profileImage}`} : {uri: "https://avatar.iran.liara.run/public/48"}}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#c5c5c7'}
          value={name.toString()}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Designation"
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#c5c5c7'}
          value={designation}
          onChangeText={setDesignation}
        />
        <TextInput
          style={styles.input}
          placeholder="Company"
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#c5c5c7'}
          value={company.toString()}
          onChangeText={setCompany}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#c5c5c7'}
          value={email.toString()}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#c5c5c7'}
          value={phoneNumber.toString()}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#c5c5c7'}
          onChangeText={setDescription}
          multiline={true}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, {color: colorScheme === 'dark' ? '#fff' : '#000'}]}>Cancel</Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 55 : 30,
    paddingLeft: Platform.OS === 'ios' ? 20 : 20,
    paddingRight: Platform.OS === 'ios' ? 20 : 20
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'medium',
    marginBottom: 40,
    alignSelf: "flex-start",
    paddingVertical: 15,
    fontFamily: "RobotoMedium"
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 29,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: "#000",
    fontFamily: "RobotoRegular"
  },
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: Colors.numberColors.Edit_blue,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "RobotoMedium"
  },
  cancelButton: {
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'medium',
    fontFamily: "RobotoMedium"
  },
});

export default newContacts;
