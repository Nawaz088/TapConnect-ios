import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Platform, StatusBar, useColorScheme, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // For the search icon and other icons
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { socialLinks } from '@/constants/SocialIcons';


const {width: screenWidth, height: screenHeight } = Dimensions.get('window');
export default function NewLinkScreen() {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const renderItem = ({ item }:any) => (
    <ThemedView style={[styles.itemContainer, {backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background}]} >
      <ThemedView style={styles.iconTextContainer}>
        <Ionicons name={item.icon} size={24} color={item.color ? item.color : '#333'} />
        <ThemedText style={styles.itemText} darkColor={Colors.dark.text} lightColor={Colors.light.text}>{item.name}</ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.addButton} onPress={() => router.push({pathname: '/(screens)/AddLink', params:{ link: item.name, icon: item.icon, color: item.color }})}>
        <ThemedText style={styles.addButtonText} darkColor={Colors.dark.text} lightColor={Colors.light.text}>Add</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.headerText} lightColor='#000' darkColor='#fff'>New Link</ThemedText>
      <ThemedView style={[styles.searchContainer, {backgroundColor: colorScheme === 'dark' ? Colors.dark.SearchBar : Colors.light.SearchBar}]}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput,{ color: colorScheme === 'dark' ? Colors.light.text : Colors.dark.text}]}
          placeholder="Search for link"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </ThemedView>
      <ThemedView style={[styles.linksContainer, {backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background}]} >
        <FlatList
          data={socialLinks.filter((link) => link.name.toLowerCase().includes(searchText.toLowerCase()))}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'medium',
    fontFamily: 'RobotoMedium',
    paddingVertical: 30,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'regular',
    fontFamily: 'RobotoRegular'
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    marginLeft: 15,
    fontFamily: 'RobotoRegular'
  },
  addButton: {
    backgroundColor: '#E3E9FF',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  addButtonText: {
    color: '#4A6CFF',
    fontSize: 14,
    fontFamily: 'RobotoMedium'
  },
  linksContainer: {
    display: "flex",
    padding: 10,
    marginTop: 20,
    borderRadius: 30,
    height: screenHeight * 0.78,
    width: screenWidth - 40,
    marginBottom: 80
  },
});
