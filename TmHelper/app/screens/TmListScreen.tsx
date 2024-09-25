// screens/HomeScreen.tsx

import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const tmData = require('../../assets/json/PKMN-SV-TMS.json');

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

const data: TMData[] = tmData as TMData[];

const RenderItem = React.memo(({ item, onPress }: { item: TMData; onPress: (item: TMData) => void }) => (
  <Pressable onPress={() => onPress(item)} style={styles.item}>
    <Text style={styles.title}>TM {item.tm_info.number}: {item.tm_info.name}</Text>
  </Pressable>
));

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
  title: {
    fontSize: 18,
  },
});

export default HomeScreen;
