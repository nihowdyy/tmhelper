import React, { useState } from 'react';
import { Platform, View, Text, StyleSheet, Image, TouchableOpacity, FlatList} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Resources
import pokemonTypes from '../../assets/images/moveTypes';

const moveData = require('../../assets/json/PokemonMoves.json');
const learnableData = require('../../assets/json/LearnableMoves.json');
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

type PokemonDexEntry = {
  dex_info: {
    type: string;
    number: string;
  };
  pokemon_info: {
    name: string;
    abilities: string[];
    type: Types[];
    stats: { [key: string]: number };
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
};

const StatBar = ({ statName, statValue, barColor }: BarProps) => {
  const maxStat = 255;
  const barWidth = `${(statValue / maxStat) * 100}%`;

  const shortStat = statName.slice(0, 3);

  return (
    <View style={styles.statRow}>
      <Text style={styles.statName}>{shortStat}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.statBar, { width: barWidth, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.statValue}>{statValue}</Text>
    </View>
  );
};

const PokeDetails = ({ route }: any) => {
  const { pokemon } = route.params; // Retrieve the pokemon data passed through navigation

  // Helper to find move details by name
  function getMoveDetails(moveName) {
    return moveData.find((move) => move.name === moveName)?.move_details || null;
  }

  // Process the learnset
  function processLearnset(pokemon) {
    const { learnset } = pokemon;

    const processCategory = (category, includeLevel = false) => {
      return learnset[category]?.map((entry) => {
        let level = null;
        let moveName = entry;

        // If level is included, extract it
        if (includeLevel && entry.includes(":")) {
          const [levelPart, namePart] = entry.split(": ").map((str) => str.trim());
          level = levelPart;
          moveName = namePart;
        }

        const moveDetails = getMoveDetails(moveName);
        return {
          move: moveName,
          ...(level !== null && { level }),
          details: moveDetails
        };
      }) || [];
    };

    return {
      level_up: processCategory("level_up", true),
      tms: processCategory("tms"),
      egg_moves: processCategory("egg_moves")
    };
  }

  // Filter data to match the current Pokémon's name
  const filteredPokeData = learnableData.filter((entry: any) => entry.name === pokemon.pokemon_info.name);

  const enrichedLearnset = processLearnset(filteredPokeData[0]);

  // Accordion Headers
  const sections = [
    { title: 'Pokemon Learnset', content: enrichedLearnset.level_up },
    { title: 'Learnable TMs', content: enrichedLearnset.tms },
    { title: 'Egg Moves', content: enrichedLearnset.egg_moves },
  ];

  // Accordion active state
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const renderHeader = (section: any, index: number, isActive: boolean) => (
    <View style={styles.learnsetHeader}>
      <Text style={styles.learnsetHeaderText}>{section.title}</Text>
      <Icon
        name={isActive ? 'expand-less' : 'expand-more'}
        size={24}
        color="#000"
      />
    </View>
  );

  const renderContent = (section: any) => (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        {section.title === 'Pokemon Learnset'? (
          <Text style={styles.columnHeader}>Level</Text>
        ) : []}
        <Text style={styles.columnHeader}>Move</Text>
        <Text style={styles.effectColumnHeader}>Effect</Text>
      </View>
      {section.content.map((item: any, index: number) => (
      <View key={index} style={styles.tableRow}>
        {section.title === 'Pokemon Learnset' ? (
          <Text style={styles.cell}>{item.level}</Text>
        ) : []}
        <Text style={styles.cell}>{item.move}</Text>
        <Text style={styles.effectCell}>{item.details.effect.full}</Text>
      </View>
      ))}
    </View>
  );

  const updateSections = (activeSections: number[]) => {
    setActiveSections(activeSections);
  };

  const stats = pokemon.pokemon_info.stats; // Specific Pokemon Base stat information

  const barData = [
    { statName: 'HP', barColor: '#69DC12' },
    { statName: 'ATK', barColor: '#EFCC18' },
    { statName: 'DEF', barColor: '#E86412' },
    { statName: 'SPATK', barColor: '#14C3F1' },
    { statName: 'SPDEF', barColor: '#4A6ADF' },
    { statName: 'SPEED', barColor: '#D51DAD' },
  ];

  // Extract stats excluding 'bst'
  const statEntries = Object.entries(stats).filter(([key]) => key !== 'bst');

  const DisplayDexNumbers = ({ pokemonEntries, targetName }: DisplayDexNumbersProps) => {
    // Predefine region order
    const regionOrder = ['Paldea', 'Kitakami', 'Blueberry', 'National'];

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
          `${entry.dex_info.type} #${entry.dex_info.number}`
      )
      .join(', ');

    return (
      <View style={styles.dexContainer}>
        <Text style={styles.dexText}>{displayText}</Text>
      </View>
    );
  };

  const DisplayPokemonTypes = ({ types }: { types: Types[] }) => {
    return (
      <View style={styles.typeContainer}>
        {types.map((type) => {
          const typeImage = pokemonTypes[type];
          if (!typeImage) return null;

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

  return (
    <View style={styles.screen}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{aspectRatio: Platform.OS === 'web' ? 1 : undefined}}
        ListHeaderComponent={
          <>
          {/* Basic Pokemon Information */}
          <DisplayDexNumbers pokemonEntries={pokeData} targetName={pokemon.pokemon_info.name} />
          <Text style={styles.pokemonName}>{pokemon.pokemon_info.name}</Text>
          <DisplayPokemonTypes types={pokemon.pokemon_info.type} />
          <Text style={styles.abilityLabel}>Abilities:</Text>
          <Text>{pokemon.pokemon_info.abilities.join(', ')}</Text>
      
          {/* Base Stat Information */}
          <Text style={styles.label}>Base Stats:</Text>
          {statEntries.map(([statName, statValue], index) => (
            <StatBar
              key={statName}
              statName={statName}
              statValue={statValue as number}
              barColor={barData[index]?.barColor || '#4CAF50'}
            />
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.total}>Total:</Text>
            <Text style={styles.totalValue}>{pokemon.pokemon_info.stats.bst}</Text>
          </View>
      
          {/* Pokemon Learnset Information */}
          {/* Accordion */}
          <Accordion
              sections={sections}
              activeSections={activeSections}
              renderHeader={renderHeader}
              renderContent={renderContent}
              onChange={updateSections}
              touchableComponent={TouchableOpacity}
            />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
    marginHorizontal: Platform.OS === 'web' ? 'auto' : 0,
    minWidth: Platform.OS === 'web' ? 800 : '100%',
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
  learnsetContainer: {
    padding: 16,
  },
  learnsetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    marginTop: 8,
  },
  learnsetHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 8,
    backgroundColor: '#e6e6e6',
    padding: 8,
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 4,
  },
  columnHeader: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  effectColumnHeader: {
    width: 180,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  cell: {
    width: 80,
    fontSize: 16,
    textAlign: 'center',
  },
  effectCell: {
    width: 180,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PokeDetails;
