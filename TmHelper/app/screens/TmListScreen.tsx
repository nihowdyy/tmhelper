// screens/HomeScreen.tsx

import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image} from 'react-native';
import moveTypes from '../../assets/images/moveTypes';
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

const data: TMData[] = tmData as TMData[];

const RenderItem = React.memo(({ item, onPress }: { item: TMData; onPress: (item: TMData) => void }) => {
  // Get the SVG image corresponding to the move type
  const moveTypeImage = moveTypes[item.move_info.type as MoveType] || moveTypes['Normal']; // Fallback to 'Normal' if the type is not found

  return (
    <Pressable onPress={() => onPress(item)} style={styles.item}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.title}>
          TM {item.tm_info.number}: {item.tm_info.name}
        </Text>
        <Image source={moveTypeImage} style={styles.image} />
      </View>
    </Pressable>
  );
});

const HomeScreen = ({ navigation }: any) => {
  const handlePress = React.useCallback((tm: TMData) => {
    navigation.navigate('TMDetails', { tm });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
      data={data}
      renderItem={({ item }) => <RenderItem item={item} onPress={handlePress} />}
      keyExtractor={(item) => item.tm_info.number}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    pointerEvents: 'auto',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
  },
});

export default HomeScreen;
