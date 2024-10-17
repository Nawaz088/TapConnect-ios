import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { url } from "@/constants/Urls";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  PermissionsAndroid,
  Alert,
  Linking,
} from "react-native";
import Toast from "react-native-toast-message";
import { socialLinks } from "@/constants/SocialIcons";
import * as SecureStore from 'expo-secure-store';
// import { useSelector } from "react-redux";
// import Icon from 'react-native-vector-icons/Ionicons'; // Assuming Ionicons for example

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const profilescreen = () => {
  // const userData = useSelector((state:any) => state.user.otherData)
  const id  = useLocalSearchParams();
  const UserID = id.userId;
  const targetId = SecureStore.getItem("UserId");
  
  const [userData, setUserData] = useState<any>(null);
  const baseurl = url.baseUrl;

  const handleViewprofile = async () => {
    console.log("this is the user id", UserID)
    const data = {
      "viewer": UserID,
      "link": "profile",
      "value": 'some Value'
    }
    if(targetId === UserID) {
      return;
    }
    console.log("this is the data for view profile", data);
    console.log("this is the url for preview", `${baseurl}/api/track/${UserID}`)
    await axios.post(`${baseurl}/api/track`, data).then((response) => {
      console.log("response came innnnnnn")
    }).catch((error) => {
      console.log("error came", error)
    })
  }

  const getUserData = async () => {
    try {
      const config = {
        url: `${baseurl}/api/user/${UserID}`,
        method: "get"
      }

      await axios(config).then((response) => {
        if(response.data === null) {
          router.back()
          return Alert.alert("User not found")
        } else {
          setUserData(response.data)
        }
        // console.log("resopnse came success!!!!!!!!!!!!!!", response.data);
      }).catch((error) => {
        console.log("error came", error)
      })
    } catch (error) {
      console.log("this error came from catch", error)
    }
  }

  useEffect(() => {
    getUserData();
    handleViewprofile();
  }, []);
  
  if (!userData) {
    return <Text>Loading...</Text>;
  }

  if(userData.name === '' || userData.self_photo === "" || userData.background_image === ""){
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{fontFamily: 'RobotoMedium', fontWeight: 'bold', fontSize: 18, color: 'red'}}>Profile not complete</Text>
        <Text style={{fontFamily: 'RobotoMedium', fontSize: 12, color: 'red'}}>Go back and add your details</Text>
      </SafeAreaView>
  );
  }

  // const socialLinks = [
  //   { id: "1", icon: "logo-whatsapp", label: "whatsapp", value: userData.whatsapp },
  //   { id: "2", icon: "logo-instagram", label: "instagram",value: userData.instagram  },
  //   { id: "3", icon: "logo-facebook", label: "facebook", value: userData.facebook  },
  //   { id: "4", icon: "logo-twitter", label: "twitter", value: userData.twitter  },
  //   { id: "5", icon: "mail", label: "message", value: userData.message  },
  //   { id: "6", icon: "logo-tiktok", label: "tiktok", value: userData.tiktok  },
  //   // { id: "6", icon: "logo-snapchat", label: "Designation", value: userData.snapchat  },
  //   // { id: "6", icon: "logo-pinterest", label: "Designation", value: userData.pinterest  },
  //   // { id: "6", icon: "logo-reddit", label: "Designation", value: userData.reddit  },
  // ];

  const socialMediaColors:any = {
    'logo-facebook': '#4267B2',
    'logo-instagram': '#E1306C',
    'logo-twitter': '#1DA1F2',
    'logo-linkedin': '#2867B2',
    'logo-youtube': '#FF0000',
    'logo-tiktok': '#69C9FF',
    'logo-snapchat': '#FFFC00',
    'logo-pinterest': '#E60023',
    'logo-reddit': '#FF4500',
    'logo-whatsapp': '#25D366',
    'logo-discord': '#7289DA',
    'logo-twitch': '#9146FF',
    'logo-github': '#333333',
    'logo-medium': '#00AB6C',
    'logo-spotify': '#1DB954',
    'logo-apple-music': '#FF3B30',
    'logo-soundcloud': '#FF5500',
    'logo-vimeo': '#1AB7EA',
    'logo-flickr': '#FF0084',
    'logo-tumblr': '#34526F',
    'globe-outline': '#1d1d1d', // Default color for unknown platforms
    "call-outline": "#25D366", // Green for Phone
    "mail-outline": "#0078D4", // Blue for Email
  };
  // Filter out empty values
  const filteredSocialLinks = userData.links;

  const handleOpenLink = (platform: string, link: string) => {
    if (platform === "Phone") {
      Linking.openURL(`tel:${link}`)
    } else if(platform === "Email") {
      Linking.openURL(`mailto:${link}`)
    } else {
      Linking.openURL(link)
    }
  }
  const handleSocialIconClick = async (iconsName: string, iconValue: string) => {
    const data = {
      "viewer": id.userId,
      "link": iconsName,
      "value": iconValue
    }

    if(targetId === UserID) {
      return;
    }
    await axios.post(`${baseurl}/api/track`, data).then((response) => {
      console.log("response came innnnnnn", iconsName, iconValue)
      handleOpenLink(iconsName, iconValue)
    }).catch((error) => {
      console.log("error came", error)
      Toast.show({type: 'error', text1: 'Please add valid link'})
    })
  }

  const handleConnectClick = async () => {

    console.log("targetId", targetId, "viewer", id.userId)

    const data = {
      "targetID": id.userId,
      "saveID": targetId
    }
    console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data)
    const config = {
      url: `${baseurl}/api/new-connect`,
      method: "post",
      data: data
    }

    await axios.request(config).then((response) => {
      console.log("response came innnnnnn for connect")
    }).catch((error) => {
      console.log("error came", error)
    })
  }

  const handleExtractSocialPlatfroms = (label: string) => {
    if(label === "Phone") return "call-outline"
    if (label === "Email") return "mail-outline"
    const socialMatch = socialLinks.find((social) => social.name === label)
    return socialMatch ? socialMatch.icon : "link-outline"
  }
  const renderSocialIcon = ({ item }: any) => (
    <TouchableOpacity style={[styles.iconContainer]} onPress={() => handleSocialIconClick(item.label, item.url)} >
      <Ionicons name={handleExtractSocialPlatfroms(item.label) as any} size={40} color="#fff" style={[styles.icon, {backgroundColor: socialMediaColors[handleExtractSocialPlatfroms(item.label) as any]}]} />
      <ThemedText style={styles.iconLabel}>{item.platform}</ThemedText>
    </TouchableOpacity>
  );

  // interface Contact {
  //   [Contacts.Fields.FirstName]: string;
  //   [Contacts.Fields.LastName]: string;
  //   [Contacts.Fields.PhoneNumbers]: { number: string; label: string }[];
  //   [Contacts.Fields.Emails]: { email: string; label: string }[];
  // }
  
  

