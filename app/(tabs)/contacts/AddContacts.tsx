import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { url } from "@/constants/Urls";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const AddContacts = () => {
  const [searchText, setSearchText] = useState("");
  const [isChecked, setIschecked] = useState<boolean>(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
 
  const contactId = useLocalSearchParams();
  const contacts = useSelector((state: any) => state.contacts.contacts);

  const handleCheckboxChange = (isChecked: boolean, contactId: string) => {
    // add contacts to a object so that it can be sent to another screen as seachparmameter
    if(isChecked) {
        setSelectedContacts((prev) => [...prev, contactId])
    } else {
        setSelectedContacts((prev) => prev.filter((id) => id !== contactId))
    }
  }

  const baseUrl = url.baseUrl;
  const handleAddContact = async () => {
    try { 
      const contactsList = selectedContacts.join(",").toString();
      const data =  {"users": contactsList}
      
      const config = {
        method: "put",
        maxBodyLength: Infinity, 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: `${baseUrl}/api/group/${contactId.Id}/add-users`,
        data: data
      };
      
      await axios.request(config).then((response) => {
        console.log("Add Contacts success");
        router.back();
      }).catch((error: any) => {
        console.log("Add Contacts Error", error.message)
      });
      
      // console.log("Add Contacts Response", response.data);
  
    } catch (error:any) {
      // Catch and log any errors that occur during the request
      console.error("Add Contacts Error", error.message);
    }
  };
  

  // console.log("CONTACTS from Add contacts>>>>>>>>>>>>", selectedContacts)
  const renderItem = ({ item }: any) => (
    <ThemedView style={styles.contactItem}>
      {/* <Ionicons name="person-circle-outline" size={40} color="gray" /> */}
      <Image source={item.self_photo !== "" ? { uri :`https://app.tapconnect.in/${item.self_photo}`} : { uri :`https://avatar.iran.liara.run/public/48`}} width={50} height={50} style={{borderRadius: 25}}/>
      <ThemedView style={styles.contactInfo}>
        <ThemedText style={styles.contactName}>{item.name}</ThemedText>
        <ThemedText style={styles.contactDesignation}>{item.designation}</ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.checkbox}>
        <BouncyCheckbox
          size={25}
          innerIconStyle={{ borderWidth: 2 }}
          style={{ borderRadius: 0, padding: 10 }}
          fillColor={Colors.bgColors.Cornflower_Blue}
          onPress={(isChecked: boolean) => handleCheckboxChange(isChecked, item._id)}
        />
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container} darkColor={Colors.dark.background} lightColor={Colors.light.background}>
      <ThemedText style={styles.header}>Add Contacts</ThemedText>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for contact"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.contactsList}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <ThemedText style={styles.addButtonText}>Add Contact to Group</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={router.back}>
        <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F4F5F7",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: "#E8EAF6",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  contactsList: {
    // backgroundColor: "#FFF",
    borderRadius: 10,
    // padding: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  contactInfo: {
    flex: 1,
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
  },
  contactDesignation: {
    fontSize: 14,
    color: "#757575",
  },
  checkbox: {
    padding: 5,
  },
  addButton: {
    backgroundColor: "#7B61FF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    padding: 15,
  },
  cancelButtonText: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddContacts;
