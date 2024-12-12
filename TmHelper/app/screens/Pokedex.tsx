import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Platform, Image } from 'react-native';

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

function formatNum(num) {
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
    const [filteredData, setFilteredData] = useState<PokeData[]>(
        data.filter(item => item.dex_info.type.toLowerCase() === 'paldean')
    ); 

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

    const handleButtonPress = (buttonName: string) => {
        setActiveButton(buttonName);
        handleSearch(buttonName);
    };

    // Filter based on the selected region (query)
    const handleSearch = (text: string) => {
        // If the search query is empty, reset filteredData to the original data
        if (text.trim() === '') {
            setFilteredData(data);
            return;
        }

        // Filter the data based on the selected region (query)
        const newData = data.filter(item => {
            const normalizedType = item.dex_info.type.toLowerCase();
            return normalizedType === text.toLowerCase();
        });

        setFilteredData(newData);
    };

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
