import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, Dimensions } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Props {
    clicked: boolean;
    searchPhrase: string;
    setSearchPhrase: (phrase: string) => void | null;
    setClicked: (clicked: boolean) => void | null;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked} : Props) => {
  return (
    <View style={styles.container}>
      <View
        style={
          clicked
            ? styles.searchBar__clicked
            : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Feather
          name="search"
          size={20}
          color="#2E3A59"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={"#2E3A59"}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
              setSearchPhrase("")
          }}/>
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {/* {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          ></Button>
        </View>
      )} */}
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    paddingBottom: 27,
    paddingLeft: 4,
    paddingRight: 4,
    // backgroundColor: 'blue',
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: screenWidth * 0.7,
  },
  searchBar__unclicked: {
    padding: 5,
    flexDirection: "row",
    width: "95%",
    height: screenHeight * 0.06,
    backgroundColor: "#E7E8F6",
    borderRadius: 15,
    alignItems: "center",
    paddingHorizontal: 16,
    fontFamily: "RobotoRegular",
    fontSize: 16,
    color: Colors.numberColors.Figma_black
  },
  searchBar__clicked: {
    // padding: 5,
    // flexDirection: "row",
    // width: "80%",
    // backgroundColor: "#d9dbda",
    // borderRadius: 15,
    // alignItems: "center",
    // justifyContent: "space-evenly",
    padding: 5,
    flexDirection: "row",
    width: "95%",
    height: screenHeight * 0.06,
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    fontWeight: 'regular',
    color: "#2E3A59",
    marginLeft: 10,
    width: "75%",
  },
});