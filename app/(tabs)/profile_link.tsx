import ListItem from '@/components/ListItem'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React , { Children, useCallback, useRef } from 'react'
import { View, Text, Platform, StyleSheet, StatusBar, SafeAreaView, Dimensions, useColorScheme, TouchableOpacity, Alert } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import * as Linking from 'expo-linking'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { Share } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as SecureStore from 'expo-secure-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const profile_link = () => {
  const ColorScheme = useColorScheme();
  const iconColor = ColorScheme === 'dark' ? '#DADADA' : '#2E3A59';
  const [UserId, setUserId] = React.useState<any>() // Replace with actual user ID
  const qrCodeRef = useRef<any>();

  const getUserId = async () => {
    const userId = await SecureStore.getItemAsync("UserId") // Replace with actual user ID
    setUserId(userId)
  }

  useFocusEffect(useCallback(() => {
    getUserId()
  }, []))
  console.log(UserId)

  const UserLink = `tap-connect://tap.me/${UserId}`;

  
  // const MyProfileTouchableOpacity = ({ children }: any) => {
    const handleProfileShare = async () => {
      const UserLink = `tap-connect://tap.me/${UserId}`;
      try {
        // Use the Share API to share the profile link as text
        const result = await Share.share({
          message: `Check out my profile: ${UserLink}`,
        });
    
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(`Shared with activity type: ${result.activityType}`);
          } else {
            console.log('Profile link shared successfully');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed');
        }
      } catch (error) {
        console.log('Error sharing profile link:', error);
        Alert.alert('Error', 'Could not share profile link.');
      }
    };

    // return (
    //   <TouchableOpacity onPress={handleProfileShare}>
    //     {children}
    //   </TouchableOpacity>
    // );
  // }

  // const MyEmailTouchableOpacity = ({ url, children }:any) => {
    const handlePress = async (url:string) => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    };
  
  //   return (
  //     <TouchableOpacity onPress={handlePress}>
  //       {children}
  //     </TouchableOpacity>
  //   );
  // };

  // const MySmsTouchableOpacity = ({ children }: any) => {
    const handleProfileShareViaSMS = async () => {
      const message = `Check out my profile: ${UserLink}`;
      const url = `sms:?body=${encodeURIComponent(message)}`;
  
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'SMS app is not available.');
        }
      } catch (error:any) {
        Alert.alert('Error', `An error occurred: ${error.message}`);
      }
    };
  
  //   return (
  //     <TouchableOpacity onPress={handleProfileShareViaSMS}>
  //       {children}
  //     </TouchableOpacity>
  //   );
  // };

  // const MySaveQRcodeOpacity = ({children}:any) => {
    const handleSaveQRCode = async () => {
      console.log('Saving QR code...')
      try {
        // Get SVG data URL from QRCode component
        if (qrCodeRef.current) {
          qrCodeRef.current.toDataURL(async (dataURL: any) => {
            // Convert base64 data URL to binary format
            const fileUri = `${FileSystem.documentDirectory}QRCode.png`;
            // console.log('File URI:', qrCodeRef.current, fileUri, dataURL)
            await FileSystem.writeAsStringAsync(
              fileUri,
              dataURL.replace(/^data:image\/png;base64,/, ""),
              {
                encoding: FileSystem.EncodingType.Base64,
              }
            );

            // Share or save the file
            await Sharing.shareAsync(fileUri);
            Alert.alert(
              "Success",
              "QR Code saved to phone and ready to share."
            );
          });
        }
      } catch (error) {
        console.log("Error saving QR code:", error);
        Alert.alert("Error", "Could not save QR code.");
      }
    };

  //   return(
  //     <TouchableOpacity onPress={handleSaveQRCode}>
  //       {children}
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.subContainer}>
        <ThemedText style={styles.headingText} lightColor='#000' darkColor='#fff'>
          Share Profile
        </ThemedText>
        <ThemedView style={styles.imageContainer}> 
          <QRCode 
            value={`tap-connect://tap.me/${UserId}`}
            size={250}
            getRef={(c) => (qrCodeRef.current = c)} 
          />
        </ThemedView>
        <ThemedView style={styles.linkContainer}>
          <View style={styles.linkHolder}>
            <ThemedText type='defaultSemiBold' style={styles.linkText}>{UserId}</ThemedText>
          </View>                                                 
        </ThemedView>
        <ThemedView style={styles.listContainer}>
          {/* <MyProfileTouchableOpacity> */}
            <ListItem titletext='Share Profile Link' libName={Ionicons} iconName='share-social-outline' iconColor={iconColor} onClick={handleProfileShare}/>
          {/* </MyProfileTouchableOpacity> */}
          {/* <MyEmailTouchableOpacity url={`mailto:?subject=Check out my TapConnect profile&body=Check out my TapConnect profile: ${UserLink}`}> */}
            <ListItem titletext='Share Profile Link via Email' libName={Fontisto} iconName='email' iconColor={iconColor} onClick={() => handlePress(`mailto:?subject=Check out my TapConnect profile&body=Check out my TapConnect profile: ${UserLink}`)}/>
          {/* </MyEmailTouchableOpacity> */}
          {/* <MySmsTouchableOpacity> */}
            <ListItem titletext='Share Profile Link via SMS' libName={MaterialCommunityIcons} iconName='message-outline' iconColor={iconColor} onClick={handleProfileShareViaSMS}/>
          {/* </MySmsTouchableOpacity> */}
          {/* <MySaveQRcodeOpacity> */}
          <ListItem titletext='Save QR Code to Phone' libName={MaterialCommunityIcons} iconName='download' iconColor={iconColor} onClick={handleSaveQRCode}/>
          {/* </MySaveQRcodeOpacity> */}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  )
}

export default profile_link

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  },
  headingText: {
    fontSize: 36,
    paddingVertical: Platform.OS === "android" ? 15 : 20,
    fontWeight: 'medium',
    fontFamily: "RobotoMedium"
  },
  subContainer: {
    padding: 20
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  linkContainer: {
    display: 'flex', 
    alignItems: 'center', 
    marginTop: 20
  },
  linkHolder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: screenWidth * 0.9,
    height: screenHeight * 0.05,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#E89B4E',
  },
  linkText: {
    color: '#E89B4E'
  },
  listContainer: {
    marginTop: 30
  }
})