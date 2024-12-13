import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Platform, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const pokeData = require('../../assets/json/PokedexSV.json');

import pokemonImages from '../../assets/images/pokemonImages';

// Pokemon Data Information
interface PokeData {
  dex_info: {
    type: string;
    number: string;
  };
  pokemon_info: {
    name: string;
    type: string[];
    abilities: string[];
    basic_stage: string[];
    stats: {
      hp: string;
      atk: string;
      def: string;
      spatk: string;
      spdef: string;
      speed: string;
      bst: string;
    };
  };
}

const data: PokeData[] = pokeData as PokeData[];

function formatNum(num: any) {
    const integerPart = Math.floor(num); // Remove decimals by rounding down
    const formattedInteger = integerPart.toString().padStart(3, '0'); // Pad the integer part to 3 digits
    return formattedInteger;
}

// List Pokemon Information (Simple)
const RenderItem = React.memo(({ item, onPress }: { item: PokeData; onPress: (item: PokeData) => void }) => {
  return (
    <Pressable onPress={() => onPress(item)}>
      <View>
        <Text style={styles.dexNumber}>#{formatNum(item.dex_info.number)}</Text>
        <View style={styles.row}>
            <View style={styles.textContainer}>
                <Text style={styles.pokemonName}>{item.pokemon_info.name}</Text>
            </View>
            <View style={styles.imageContainer}>
                <Image source={pokemonImages[item.pokemon_info.name]} style={styles.pokemonImage} />
            </View>
        </View>
      </View>
    </Pressable>
  );
});

const Pokedex = ({ navigation }: any) => {
    const [activeButton, setActiveButton] = useState<string | null>('paldean');
    const [filteredData, setFilteredData] = useState<PokeData[]>(data.filter(item => item.dex_info.type.toLowerCase() === 'paldean'));
    const [query, setQuery] = useState('');

    // Icon Definition
    type ButtonNames = 'paldean' | 'blueberry' | 'kitakami' | 'national';

    const icons: Record<ButtonNames, any> = {
        paldean: require('../../assets/images/pokeball.png'),
        blueberry: require('../../assets/images/blueberry.png'),
        kitakami: require('../../assets/images/kitakami.png'),
        national: require('../../assets/images/premierball.png'),
    };

    // Handling Navigation Errors
    const handlePress = React.useCallback((pokemon: PokeData) => {
        try {
        navigation.navigate('PokeDetails', { pokemon });
        } catch (error) {
        console.error('Navigation error:', error);
        }
    }, [navigation]);

    // Function to clear search
    const clearSearch = () => {
        setQuery('');
        setFilteredData(data.filter(item => item.dex_info.type.toLowerCase() === activeButton));
    };

    // Function to handle region button press
    const handleButtonPress = (buttonName: string) => {
        setActiveButton(buttonName);
        handleRegionFilter(buttonName);
        setQuery('');
    };

    // Function to filter based on selected region
    const handleRegionFilter = (region: string) => {
        const newData = data.filter(item => item.dex_info.type.toLowerCase() === region.toLowerCase());
        setFilteredData(newData);
    };

    // Function to search by text
    const handleSearch = (text: string) => {
        setQuery(text);
        if (text.trim() === '') {
            handleRegionFilter(activeButton || 'paldean');  // Reset to region filter if search is empty
            return;
        }
        const searchTerms = text.toLowerCase().split(' ').filter(term => term.length > 0);
        const newData = data.filter(item => 
            // Check if it matches the selected region
            item.dex_info.type.toLowerCase() === activeButton && 
            searchTerms.every(term => {
                const normalizedName = item.pokemon_info.name.toLowerCase();
                const normalizedTypes = item.pokemon_info.type
                    .map((type: string) => type.toLowerCase().trim()); // Normalize type list
                const normalizedAbilities = item.pokemon_info.abilities
                    .map((ability: string) => ability.toLowerCase().trim()); // Normalize abilities list
                const number = item.dex_info.number;
                
                // check if search terms match the name, number, any type, or any ability
                return (
                    normalizedName.includes(term) ||
                    normalizedTypes.includes(term) ||
                    normalizedAbilities.some(ability => ability.includes(term)) || 
                    number.includes(term)
                );
            })
        );
        setFilteredData(newData);
    };

    // Button rendering logic
    const renderButton = (buttonName: ButtonNames, label: string) => (
        <Pressable onPress={() => handleButtonPress(buttonName)} style={styles.button}>
            {activeButton === buttonName ? (
                <View style={styles.buttonWrapper}>
                    <Text style={styles.activeText}>{label}</Text>
                    <Image source={icons[buttonName]} style={styles.icon} />
                </View>
            ) : (
                <View style={styles.buttonWrapper}>
                    <Text style={styles.inactiveText}>{label}</Text>
                    <View style={styles.imageWrapper}>
                        <Image source={icons[buttonName]} style={[styles.icon, { tintColor: 'gray' }]} />
                        <Image source={icons[buttonName]} style={[styles.icon, { position: 'absolute', opacity: 0.5 }]} />
                    </View>
                </View>
            )}
        </Pressable>
    );


    return (
        <View style={styles.screen}>
        <View style={styles.screenContainer}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
                <TextInput
                style={styles.searchInput}
                placeholder="Search by Name, Number, Type, or Ability"
                placeholderTextColor="#aaa"
                value={query}
                onChangeText={handleSearch}
                autoCorrect={false}
                />
                {query.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <Icon name="times-circle" size={20} color="#888"/>
                </TouchableOpacity>
                )}
            </View>
            {/* Pokedex Selection Buttons */}
            <View style={styles.navigationContainer}>
            {renderButton('paldean', 'Paldea')}
            {renderButton('kitakami', 'Kitakami')}
            {renderButton('blueberry', 'Blueberry')}
            {renderButton('national', 'National')}
            </View>

            <FlatList
            data={filteredData}
            renderItem={({ item }) => <RenderItem item={item} onPress={handlePress} />}
            keyExtractor={(item) => `${item.dex_info.type}-${item.dex_info.number}-${item.pokemon_info.name}`}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ aspectRatio: Platform.OS === 'web' ? 1 : undefined }}
            style={styles.flatlist}
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingBottom: 16,
    },
    screenContainer: {
        flex: 1,
        padding: Platform.OS === 'web' ? 16 : 0,
        backgroundColor: '#FAFAFA',
        marginHorizontal: Platform.OS === 'web' ? 'auto' : 0,
        minWidth: Platform.OS === 'web' ? 800 : '100%',
        paddingBottom: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F2F2F2',
        borderColor: '#eeeeee',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
    },
    searchIcon: {
        color:  '#000000'
    },
    clearButton: {
        marginLeft: 10,
        padding: 5,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16,
    },
    button: {
        alignItems: 'center',
    },
    buttonWrapper: {
        marginHorizontal: 8,
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
    },
    imageWrapper: {
        position: 'relative',
        width: 40,
        height: 40,
    },
    activeText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        width: 80,
        textAlign: 'center',
    },
    inactiveText: {
        fontSize: 16,
        color: 'gray',
        width: 80,
        textAlign: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: '95%',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dexNumber: {
        fontSize: 16,
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        width: '95%',
        paddingTop: 8,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',  // Align the image to the right
    },
    pokemonImage: {
        height: 32,
        width: 32,
        resizeMode: 'contain',
    },
    pokemonName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    flatlist: {
        flexGrow: 1,
    },
});

export default Pokedex;
