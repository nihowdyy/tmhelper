import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image, Platform, TextInput, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moveTypes from '../../assets/images/moveTypes';
import moveCategories from '../../assets/images/moveCategories';
const tmData = require('../../assets/json/PKMN-SV-TMS.json');

// TM Data Information
interface TMData {
  tm_info: {
    number: string;
    name: string;
  };
  move_info: {
    type: string;
    category: string;
    power: string;
    accuracy: string;
    pp: string;
  };
}

type MoveType = 
  | "Bug"
  | "Dark"
  | "Dragon"
  | "Electric"
  | "Fairy"
  | "Fighting"
  | "Fire"
  | "Flying"
  | "Ghost"
  | "Grass"
  | "Ground"
  | "Ice"
  | "Normal"
  | "Poison"
  | "Psychic"
  | "Rock"
  | "Steel"
  | "Water";

type MoveCategory =
  | "Physical"
  | "Special"
  | "Status";  

const data: TMData[] = tmData as TMData[];

// Render for Move and their corresponding Information
const RenderItem = React.memo(({ item, onPress }: { item: TMData; onPress: (item: TMData) => void }) => {
  const moveTypeImage = moveTypes[item.move_info.type as MoveType] || moveTypes['Normal'];
  const moveCategoryImage = moveCategories[item.move_info.category as MoveCategory] || moveCategories['Status'];

  return (
    <Pressable onPress={() => onPress(item)}>
      <Text style={styles.tmNumber}>TM {item.tm_info.number}</Text>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.tmName}>{item.tm_info.name}</Text>
        </View>
        {Platform.OS != 'web' ? (
          <View style={styles.imageContainer}>
            <Image source={moveTypeImage} style={styles.typeImage} resizeMode='contain'/>
            <Image source={moveCategoryImage} style={styles.categoryImage} resizeMode='contain'/>
          </View>
        ) : (
          <View style={styles.imageContainer}>
              {/* Move Icons */}
              <View style={styles.imageContainer}>
                <Image source={moveTypeImage} style={styles.typeImage} resizeMode="contain" />
                <Text style={styles.iconLabel}>{item.move_info.type}</Text>
                {/* Seperator */}
                <View style={styles.separator}></View>
                <Image source={moveCategoryImage} style={styles.categoryImage} resizeMode="contain" />
                <Text style={styles.iconLabel}>{item.move_info.category}</Text>
              </View>
          </View>
        )}
      </View>
    </Pressable>
  );
});

const HomeScreen = ({ navigation }: any) => {
  const [query, setQuery] = useState('');  // State to hold the search query
  const [filteredData, setFilteredData] = useState<TMData[]>(data);  // State to hold filtered data

  const handleSearch = (text: string) => {
    setQuery(text);

    // Split the query by spaces to handle multiple search terms
    const searchTerms = text.toLowerCase().split(' ').filter(term => term.length > 0);

    // Filter the data by TM number, name, type, or category
    const newData = data.filter(item => {
      return searchTerms.every(term => 
        item.tm_info.name.toLowerCase().includes(term) || 
        item.tm_info.number.includes(term) ||
        item.move_info.type.toLowerCase().includes(term) || 
        item.move_info.category.toLowerCase().includes(term)
      );
    });

    setFilteredData(newData);
  };

  // Handling Navigation Errors
  const handlePress = React.useCallback((tm: TMData) => {
    try {
      navigation.navigate('TMDetails', { tm });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <View style={styles.screenContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by No., Name, Type, or Category"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
        </View>
        {/* TM Results */}
        {filteredData.length === 0 ? (
          <View style={{  flex: 1,
                          flexDirection: 'row',
                          alignSelf: 'center',
                          width: '95%',
                          paddingVertical: 5  }}>
            <Text style={{  fontSize: 18  }}>
              No Results Found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <RenderItem item={item} onPress={handlePress} />}
            keyExtractor={(item) => item.tm_info.number}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{aspectRatio: Platform.OS === 'web' ? 1 : undefined}}
            style={styles.flatlist}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    padding: Platform.OS === 'web' ? 16: 0,
    backgroundColor: '#FAFAFA',
    marginHorizontal: Platform.OS === 'web' ? 'auto' : 0,
    minWidth: Platform.OS === 'web' ? 800 : '100%',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '95%',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 1, 
    height: 25,
    backgroundColor: '#9099A1', 
    marginHorizontal: 4,
  },
  iconLabel: {
    fontSize: 18,
    fontWeight: '400',
    marginHorizontal: 4,
  },
  typeImage: {
    width: 24,
    height: 24,
    marginHorizontal: 4,
  },
  categoryImage: {
    width: 32,
    height: 24,
    marginHorizontal: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tmNumber: {
    fontSize: 16,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    width: '95%',
    paddingTop: 10,
  },
  tmName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F2F2F2',
    borderColor: '#eeeeee',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    color:  '#000000'
  },
  flatlist: {
    flexGrow: 1,
  },
});  

export default HomeScreen;
