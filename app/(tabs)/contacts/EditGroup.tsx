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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "@/constants/Urls";
import axios from "axios";
// import qs from 'qs'

const { height: screenHeight, width: screenWidth } = Dimensions.get("window")
export default function EditGroup({ route }: any) {
  const grpname = useLocalSearchParams();

  const {link, icon, color}  = useLocalSearchParams(); // This will receive the selected social media link
  const [groupname, setGroupname] = useState(grpname.name?.toString() || "");
  const [groupDescription, setGroupDescription] = useState(grpname.desc?.toString() ||"");
  const navigation = useNavigation();

  
    // Handle saving the link and username to the user's profile
    const baseUrl = url.baseUrl

  // COLOR SCHEME def
  const colorScheme = useColorScheme();

  const groupId = grpname.Id;
  const handleSaveGroup = async () => {
    const userId = await AsyncStorage.getItem('UserId');

    try {
      const data = {
        'name': groupname,
        'description': groupDescription,
      }

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/group/${groupId}`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      }

      await axios.request(config).then((response) => {
        console.log("response from Edit Group",JSON.stringify(response.data));
        router.navigate("/(tabs)/contacts")
      })
      
    } catch (error) {
      console.error('Error saving group:', error)
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
          Edit Group
        </ThemedText>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, {color: colorScheme === 'dark' ? '#fff' : '#000'}]}
            placeholder={'Name'}
            placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
            value={groupname}
            onChangeText={setGroupname}
          />
          <Ionicons
            name="close-circle-outline"
            size={20}
            color="#888"
            style={styles.clearIcon}
            onPress={() => setGroupname("")}
          />
        </View>
        <View style={[styles.inputContainer, {height: screenHeight * 0.2}]}>
          <TextInput
            style={[styles.textInput, {color: colorScheme === 'dark' ? '#fff' : '#000'}]}
            placeholder="Description"
            placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
            multiline={true}
            textAlignVertical="top"
            value={groupDescription}
            onChangeText={setGroupDescription}
          />
        </View>
        <View style={styles.saveButtonContainer}>
            <TouchableOpacity
            style={[
                styles.saveButton,
                { backgroundColor: Colors.bgColors.Cornflower_Blue },
            ]}
              onPress={handleSaveGroup}
            >
            <Text style={styles.saveButtonText}>Save Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.saveButton}
            >
            <Text style={[styles.cancelText, {color: colorScheme === 'dark' ? '#fff' : '#000'}]}>Cancel</Text>
            </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    paddingTop: Platform.OS === "android" ? 10 : 30,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "medium",
    marginBottom: 55,
    fontFamily: "RobotoMedium",
    paddingVertical: Platform.OS === "android" ? StatusBar.currentHeight : 11
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
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
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    width: "100%",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    marginBottom: 12,
    fontFamily: "RobotoRegular"
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
    fontFamily: "RobotoMedium"
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'medium',
    fontFamily: "RobotoMedium"
  },
  saveButtonContainer: {
    flexDirection: "column",
    marginVertical: screenHeight * 0.1,
  }
})
