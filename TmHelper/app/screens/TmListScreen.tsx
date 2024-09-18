// screens/HomeScreen.tsx

import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tmData from '../../assets/json/PKMN-SV-TMS.json';

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

const HomeScreen = ({ navigation }: any) => {
  const handlePress = (tm: TMData) => {
    navigation.navigate('TMDetail', { tm });
  };

  const renderItem = ({ item }: { item: TMData }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.item}>
      <Text style={styles.title}>TM {item.tm_info.number}: {item.tm_info.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.tm_info.number}
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
  },
  title: {
    fontSize: 18,
  },
});

export default HomeScreen;
