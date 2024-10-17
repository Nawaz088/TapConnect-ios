import { useState, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import axios from 'axios';
import { ThemedText } from '../components/ThemedText';
import { TabBarIcon } from '../components/navigation/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/ThemedView';
import { router } from 'expo-router';


enum CameraType {
  Front = 'front',
  Back = 'back',
}

const { width: screenHeight, height: screenWidth } = Dimensions.get('window');
export default function BusinessCardReader() {
  const [facing, setFacing] = useState(CameraType.Back);
  const [extractedInfo, setExtractedInfo] = useState<{ name: string; phone: string; email: string; website: string }>({ name: '', phone: '', email: '', website: '' });
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
  });


  // TODO: send photoUri to other component to display the image
  // TODO: send extractedInfo to other component to display the info
  // TODO: add a button to take another picture
  
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current: any) => (current === 'back' ? CameraType.Back : CameraType.Front));
  }

  const name = contactInfo.name;
  const phone = contactInfo.phone
  const email = contactInfo.email
  const website = contactInfo.website

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 0.6,  // Max quality (1 means 100% quality)
        base64: false, // Optional: if you need the base64 version of the image, set this to true
        exif: false,   // Optional: if you need EXIF metadata, set this to true
      };
      const photo = await cameraRef.current.takePictureAsync(options);
      if (photo?.uri) {
        let filename = photo.uri.split('/').pop();
        try{
          let Data = new FormData();
          Data.append('url', {
            uri: photo.uri,
            name: filename,
            type: 'image/jpeg',  // Assuming the image is a JPEG. Adjust as needed.
          } as any);
          Data.append('language', 'eng');
          Data.append('isOverlayRequired', 'false');
          Data.append('iscreatesearchablepdf', 'false');
          Data.append('issearchablepdfhidetextlayer', 'false');
          Data.append('detectOrientation', 'true');
          Data.append('scale', 'true');
          Data.append('OCREngine', '2');
          let response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            headers: {
              'apikey': 'K89273323488957',  // Your API key
            },
            body: Data,
          });
    
          let responseJson = await response.json();
          console.log(responseJson)
          if(responseJson){
            router.push({
              pathname: '/newContacts', 
              params: {
                 name: responseJson.ParsedResults[0].ParsedText.match(/([A-Za-z]+ [A-Za-z]+)/g)[0],
                 phone: responseJson.ParsedResults[0].ParsedText.match(/(\+91)?[6-9]\d{9}/g)[0],
                 email: responseJson.ParsedResults[0].ParsedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)[0],
                 website: responseJson.ParsedResults[0].ParsedText.match(/(www?.[^\s]+)/g)[0],
              },
            })
          }
      } catch (error) {
        console.error(error);
      }
       
      } else {
        console.error('Failed to capture photo.');
      }
    }

  };


  return (
    <SafeAreaView style={styles.container}>

{/* yaha pe preview image hai ye kaam ke cheej hi */}
{/* {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : (
        <View />

      )} */}
      <ThemedText type='title'>Scan your Card</ThemedText>

      <ThemedView style={{display: 'flex', alignItems: 'center', height: '80%', width: '100%', justifyContent: 'center'}}>
        {/* <ThemedText>Camera Container</ThemedText> */}
        <View style={{ height: '40%', width: '90%', borderWidth: 2, borderColor: 'black' , borderRadius: 15, overflow: 'hidden'}}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
        </View>
      </ThemedView>

      <ThemedView style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture} >
            <TabBarIcon name="camera" size={30} color="white" library={Ionicons} />
        </TouchableOpacity>
      </ThemedView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 30,
  },
  camera: {
    flex: 1,
    borderRadius: 15
  },
  CardRectangle: {
    width: screenWidth,
    height: screenHeight,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'white',
  },
  captureButton: {
    marginTop: 'auto',
    marginBottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'white'
  },
  preview: {
    flex: 1,
    width: screenWidth/ 2.5,
    height: screenHeight / 2,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255, 0)',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
});
