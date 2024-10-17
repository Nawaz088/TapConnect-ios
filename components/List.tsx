import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ListRenderItemInfo,
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { TabBarIcon } from "./navigation/TabBarIcon";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ContastsList from "./ContastsList";
import { url } from "@/constants/Urls";
import axios from "axios";
import { router } from "expo-router";
import { BottomSheet } from "react-native-btr";


interface Props {
  searchPhrase: string;
  setClicked: (clicked: boolean) => void;
//   data: Array<{ id: string; name: string; details: string }>;
  data: any;
  onDelete: (id: string) => void
}

interface ItemProps {
  name: string;
  details: string;
}

// Definition of the Item, which will be rendered in the FlatList
const Item = ({ name, details }: ItemProps) => (
  <ThemedView style={styles.item}>
    <ThemedText style={styles.title}>{name}</ThemedText>
    <ThemedText>{details}</ThemedText>
  </ThemedView>
);

const baseUrl = url.baseUrl;
// const deleteItem = (id: string) => {
//   console.log("ID to be deleted?????????????????????????????????????????????????????", id)
//     try {
//       let config = {
//         method: 'delete',
//         maxBodyLength: Infinity,
//         url: `${baseUrl}/api/contact/${id}`
//       }
//       axios.request(config).then((response) => {
//         console.log("Response from delete contact ??????????????????????????????????????????", JSON.stringify(response.data))
//       }).catch((error) => {
//         console.log("Error while deleting contact", error)
//       })
//     } catch (error) {
//       console.log("Error while deleting contact", error)
//     }
// }


const List = ({ searchPhrase, setClicked, data, onDelete }: Props) => {
  const [ visible, setVisible ] = React.useState(false)
  const [ itemData, setItemData ] = React.useState<any>()

  const handleContactRedirect = async (email: string) => {
    try {
      const config = {
        method: 'get',
        url: `${baseUrl}/api/search-user/${email}`
      };
      const response = await axios.request(config);
      // console.log("Response from search user ??????????????????????????????????????????", JSON.stringify(response.data))
      if(response.status == 200) {
        console.log("???????????????Dataatatatatat", response.data[0]._id)
        router.push({ pathname: "/(screens)/profilescreen", params: { userId: response.data[0]._id } })
      }
    } catch (error) {
      console.log("Error while searching user", error);
      setVisible(true)
    }
  };

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  const renderItem = ({ item }: ListRenderItemInfo<{ id: string; name: string; designation: string; self_photo: any, _id: string, email: string, mobile: string, company: string, bio:string }>) => {
    // When no input, show all
    if (searchPhrase === "") {
    //   return <Item name={item.name} details={item.details} />;

        return (
          <TouchableOpacity
            onPress={() => {
              handleContactRedirect(item.email);
              setItemData(item);
            }}
          >
            <ContastsList
              Id={item.id}
              Title={item.name}
              description={item.designation}
              avatar={item.self_photo}
              onDelete={() => onDelete(item._id)}
              onEdit={() => {
                router.navigate({
                  pathname: "/(tabs)/contacts/EditContact",
                  params: {
                    name: item.name,
                    phone: item.mobile,
                    email: item.email,
                    designation: item.designation,
                    company: item.company,
                    bio: item.bio,
                    self_photo: item.self_photo,
                    Id: item._id,
                  } as any,
                });
              }}
            />
          </TouchableOpacity>
        );
    }
    // Filter of the name
    if (item.name.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleContactRedirect(item.email);
            setItemData(item);
          }}
        >
          <ContastsList
            Id={item.id}
            Title={item.name}
            description={item.designation}
            avatar={item.self_photo}
            onDelete={() => onDelete(item._id)}
            onEdit={() => {
              router.navigate({
                pathname: "/(tabs)/contacts/EditContact",
                params: {
                  name: item.name,
                  phone: item.mobile,
                  email: item.email,
                  designation: item.designation,
                  company: item.company,
                  bio: item.bio,
                  self_photo: item.self_photo,
                  Id: item._id
                } as any,
              });
            }}
          />
          ;
        </TouchableOpacity>
      );
    }
    // Filter of the description
    if (item.designation.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
      return (
        <ContastsList
          Id={item.id}
          Title={item.name}
          description={item.designation}
          avatar={item.self_photo}
          onDelete={() => onDelete(item._id)}
          onEdit={() => {
            router.navigate({
              pathname: "/(tabs)/contacts/EditContact",
              params: {
                name: item.name,
                phone: item.mobile,
                email: item.email,
                designation: item.designation,
                company: item.company,
                bio: item.bio,
                self_photo: item.self_photo,
                Id: item._id
              } as any,
            });
          }}
        />
      );
    }
    return null;
  };

  // console.log(itemData.name)

  return (
    <SafeAreaView style={styles.list__container}>
      <View
        onStartShouldSetResponder={() => {
          setClicked(false);
          return false;
        }}
      >

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </View>
      <BottomSheet visible={visible} onBackdropPress={toggleBottomNavigationView}>
        <View style={styles.bottomSheet}>
          <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 45}}>
            <ImageBackground style={{ height: 100, width: 100, borderRadius: 30, marginBottom: 10  }} source={itemData && itemData.self_photo ? {uri : `https://app.Tapconnect.in/${itemData.self_photo}`} : { uri: 'https://avatar.iran.liara.run/public/boy' }}  />
            <Text style={{fontFamily: 'RobotoMedium', fontSize: 18}}>{itemData ? itemData.name : ''}</Text>
            <Text style={{fontFamily: 'RobotoMedium', fontSize: 12}}>{itemData ? itemData.designation : ''}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <View style={{flexDirection: 'row', padding: 15, gap: 15}}>
              <TabBarIcon name="email-outline" size={30} color="black" library={MaterialCommunityIcons} />
              <View style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'RobotoMedium', fontSize: 14}}>Email</Text>
                <Text>{itemData ? itemData.email : ''}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', padding: 15, gap: 15}}>
              <TabBarIcon name="phone" size={30} color="black" library={Feather} />
              <View style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'RobotoMedium', fontSize: 14}}>Mobile Number</Text>
                <Text>{itemData ? itemData.mobile : ''}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', padding: 15, gap: 15}}>
              <View style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'RobotoMedium', fontSize: 14}}>Bio</Text>
                <Text>{itemData ? itemData.bio : ''}</Text>
              </View>
            </View>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "100%",
  },
  item: {
    margin: 30,
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    fontStyle: "italic",
  },
  bottomSheet: {
    backgroundColor: 'white',
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  detailsContainer: {
    justifyContent: 'center',
    // alignItems: 'center',
  },
  detailsText: {
    fontSize: 16,
    fontFamily: 'RobotoRegular',
    fontWeight: 'medium',
  }
});