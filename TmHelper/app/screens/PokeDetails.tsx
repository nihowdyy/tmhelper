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
      {/* Check if there's only one item and it's "No Egg Moves" */}
      {section.content[0].move === "No Egg Moves" ? (
        <View style={styles.tableRow}>
          <Text>No Egg Moves</Text>
        </View>
      ) : (
        <>
          <View style={styles.tableHeader}>
            {section.title === 'Pokemon Learnset' ? (
              <Text style={styles.levelHeader}>Level</Text>
            ) : null}
            <Text style={styles.columnHeader}>Move</Text>
            <Text style={styles.effectColumnHeader}>Effect</Text>
          </View>

          {section.content.map((item: any, index: number) => {
            return (
              <View key={index} style={styles.tableRow}>
                {section.title === 'Pokemon Learnset' ? (
                  <Text style={styles.levelCell}>{item.level}</Text>
                ) : null}
                <Text style={styles.cell}>{item.move}</Text>
                <Text style={styles.effectCell}>{item.details.effect.full}</Text>
              </View>
            );
          })}
        </>
      )}
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

  // Format number to our usecase
  function formatNum(num: string) {
    const integerPart = parseInt(num); // Remove decimals by rounding down
    const formattedInteger = integerPart.toString().padStart(3, '0'); // Pad the integer part to 3 digits
    return formattedInteger;
  }
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
          `${entry.dex_info.type} #${formatNum(entry.dex_info.number)}`
      )
      .join(', ');

    return (
      <View style={styles.dexContainer}>
        <Text style={styles.dexText}>{displayText}</Text>
      </View>
    );
  };

  const DisplayAbilities = ( { abilities } : {abilities: string[]} ) => {
    return (
      <View style = {styles.abilitiesRow}>
        {abilities.map((ability, index) => {
          return (
            <View key={ability} style = {styles.abilityContainer}>
              <Text style={styles.abilityText}>{ability}</Text>
            </View>
          );
        })}

      </View>
    );
  };

  const DisplayPokemonTypes = ({ types }: { types: Types[] }) => {
    return (
      <View style={styles.typeContainer}>
        {types.map((type, index) => {
          const typeImage = pokemonTypes[type];
          if (!typeImage) return null;
  
          return (
            <View key={type} style={styles.typeRow}>
              <Image source={typeImage} style={styles.typeIcon} />
              <Text style={styles.typeText}>{type}</Text>
              {/* Add separator if this is not the last type */}
              {index < types.length - 1 && <View style={styles.separator} />}
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
          <Text style={styles.subtitle}>ABILITIES</Text>
          <DisplayAbilities abilities={pokemon.pokemon_info.abilities} />
      
          {/* Base Stat Information */}
          <Text style={styles.subtitle}>BASESTATS</Text>
          <View style={styles.bstTable}>
            {statEntries.map(([statName, statValue], index) => (
              <StatBar
                key={statName}
                statName={statName}
                statValue={statValue as number}
                barColor={barData[index]?.barColor || '#4CAF50'}
              />
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.total}>TOTAL</Text>
              <Text style={styles.statValue}>{pokemon.pokemon_info.stats.bst}</Text>
            </View>
          </View>
          {/* Pokemon Learnset Information */}
          <View>
            <Text style={styles.subtitle}>POKEMON MOVES</Text>
            {/* Accordion */}
            <Accordion
                sections={sections}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={updateSections}
                touchableComponent={TouchableOpacity}
              />
          </View>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7f7f7',
    marginHorizontal: Platform.OS === 'web' ? 'auto' : 0,
    minWidth: Platform.OS === 'web' ? 800 : '100%',
  },
  dexContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  dexText: {
    fontSize: 16,
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: '500',
    paddingVertical: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 8,
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
    marginRight: 4,
  },
  separator: {
    width: 1, 
    backgroundColor: '#9099A1', 
    height: 21,
    marginHorizontal: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 12,
    marginLeft: 8,
  },
  abilitiesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  abilityContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: 'regular',
  },
  bstTable: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  statName: {
    width: 52,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  barContainer: {
    flex: 1,
    backgroundColor: '#d3d3d3',
    height: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
  },
  statValue: {
    width: 40,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  total: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  learnsetContainer: {
    padding: 16,
  },
  learnsetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginTop: 8,
  },
  learnsetHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderTopColor: '#DDDDDD',
    borderTopWidth: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  levelHeader: {
    width: '15%',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  levelCell: {
    width: '15%',
    fontSize: 16,
    textAlign: 'center',
  },
  columnHeader: {
    width: '35%',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    width: '35%',
    fontSize: 16,
    textAlign: 'center',
  },
  effectColumnHeader: {
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  effectCell: {
    width: '50%',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PokeDetails;
