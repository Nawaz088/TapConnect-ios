import NfcManager, { NfcEvents, Ndef, NfcTech } from 'react-native-nfc-manager';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

const NfcCard = () => {
  const [hasNfc, setHasNFC] = useState<any>();

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();
      setHasNFC(deviceIsSupported);
      if (deviceIsSupported) {
        await NfcManager.start();
      }
    };
    checkIsSupported();
  }, []);

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag:any) => {
      console.log('tag found////////////', tag);
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  const readTag = async () => {
    try {
      // Request NFC technology for NDEF
      await NfcManager.requestTechnology(NfcTech.Ndef);
  
      // Get the tag data
      const tag = await NfcManager.getTag();
  
      // Parse the NDEF records to find the URL
      const ndefRecord = tag?.ndefMessage?.find(
        (record) => record?.tnf === Ndef.TNF_WELL_KNOWN && record?.type[0] === 85
      );
  
      if (ndefRecord) {
        // Decode the payload
        const payload = ndefRecord.payload;
        const uriPrefixIndex = payload[0];
        const uriPrefix = [
          "", "http://www.", "https://www.", "http://", "https://",
          "tel:", "mailto:", "ftp://anonymous:anonymous@", "ftp://ftp.", "ftps://",
          "sftp://", "smb://", "nfs://", "ftp://", "dav://", "news:",
          "telnet://", "imap:", "rtsp://", "urn:", "pop:", "sip:",
          "sips:", "tftp:", "btspp://", "btl2cap://", "btgoep://", "tcpobex://",
          "irdaobex://", "file://", "urn:epc:id:", "urn:epc:tag:", "urn:epc:pat:",
          "urn:epc:raw:", "urn:epc:", "urn:nfc:"
        ][uriPrefixIndex]; // URI prefix from the first byte
        const link = uriPrefix + String.fromCharCode(...payload.slice(1)); // Combine URI prefix with the rest of the payload
  
        if (link) {
          // Ensure that the URL has the correct scheme
          const formattedLink = link.startsWith('http') ? link : `https://${link}`;
          
          // Open the link in the default browser
          Alert.alert('Opening Link', formattedLink);
          Linking.openURL(formattedLink).catch((err) => {
            console.warn('Error opening URL:', err);
            Toast.show({type: 'error', text1: 'Failed to open URL. Please try again.'})
          });
        } else {
          Toast.show({type: 'error', text1: 'No valid URL found on the NFC tag.'})
        }
      } else {
        Toast.show({type: 'error', text1: 'No valid NDEF record found.'})
      }
    } catch (ex) {
      console.warn('Error reading NFC tag:', ex);
      Toast.show({type: 'error', text1: 'Failed to read NFC tag. Please try again.'})
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };
  
  
  

  const cancelReadTag = async () => {
    await NfcManager.unregisterTagEvent();
  };

  

  const writeTag = async () => {
    const userId = await SecureStore.getItemAsync("UserId")
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const url = `tap-connect://tap.me/${userId}`;
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      Alert.alert('Success', 'URL written to NFC tag successfully!');
    //   await NfcManager.setAlertMessageIOS('URL written successfully!');
    } catch (ex) {
      console.warn('Error writing NFC tag:', ex);
      Toast.show({type: 'error', text1: 'Failed to write NFC tag. Please try again.'})
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  if (hasNfc === null) return null;

  return (
    <SafeAreaView style={styles.container}>
      {hasNfc ? (
        <>
          <Text style={styles.text}>Hello world</Text>
          <TouchableOpacity style={styles.button} onPress={readTag}>
            <Text style={styles.buttonText}>Scan Tag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={writeTag}>
            <Text style={styles.buttonText}>Write URL to Tag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={cancelReadTag}>
            <Text style={styles.buttonText}>Cancel Scan</Text>
          </TouchableOpacity>

        </>
      ) : (
        <Text style={styles.text}>NFC not supported</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    text: {
      fontSize: 20,
      marginBottom: 20,
    },
    button: {
      backgroundColor: 'blue',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });

export default NfcCard;

