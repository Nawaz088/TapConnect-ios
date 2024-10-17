import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native'
import { TabBarIcon } from './navigation/TabBarIcon'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router, SplashScreen } from 'expo-router'
import { fonts } from '@/scripts/fonts'
import { useFonts } from 'expo-font'


const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window')
const ScanButton = () => {
  const [ fontsLoaded, error ] = useFonts({
    "roboto-medium": require("../assets/fonts/Roboto-Medium.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <TouchableOpacity style={[styles.container]} onPress={() => router.push('/BusinessCardReader')}>
      <LinearGradient
        colors={['#FF416C', '#FF4B2B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="credit-card-scan" size={20} style={{marginLeft: 30}} color="white" />
          <Text style={[styles.text, {fontFamily: 'roboto-medium'}]}>Scan Business Card</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default ScanButton

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        borderRadius: 15,
        overflow: 'hidden',
        width: 200,
        paddingHorizontal: 2,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 15,
        shadowColor: '#FF4B2B',
        shadowOpacity: 0.2,
        elevation: 5,
        marginBottom: '30%'
      },
      gradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        padding: 10
      },
      text: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'medium',
        padding: 10
      },
})