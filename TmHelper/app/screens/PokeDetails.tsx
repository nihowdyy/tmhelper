import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Resources
import pokemonTypes from '../../assets/images/moveTypes';

// Pokemon Types
type Types =
  | 'Bug'
  | 'Dark'
  | 'Dragon'
  | 'Electric'
  | 'Fairy'
  | 'Fighting'
  | 'Fire'
  | 'Flying'
  | 'Ghost'
  | 'Grass'
  | 'Ground'
  | 'Ice'
  | 'Normal'
  | 'Poison'
  | 'Psychic'
  | 'Rock'
  | 'Steel'
  | 'Water';

const StatBar = ({ statName, statValue }: { statName: string; statValue: string }) => {
  const maxStat = 255;
  const barWidth = `${(parseInt(statValue) / maxStat) * 100}%`;

  return (
    <View style={styles.statRow}>
      <Text style={styles.statName}>{statName}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.statBar, { width: barWidth }]} />
      </View>
      <Text style={styles.statValue}>{statValue}</Text>
    </View>
  );
};

const PokeDetails = ({ route }: any) => {
  const { pokemon } = route.params;  // Retrieve the pokemon data passed through navigation

  const stats = pokemon.pokemon_info.stats;

  // Pokemon Type Component
  const DisplayPokemonTypes = ({ types }: { types: Types[] }) => {
    return (
      <View style={styles.typeContainer}>
        {types.map((type) => {
          // Access the image for each type
          const typeImage = pokemonTypes[type];

          if (!typeImage) return null; // In case the type doesn't have an image

          return (
            <View key={type} style={styles.typeRow}>
              <Image source={typeImage} style={styles.typeIcon} />
              <Text style={styles.typeText}>{type}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Extract stats excluding 'bst'
  const statEntries = Object.entries(stats).filter(([key]) => key !== 'bst');

  return (
    <View style={styles.container}>
      <Text style={styles.pokemonName}>{pokemon.pokemon_info.name}</Text>
      <DisplayPokemonTypes types={pokemon.pokemon_info.type} />
      <Text style={styles.label}>Abilities:</Text>
      <Text>{pokemon.pokemon_info.abilities.join(', ')}</Text>
      <Text style={styles.label}>Base Stats:</Text>
      {statEntries.map(([statName, statValue]) => (
        <StatBar key={statName} statName={statName} statValue={statValue} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  statName: {
    width: 80,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  barContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  statBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  statValue: {
    width: 50,
    textAlign: 'right',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
});

export default PokeDetails;
