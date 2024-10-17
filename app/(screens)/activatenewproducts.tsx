import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
    StatusBar,
    Dimensions,
    useColorScheme,
    Alert,
  } from "react-native";
  import { ThemedView } from "@/components/ThemedView";
  import { ThemedText } from "@/components/ThemedText";
  import { Colors } from "@/constants/Colors";
  import { LinearGradient } from "expo-linear-gradient";
  import { useCallback, useEffect, useState } from "react";
  import NfcManager, { NfcTech, Ndef, NfcEvents } from "react-native-nfc-manager";
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  
  // Initialize NFC Manager
  // NfcManager.start();
  
  const activatenewproducts: React.FC = () => {
    const colorScheme = useColorScheme();
    const [isWriting, setIsWriting] = useState(false);
  
    useEffect(() => {
      NfcManager.start()
    }, [])
    const handleNfcWrite = useCallback(async () => {
      // Prevent initiating multiple writes
      if (isWriting) {
        return;
      }
  
      setIsWriting(true);
  
      try {
        // Request NFC technology (NDEF in this case)
        await NfcManager.requestTechnology(NfcTech.Ndef);
  
        // Define the URL to write to the NFC tag
        const url = "https://zeniqx.com";
  
        // Encode the URL into an NDEF message
        const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
  
        // Write the NDEF message to the NFC tag
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
  
        // Notify the user of success
        Alert.alert("Success", `NFC tag written successfully with URL: ${url}`);
      } catch (error) {
        // Handle errors appropriately
        console.warn("Error writing NFC tag:", error);
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "Failed to write NFC tag. Please try again.");
        }
      } finally {
        // Ensure NFC technology is properly released
        await NfcManager.cancelTechnologyRequest();
        setIsWriting(false);
      }
    }, [isWriting]);
  
  
    // ############################# NEW NFC WRITE CODE #############################
    const [hasNfc, setHasNFC ] = useState<any>();
    useEffect(() => {
      const checkIsSupported = async () => {
        const deviceIsSupported = await NfcManager.isSupported()
  
        setHasNFC(deviceIsSupported)
        if (deviceIsSupported) {
          await NfcManager.start()
        }
      }
  
      checkIsSupported()
    }, [])
  
    useEffect(() => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag:any) => {
        console.log('tag found', tag)
      })
  
      return () => {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      }
    }, [])
  
  
    const readTag = async () => {
      await NfcManager.registerTagEvent();
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView>
          <ThemedText type="title" darkColor="#FFFFFF">
            Activate New Products
          </ThemedText>
  
          <ThemedView
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 40,
              position: "relative",
            }}
          >
            <Image source={require("../../assets/images/round_balck_logo.png")} />
            <ThemedView
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                marginTop: screenHeight * 0.15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LinearGradient
                colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]}
                style={styles.background}
                locations={[0.1, 0.7]}
              />
              <Image
                source={require("../../assets/images/iPhone_15.png")}
                style={{ zIndex: 1 }}
              />
              <View
                style={{
                  backgroundColor:
                    colorScheme === "light"
                      ? Colors.light.background
                      : Colors.dark.background,
                  width: screenWidth * 0.48,
                  height: screenHeight * 0.49,
                  top: 0,
                  position: "absolute",
                  borderRadius: 30,
                  marginTop: 15,
                }}
              ></View>
  
              <ThemedView
                style={{
                  zIndex: 3,
                  position: "absolute",
                  bottom: -screenHeight * 0.1,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  width: screenWidth,
                  height: "auto",
                  backgroundColor:
                    colorScheme === "light" ? Colors.light.background : "#000",
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "blue",
                    width: screenWidth - 40,
                    height: screenHeight * 0.08,
                    marginBottom: 20,
                    borderRadius: 15,
                  }}
                  disabled={isWriting}
                  onPress={handleNfcWrite}
                >
                  <ThemedText>
                    {isWriting ? "Writing NFC..." : "Activate by NFC"}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "blue",
                    width: screenWidth - 40,
                    height: screenHeight * 0.08,
                    marginBottom: 20,
                    borderRadius: 15,
                  }}
                >
                  <ThemedText>Button</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
    },
    background: {
      zIndex: 2,
      height: screenHeight * 0.55,
      width: screenWidth * 0.53,
      position: "absolute",
      top: 0,
    },
  });
  
  export default activatenewproducts;
  