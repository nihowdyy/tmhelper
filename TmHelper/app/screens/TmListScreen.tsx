import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image, TextInput } from 'react-native';
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

const RenderItem = React.memo(({ item, onPress }: { item: TMData; onPress: (item: TMData) => void }) => {
  const moveTypeImage = moveTypes[item.move_info.type as MoveType] || moveTypes['Normal'];
  const moveCategoryImage = moveCategories[item.move_info.category as MoveCategory] || moveCategories['Status'];

  return (
    <Pressable onPress={() => onPress(item)} style={styles.item}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.tmNumber}>TM {item.tm_info.number}</Text>
          <Text style={styles.tmName}>{item.tm_info.name}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={moveTypeImage} style={styles.image} resizeMode='contain' />
          <Image source={moveCategoryImage} style={styles.image} resizeMode='contain' />
        </View>
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

  const handlePress = React.useCallback((tm: TMData) => {
    try {
      console.log('Navigating to TMDetails with:', tm);
      navigation.navigate('TMDetails', { tm });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#000" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by number, name, type, or category"
          placeholderTextColor="#ccc"
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
      </View>
      {filteredData.length === 0 ? (
        <Text>No Results Found</Text>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <RenderItem item={item} onPress={handlePress} />}
          keyExtractor={(item) => item.tm_info.number}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 5, 
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
    fontSize: 14,
    color: '#555',
  },
  tmName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
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
});  

export default HomeScreen;
