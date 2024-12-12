import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const DonutIcon = () => <Icon name="donut-large" size={30} color="black" />;
const CalculatorIcon = () => <Icon name="calculate" size={30} color="black" />;

export default function LandingPage({ navigation }: any) {
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>ROTODEX</Text>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('TMList')}>
              <View style={styles.buttonRow}>
                <Text style={styles.buttonText}>TMs</Text>
                <Icon name="vinyl" size={20}></Icon>
              </View>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate("Pokedex")}>
              <View style={styles.buttonRow}>
                <Text style={styles.buttonText}>Pokedex</Text>
                <Icon name="calculator" size={20}></Icon>
              </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7f7f7',
    marginHorizontal: Platform.OS === 'web' ? 'auto' : 0,
    minWidth: Platform.OS === 'web' ? 800 : '100%',
  },
  title: {
    fontSize: 14,
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 5,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});