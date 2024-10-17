import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from '@/store/store';
import Toast from 'react-native-toast-message';
import DeepLinkHandler from '@/scripts/DeepLinksHandler';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: '(screens)/index',
  
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isDarkModeboolEnabled, setIsDarkModeboolEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState('');

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    

    // this will do in 2 days
    // const fetchDarkMode = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('isEnabled');
    //     value ? setIsDarkMode('dark') : setIsDarkMode('light');
    //     console.log("this is the value of dark mode button from root layout", isDarkMode);
    //     if (value !== null) {
    //       setIsDarkModeboolEnabled(JSON.parse(value));
    //     }
    //   } catch {
    //     console.log('value is not set yeet!!!!!!');
    //   }
    // }

    // fetchDarkMode();

  }, [loaded]);

  if (!loaded) {
    return null;
  }

  
  //this screct should not be handled like this below
  return (
      <Provider store={store}>
        <ThemeProvider value={(colorScheme) === 'dark' ? DarkTheme : DefaultTheme}>
          <DeepLinkHandler />
          <Stack initialRouteName='(screens)/index'>
            <Stack.Screen name='(screens)/index' options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(screens)/NewLinkScreen" options={{ headerShown: false }} />
            <Stack.Screen name="newContacts" options={{ headerShown: false }}/>
            <Stack.Screen name="(screens)/activatenewproducts" options={{ headerShown: false }}/>
            {/* <Stack.Screen name="(screens)/NfcCard" options={{ headerShown: false }}/> */}
            {/* <Stack.Screen name="/(screens)/otpScreen" options={{ headerShown: false }}/> */}
            <Stack.Screen name="(screens)/EditProfile" options={{ headerShown: false }}/>
            <Stack.Screen name="(screens)/AddLink" options={{ headerShown: false }}/>
            <Stack.Screen name="(screens)/profilescreen" options={{ headerShown: false }}/>
            <Stack.Screen name="BusinessCardReader" options={{ headerShown: false }}/>
          </Stack>
          <Toast />
        </ThemeProvider>
      </Provider>
  );
}
