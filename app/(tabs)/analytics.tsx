import AnalyticsListItem from "@/components/AnalyticsListItem";
import Graphbox from "@/components/Graphbox";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { url } from "@/constants/Urls";
import axios from "axios";
import { Link, useFocusEffect } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const { width: screenWidth, height: screenHeight} = Dimensions.get('window');

const analytics = () => {
  const profileView = [0, 1];
  const newConnect = [0, 1]

  const [data, setData] = useState<any>([]);
  const baseUrl = url.baseUrl;
  const getAnalytics = async() => {
    const userId = await SecureStore.getItemAsync('UserId');
    const url = `${baseUrl}/api/track/stats/${userId}`;
    console.log("Analytics url>>>>>>>>",url);
    const config = {
      method: 'GET',
      url: url,
    }
    await axios(config).then((response) => {
      console.log("Analytics response>>>>>>>>>>",response.data);
      setData(response.data);
    }).catch((error) => {
      console.log(">>>>>>>>>>>>>>>>>>Analytics errror",error)
    })
  }

  useFocusEffect(React.useCallback(() => {
    getAnalytics()
  }, []))

  console.log(data, "??????????????????????????????????????????????????/")

// ############################# Analytics DATATATATATAT ################################################
  data.map((item:any) => { profileView.push(item.profileCount)})
  const profilevalue = profileView.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);

  data.map((item:any) => { newConnect.push(item.connectionCount)})
  const newConnections = newConnect.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);

  let totalTaps = 0;
  const linkTapsArray = [0, 1];
  data.map((item: any) =>
    Object.entries(item.countsByLinkValue).forEach(([key, val]: any) => {
      totalTaps += val;
      if (val !== 0) {
        linkTapsArray.push(val);
      }
    })
  );
  
  // const AnalyticsData = useSelector((state: any) => state.analyticsData.analyticdata);
  console.log("AnalyticsData>>>>>>>>>>",profileView);

  const TTR = totalTaps ? ((profilevalue / totalTaps) * 100).toFixed(1) : 0;

  // const firstObject = data ? data[0].countsByLinkValue : {}

  // const totalTaps = Object.values(linkTaps).reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);

  // #####################################################################################################
  
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={{ padding: 20 }}>
        <ThemedText style={styles.headingText} type="title" lightColor="#000" darkColor="#fff">
          Analytics
        </ThemedText>
        <ThemedView style={styles.GraphsContainer}>
          <ThemedView style={styles.GraphRows}>
            <Graphbox
              data={profileView}
              width={140}
              height={screenHeight * 0.08}
              numberColor={Colors.numberColors.Mona_Lisa}
              bgcolor={Colors.bgColors.Provincial_Pink}
              title="Views"
              value={profilevalue}
            />
            <Graphbox
              data={linkTapsArray}
              width={140}
              height={screenHeight * 0.08}
              numberColor={Colors.bgColors.Cornflower_Blue}
              bgcolor={Colors.numberColors.Link_Water}
              title="Link Taps"
              value={totalTaps}
            />
          </ThemedView>
          <ThemedView style={styles.GraphRows}>
            <Graphbox
              data={newConnect}
              width={140}
              height={screenHeight * 0.08}
              numberColor={Colors.numberColors.Fountain_Blue}
              bgcolor={Colors.bgColors.Black_squeez}
              title="New Connections"
              value={newConnections}
            />
            <Graphbox
              data={profileView}
              width={140}
              height={screenHeight * 0.08}
              numberColor={Colors.numberColors.Froly}
              bgcolor={Colors.bgColors.Amour}
              title="TTR"
              value={`${TTR}%`}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.appOverViewContainer}>
          <ThemedText style={{fontFamily: 'RobotoMedium', fontSize: 14, fontWeight: 'medium', color: Colors.numberColors.Figma_black}}>Apps Overview</ThemedText>
          <ThemedView
            style={styles.appsContainer}
            lightColor="#fff"
            darkColor="#181823"
          >
            <View
              style={{
                height:
                  Platform.OS === "ios"
                    ? screenHeight * 0.35
                    : screenHeight * 0.4,
              }}
            >
              <ScrollView style={styles.scrollView}>
              {data && data?.length > 0 && data[0]?.countsByLinkValue ? (
                  <>
                    {Object.entries(data[0].countsByLinkValue).map(
                      ([key, val]: any) =>
                        val !== 0 && (
                          <AnalyticsListItem
                            key={key}
                            iconLib={Ionicons}
                            iconName={`logo-${key}`.toLowerCase()}
                            disc={key.trim()}
                            reachNumber={`+${val}`}
                          />
                        )
                    )}
                  </>
                ) : (
                  <ThemedView>
                    <ThemedText>No Taps in last 5 days</ThemedText>
                  </ThemedView>
                )}


              </ScrollView>
            </View>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  },
  headingText: {
    fontSize: 36,
    paddingVertical: Platform.OS === "android" ? 10 : 20,
    fontWeight: 'medium',
    fontFamily: 'RobotoMedium'
  },
  GraphsContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
  },
  GraphRows: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  appOverViewContainer: {
    marginTop: 20,
  },
  appsContainer: {
    marginTop: 10,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: screenHeight,
    elevation: 5,
  },
  scrollView: {
    marginHorizontal: 0,
  },
});
