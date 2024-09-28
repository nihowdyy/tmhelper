import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
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
const KitakamiIcon = require('../../assets/images/kitakami.png')

const TMDetailScreen = ({ route }: any) => {
  const { tm } = route.params;

  // Extract properties from tm
  const { materials } = tm.tm_info;

  // Get the list of Pokémon names from materials
  const materialsPokemonNames = materials.map((material: { pokemon_name: string }) => material.pokemon_name);

  // Access images for each Pokémon name
  const pokemonImagesToDisplay = materialsPokemonNames.map((pokemonName: string) => {
    return {
      name: pokemonName,
      locationImages: pokemonLocations[pokemonName] || [], // Access images or return an empty array
    };
  });

  
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
  const getMapNameFromSource = (item: { name: string; locationImages: { name: string, image: any }[] }, currentImage: number) => {
    // Check the file name in locationImages for specific keywords
    const currentLocationImage = item.locationImages[currentImage];

    if (currentLocationImage) {
      const fileName = currentLocationImage.name; // Assuming the name contains the file name

      if (fileName.includes("Indigo Disk")) {
        return ["Blueberry Map", BBIcon];
      } else if (fileName.includes("Teal Mask")) {
        return ["Kitakami Map", KitakamiIcon];
      }
    }

    return ["Paldean Map", PaldeaIcon]; // Default return value
  };

  // Render item function for FlatList
  const renderItem = ({ item }: { item: { name: string; locationImages: { name: string, image: any }[] } }) => {
    const currentImageIndex = imageIndexes[item.name] || 0;
    const currentImageData = item.locationImages[currentImageIndex] || { image: pokemonLocations["None"][0] }; // Access image data
    const currentImage = currentImageData.image;
    const [currentMap, mapIcon] = getMapNameFromSource(item, currentImageIndex);

    // Check if there is more than one location image
    const hasMultipleImages = item.locationImages.length > 1;

    return (
      <View style={styles.item}>
        <Text style={styles.pokemonName}>{item.name} Locations:</Text>
        <Pressable onPress={() => openImage(currentImage)} style={styles.imageWrapper}>
            <Image source={currentImage} style={styles.image} />
        </Pressable>
        
        <View style={styles.imageNavigator}>
        {hasMultipleImages && (
          <Pressable onPress={() => changeImageIndex(item.name, 'left')} style={styles.leftArrowButton}>
            <Image source={leftArrow} style={styles.arrow} />
          </Pressable>
        )}

        <Text style={styles.mapText}>{currentMap}</Text>
        <Image source={mapIcon} style={styles.mapIcon} />

        {hasMultipleImages && (
          <Pressable onPress={() => changeImageIndex(item.name, 'right')} style={styles.rightArrowButton}>
            <Image source={rightArrow} style={styles.arrow} />
          </Pressable>
        )}
      </View>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonImagesToDisplay}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text>TM {tm.tm_info.number}</Text>
            <Text style={styles.title}>{tm.tm_info.name}</Text>

            <View style={styles.imageContainer}>
              <Image source={moveTypeImage} style={styles.moveType} resizeMode="contain" />
              <Text>{tm.move_info.type}</Text>
              <Image source={moveCategoryImage} style={styles.moveCategory} resizeMode="contain" />
              <Text>{tm.move_info.category}</Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.headerCell}>Power</Text>
                <Text style={styles.headerCell}>Accuracy</Text>
                <Text style={styles.headerCell}>PP</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>{tm.move_info.power}</Text>
                <Text style={styles.cell}>{tm.move_info.accuracy}</Text>
                <Text style={styles.cell}>{tm.move_info.pp}</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Required Resources</Text>

            <View style={styles.row}>
              <Image source={LPIcon} style={styles.pokemonImage} resizeMode="contain" />
              <Text style={styles.text}>League Points</Text>
              <Text style={styles.quantityText}>{tm.tm_info.lp_cost}</Text>
            </View>
            {tm.tm_info.materials.map((material: any, index: number) => {
              const pokemonImage = pokemonImages[material.pokemon_name]; // Image for the Pokémon

              return (
                <View key={index} style={styles.row}>
                  <Image
                    source={pokemonImage || pokemonImages['None']} // Replace with default image if not found
                    style={styles.pokemonImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.text}>{material.material_name}</Text>
                  <Text style={styles.quantityText}>{material.quantity}</Text>
                </View>
              );
            })}
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
    marginBottom: 5,
    fontWeight: 'bold',
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
  table: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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
  },
  cell: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  pokemonImage: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  quantityText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'right',
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
    marginVertical: 10,
  },
  mapIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
  }
});

export default TMDetailScreen;