//   const handleSaveContact = async () => {
//     const { status } = await Contacts.requestPermissionsAsync();
//     if (status === 'granted') {
//       const contact = {
//         [Contacts.Fields.ContactType]: Contacts.ContactTypes.Person,
//         [Contacts.Fields.Name]: `${userData.name}`,
//         [Contacts.Fields.JobTitle]: userData.designation,
//         [Contacts.Fields.Company]: userData.company,
//         [Contacts.Fields.PhoneNumbers]: [
//           {
//             label: 'mobile',
//             number: userData.mobile,
//             isPrimary: true,
//             digits: "1234567890"
//           },
//         ],
//         [Contacts.Fields.Image]: { uri: userData.self_photo },
//       };
//       const contactId = await Contacts.addContactAsync(contact);
//       console.log('Contact saved successfully!', contactId)
//       if(contactId) {
//         console.log('Contact saved successfully!')
//       } else {
//         console.log('Failed to save contact.')
//       }
//     } else {
//       console.log('Permission to access contacts denied.');
//     }

// };

  const requestContactPermissions = async () => {
    try {
      handleConnectClick();
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contact Permission',
          message: 'App needs access to your contacts.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Contact permission granted!');
        // handleSaveContact();
      } else {
        console.log('Contact permission denied!');
        Alert.alert(
          'Permission Denied',
          'App needs contact permission to function properly. Please grant permission in settings.',
          [
            {
              text: 'Go to Settings',
              onPress: () => Linking.openSettings(),
            },
            { text: 'Cancel' },
          ]
        );
      }
    } catch (err) {
      console.error('Error requesting contact permission:', err);
    }
  };

  return (
    <>
      <ThemedView style={styles.BgImageContainer}>
        <ImageBackground
          source={
            userData && userData.background_image
              ? { uri: `${baseurl}/${userData.background_image}` }
              : {
                  uri: require('@/assets/images/background_placeHolder.png'),
                }
          }
          style={styles.backgroundImage}
        >
          <TouchableOpacity style={styles.profilePictureContainer}>
            <Image
              source={
                userData && userData.self_photo
                  ? { uri: `${baseurl}/${userData.self_photo}` }
                  : {
                      uri: require('@/assets/images/avatar1.jpg'),
                    }
              }
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        </ImageBackground>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedView
          style={{ flexDirection: "column", marginTop: 40, padding: 10}}
        >
          <ThemedText style={{fontFamily: 'RobotoMedium', fontSize: 36, paddingTop: 20}}>{userData ? userData.name : "no name recived"}</ThemedText>
          <ThemedText style={{fontFamily: 'RobotoMedium', fontSize: 14, color: Colors.numberColors.Yellow}}>{userData ? userData.designation: "no designation recived"}</ThemedText>
          <ThemedText style={{fontFamily: 'RobotoLight', fontSize: 16, color: '#aaa'}}>{userData ? userData.bio: 'no bio'}</ThemedText>
        </ThemedView>

        {/* Connect Button */}
        <TouchableOpacity style={styles.connectButton} onPress={requestContactPermissions}>
          <ThemedText style={{fontFamily: 'RobotoMedium', fontSize: 14, color: "#fff"}}>+ Connect</ThemedText>
        </TouchableOpacity>
        {/* Social Icons Section */}
        <ThemedView
          style={styles.linksContainer}
          lightColor={Colors.light.background}
          darkColor={Colors.dark.background}
        >
          {filteredSocialLinks.length > 0 ? (
            <TouchableOpacity onPress={() => {filteredSocialLinks}}>
            <FlatList
            data={filteredSocialLinks}
            renderItem={renderSocialIcon}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.socialLinksContainer}
          />
          </TouchableOpacity>
          ) : (
            <ThemedText></ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  BgImageContainer: {
    width: screenWidth,
    height: screenHeight * 0.3,
    paddingBottom: 20,
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
  profileContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileBackground: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 10,
    marginTop: -50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  designation: {
    fontSize: 16,
    color: "#ff9500",
    textAlign: "center",
    marginVertical: 5,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialLinksContainer: {
    // paddingHorizontal: 10,
    // paddingBottom: 10,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 20
  },
  icon: {
    // backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
  },
  iconLabel: {
    fontFamily: 'RobotoMedium',
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  linksContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
});

export default profilescreen;
