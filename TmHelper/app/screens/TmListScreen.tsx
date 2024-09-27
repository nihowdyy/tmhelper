// screens/HomeScreen.tsx

import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image} from 'react-native';
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
  const handlePress = React.useCallback((tm: TMData) => {
    navigation.navigate('TMDetails', { tm });
  }, [navigation]);

  return (
    <View style={styles.row}>
      <FlatList
      data={data}
      renderItem={({ item }) => <RenderItem item={item} onPress={handlePress} />}
      keyExtractor={(item) => item.tm_info.number}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      showsVerticalScrollIndicator={false}
      />
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
});

export default HomeScreen;
