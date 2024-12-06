import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LandingPage({ navigation }: any) {
    return (
        <View>
            <Text style={styles.title}>TMHelper</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('TMList')}>
                <Text>TMs</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Pokedex")}>
                <Text> Pokedex</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#ffffff',
      padding: 10,
      marginVertical: 10,
      borderRadius: 5,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
  });