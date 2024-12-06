import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Resources
import pokemonTypes from '../../assets/images/moveTypes';

const moveData = require('../../assets/json/LearnableMoves.json');
const pokeData = require('../../assets/json/PokedexSV.json');

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

// Define types for props
type PokemonDexEntry = {
  dex_info: {
    type: string;
    number: string;
  };
  pokemon_info: {
    name: string;
  };
};

type DisplayDexNumbersProps = {
  pokemonEntries: PokemonDexEntry[];
  targetName: string;
};

type BarProps = {
  statName: string;
  statValue: number;
  barColor: string;
  backgroundColor: string;
};

const StatBar = ({ statName, statValue, barColor, backgroundColor }: BarProps) => {
  const maxStat = 255;
  const barWidth = `${(statValue / maxStat) * 100}%`;

  const shortStat = statName.slice(0, 3)

  return (
    <View style={styles.statRow}>
      <Text style={styles.statName}>{shortStat}</Text>
      <View style={[styles.barContainer, { backgroundColor }]}>
        <View style={[styles.statBar, { width: barWidth, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.statValue}>{statValue}</Text>
    </View>
  );
};

const PokeDetails = ({ route }: any) => {
  const { pokemon } = route.params; // Retrieve the pokemon data passed through navigation

  const stats = pokemon.pokemon_info.stats;

  // Pokemon Dex Number Component
  const DisplayDexNumbers = ({ pokemonEntries, targetName }: DisplayDexNumbersProps) => {
    // Predefine region order
    const regionOrder = ['Paldea', 'Kitakami', 'Blueberry', 'National'];

    // Format the number based on region type
    const formatNumber = (type: string, number: string) => {
      const padding = type === 'National' ? 4 : 3;
      return number.padStart(padding, '0');
    };

    // Filter and sort entries
    const sortedEntries = pokemonEntries
      .filter((entry) => entry.pokemon_info.name === targetName)
      .sort(
        (a, b) =>
          regionOrder.indexOf(a.dex_info.type) - regionOrder.indexOf(b.dex_info.type)
      );

    // Create a single joined string
    const displayText = sortedEntries
      .map(
        (entry) =>
          `${entry.dex_info.type} #${formatNumber(entry.dex_info.type, entry.dex_info.number)}`
      )
      .join(', ');

    return (
      <View style={styles.dexContainer}>
        <Text style={styles.dexText}>{displayText}</Text>
      </View>
    );
  };

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

  // Pokemon Bar Colors
  const barData = [
    { statName: 'HP', barColor: '#69DC12', backgroundColor: '#9EE865' },
    { statName: 'ATK', barColor: '#EFCC18', backgroundColor: '#F5DE69' },
    { statName: 'DEF', barColor: '#E86412', backgroundColor: '#F09A65' },
    { statName: 'SPATK', barColor: '#14C3F1', backgroundColor: '#66D8F6' },
    { statName: 'SPDEF', barColor: '#4A6ADF', backgroundColor: '#899EEA' },
    { statName: 'SPEED', barColor: '#D51DAD', backgroundColor: '#E46CCA' },
  ];

  // Extract stats excluding 'bst'
  const statEntries = Object.entries(stats).filter(([key]) => key !== 'bst');

  return (
    <View style={styles.container}>
      <DisplayDexNumbers pokemonEntries={pokeData} targetName={pokemon.pokemon_info.name} />
      <Text style={styles.pokemonName}>{pokemon.pokemon_info.name}</Text>
      <DisplayPokemonTypes types={pokemon.pokemon_info.type} />
      <Text style={styles.abilityLabel}>Abilities:</Text>
      <Text>{pokemon.pokemon_info.abilities.join(', ')}</Text>
      <Text style={styles.label}>Base Stats:</Text>
      {statEntries.map(([statName, statValue], index) => (
        <StatBar
          key={statName}
          statName={statName}
          statValue={statValue as number}
          barColor={barData[index]?.barColor || '#4CAF50'}
          backgroundColor={barData[index]?.backgroundColor || '#e0e0e0'}
        />
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total:</Text>
        <Text style={styles.totalValue}>{pokemon.pokemon_info.stats.bst}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dexContainer: {
    flexDirection: 'row',
  },
  dexText: {
    fontSize: 16,
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: '500',
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
    width: 22,
    height: 22,
    marginRight: 8,
  },
  typeText: {
    fontSize: 20,
    marginRight: 8,
  },
  abilityLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 4,
  },
  label: {
    fontSize: 22,
    fontWeight: '500',
    marginVertical: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  total: {
    fontSize: 20,
    flex: 1,
    fontWeight: '500',
  },
  totalValue: {
    width: 50,
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default PokeDetails;
