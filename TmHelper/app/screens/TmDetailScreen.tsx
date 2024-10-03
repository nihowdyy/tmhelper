import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal} from 'react-native';
import DropdownPicker from 'react-native-dropdown-picker'

// Importing Assets
import pokemonLocations from '../../assets/images/pokemonLocations';
import moveTypes from '../../assets/images/moveTypes';
import moveCategories from '../../assets/images/moveCategories';
import pokemonImages from '../../assets/images/pokemonImages';

// Icons
const LPIcon = require('../../assets/images/LP Icon.png');
const leftArrow = require('../../assets/images/leftArrow.png');
const rightArrow = require('../../assets/images/rightArrow.png');
const BBIcon = require('../../assets/images/blueberry.png');
const PaldeaIcon = require('../../assets/images/pokeball.png');
const KitakamiIcon = require('../../assets/images/kitakami.png');

const TMDetailScreen = ({ route }: any) => {
  const { tm } = route.params;

  // Extract properties from tm
  const { materials } = tm.tm_info;

  // Move Types
  type MoveType =
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

  // Move Categories
  type MoveCategory =
    | 'Physical'
    | 'Special'
    | 'Status';

  // Move Type and Category Images
  const moveTypeImage = moveTypes[tm.move_info.type as MoveType];
  const moveCategoryImage = moveCategories[tm.move_info.category as MoveCategory];

  // Handling Full Screen Images
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Track current image index for each Pokémon
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});

  // Track the selected Pokémon material in the dropdown
  const [selectedPokemon, setSelectedPokemon] = useState(materials[0].pokemon_name);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Function to change the image index (for left/right arrows)
  const changeImageIndex = (pokemonName: string, direction: 'left' | 'right') => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[pokemonName] || 0;
      const totalImages = pokemonLocations[pokemonName]?.length || 1;
      let newIndex = currentIndex;

      if (direction === 'left') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
      } else {
        newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
      }

      return { ...prevIndexes, [pokemonName]: newIndex };
    });
  };

  // Get Map Name from Source
  const getMapNameFromSource = (pokemonName: string, currentImage?: number) => {
    // Check if currentImage is undefined or if the location doesn't exist
    if (typeof currentImage === 'undefined' || !pokemonLocations[pokemonName] || !pokemonLocations[pokemonName][currentImage]) {
      return ["Location Not Found", PaldeaIcon];
    }
  
    // If location exists, retrieve the current image
    const currentLocationImage = pokemonLocations[pokemonName][currentImage];
    const fileName = currentLocationImage.name; // Assuming the file has a 'name' property
  
    // Check if the fileName contains specific keywords
    if (fileName.includes("Indigo Disk")) {
      return ["Blueberry Map", BBIcon];
    } else if (fileName.includes("Teal Mask")) {
      return ["Kitakami Map", KitakamiIcon];
    }
  
    // Default case: location exists but doesn't match any specific names
    return ["Paldea Map", PaldeaIcon];
  };

  // Get images and locations for the selected Pokémon
  const selectedPokemonImages = pokemonLocations[selectedPokemon] || [];
  const currentImageIndex = imageIndexes[selectedPokemon] || 0;
  const currentImageData = selectedPokemonImages[currentImageIndex] || pokemonLocations["None"][0];
  const [currentMap, mapIcon] = getMapNameFromSource(selectedPokemon, currentImageIndex);

  // Determine whether to show the navigation buttons
  const showNavigationButtons = selectedPokemonImages.length > 1;

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text>TM {tm.tm_info.number}</Text>
            <Text style={styles.title}>{tm.tm_info.name}</Text>

            <View style={styles.imageContainer}>
              <Image source={moveTypeImage} style={styles.moveType} resizeMode="contain" />
              <Text style={styles.moveIconLabel}>{tm.move_info.type}</Text>
              <Image source={moveCategoryImage} style={styles.moveCategory} resizeMode="contain" />
              <Text style={styles.moveIconLabel}>{tm.move_info.category}</Text>
            </View>

            <Text style={styles.tmDescHeader}>Description</Text>
            <Text style={styles.tmDescription}>{tm.tm_info.description}</Text>

            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.headerCell}>Power</Text>
                <Text style={styles.headerCell}>Accuracy</Text>
                <Text style={styles.headerCell}>PP</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>{tm.move_info.power === 'None' ? '——' : tm.move_info.power}</Text>
                <Text style={styles.cell}>{tm.move_info.accuracy === 'Cannot Miss' ? '——%' : `${tm.move_info.accuracy}%`}</Text>
                <Text style={styles.cell}>{tm.move_info.pp}</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Required Resources</Text>

            <View style={styles.row}>
              <Image source={LPIcon} style={styles.pokemonImage} resizeMode="contain" />
              <Text style={styles.text}>League Points</Text>
              <Text style={styles.quantityText}>{tm.tm_info.lp_cost}</Text>
            </View>

            {/* List all Pokémon materials */}
            {materials.map((material: any, index: number) => {
              const pokemonImage = pokemonImages[material.pokemon_name];
              return (
                <View key={index} style={styles.row}>
                  <Image
                    source={pokemonImage || pokemonImages['None']}
                    style={styles.pokemonImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.text}>{material.material_name}</Text>
                  <Text style={styles.quantityText}>{material.quantity}</Text>
                </View>
              );
            })}

            <Text style={styles.subtitle}>Pokemon Material Map </Text>
            {/* Picker to select the Pokémon Material*/}
            <DropdownPicker
              open={openDropdown}
              value={selectedPokemon}
              items={materials.map(material => ({
                  label: material.material_name,
                  value: material.pokemon_name,
                  icon: () => (
                    <Image
                      source={pokemonImages[material.pokemon_name]}
                      style={styles.pokemonImage}
                      resizeMode="contain"
                    />
                  ),
              }))}
              setOpen={setOpenDropdown}
              setValue={setSelectedPokemon}
              containerStyle={{ height: 60 }} // Style to maintain consistent height
              style={styles.picker}
              labelStyle={styles.dropdownLabel}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Map Display*/}
            <Pressable onPress={() => openImage(currentImageData.image)} style={styles.imageWrapper}>
              <Image source={currentImageData.image} style={styles.image} />
            </Pressable>

            {/* Map Navigation and Label */}
           <View style={styles.imageNavigator}>
              {showNavigationButtons && 
                <Pressable 
                onPress={() => changeImageIndex(selectedPokemon, 'left')} style={styles.leftArrowButton}>
                  <Image source={leftArrow} style={styles.arrow} />
                </Pressable>}

              <Text style={styles.mapText}>{currentMap}</Text>
              <Image source={mapIcon} style={styles.mapIcon} />

              {showNavigationButtons && 
                <Pressable 
                onPress={() => changeImageIndex(selectedPokemon, 'right')} style={styles.rightArrowButton}>
                  <Image source={rightArrow} style={styles.arrow} />
                </Pressable>}
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 100 }} // Ensure there's padding at the bottom if needed
      />

      {/* Fullscreen image modal */}
      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} onRequestClose={closeImage}>
          <Pressable style={styles.modalBackground} onPress={closeImage}>
            <Image source={selectedImage} style={styles.fullscreenImage} />
          </Pressable>
        </Modal>
      )}
    </View>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    textAlign: 'right',
  },
  resourcesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    
  },
  item: {
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    alignItems: 'center',
    borderRadius: 10,
  },
  imageWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveCategory: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginRight: 5,
  },
  moveType: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  moveIconLabel: {
    fontSize: 18,
  },
  table: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    flex: 1,
    textAlign: 'center',
    padding: 5,
  },
  cell: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginBottom: 5, 
  },
  pokemonImage: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  arrow: {
    marginHorizontal: 10,
  },
  leftArrowButton: {
    paddingLeft: 20,
  },
  rightArrowButton: {
    paddingRight: 30,
  },
  imageNavigator: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 130,
  },
  mapIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    paddingVertical: 0,
  },
  dropdownLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#eee',
},
  icon: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: 10, // Adjust as necessary for padding
    transform: [{ translateY: +15 }], // Adjust for your icon's height
  },
  tmDescription: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 10,
  },
  tmDescHeader: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    marginTop: 10,
  }
});


export default TMDetailScreen;
