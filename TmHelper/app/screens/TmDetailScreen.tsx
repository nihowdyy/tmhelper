// screens/TMDetailScreen.tsx

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const TMDetailScreen = ({ route }: any) => {
  const { tm } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{tm.tm_info.name} (TM {tm.tm_info.number})</Text>
      <Text style={styles.subtitle}>Location:</Text>
      {tm.tm_info.location.map((loc: string, index: number) => (
        <Text key={index} style={styles.text}>{loc}</Text>
      ))}
      <Text style={styles.subtitle}>LP Cost: {tm.tm_info.lp_cost}</Text>
      <Text style={styles.subtitle}>Sell Price: {tm.tm_info.sell_price}</Text>
      <Text style={styles.subtitle}>Materials:</Text>
      {tm.tm_info.materials.map((material: any, index: number) => (
        <Text key={index} style={styles.text}>
          {material.quantity} x {material.material_name}
        </Text>
      ))}
      <Text style={styles.subtitle}>Move Info:</Text>
      <Text style={styles.text}>Type: {tm.move_info.type}</Text>
      <Text style={styles.text}>Category: {tm.move_info.category}</Text>
      <Text style={styles.text}>Power: {tm.move_info.power}</Text>
      <Text style={styles.text}>Accuracy: {tm.move_info.accuracy}</Text>
      <Text style={styles.text}>PP: {tm.move_info.pp}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TMDetailScreen;
