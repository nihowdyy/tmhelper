import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, Modal } from 'react-native';
import locationMappings from '../../assets/json/imageMap.json';

const TMDetailScreen = ({ route }: any) => {
  const { tm } = route.params;
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Extract properties from tm
  const { materials } = tm.tm_info;

  // Get the list of Pokémon names from materials
  const materialsPokemonNames = materials.map((material: { pokemon_name: string; }) => material.pokemon_name);

  // Filter locationMappings based on the Pokémon names in materialsPokemonNames
  const filteredMappings = Object.entries(locationMappings).filter(([pokemonName]) =>
    materialsPokemonNames.includes(pokemonName)
  );

  const openImage = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{tm.tm_info.name} (TM {tm.tm_info.number})</Text>
      <Text style={styles.subtitle}>Location:</Text>
      {tm.tm_info.location.map((loc: string, index: number) => (
        <Text key={index} style={styles.text}>{loc}</Text>
      ))}
      <Text style={styles.subtitle}>LP Cost: {tm.tm_info.lp_cost}</Text>
      <Text style={styles.subtitle}>Sell Price: {tm.tm_info.sell_price}</Text>
      <Text style={styles.subtitle}>Materials:</Text>
      {tm.tm_info.materials.map((material: any, index: number) => (
        <Text key={index} style={styles.text}>
          {material.quantity} x {material.material_name}
        </Text>
      ))}
      <Text style={styles.subtitle}>Move Info:</Text>
      <Text style={styles.text}>Type: {tm.move_info.type}</Text>
      <Text style={styles.text}>Category: {tm.move_info.category}</Text>
      <Text style={styles.text}>Power: {tm.move_info.power}</Text>
      <Text style={styles.text}>Accuracy: {tm.move_info.accuracy}</Text>
      <Text style={styles.text}>PP: {tm.move_info.pp}</Text>

      {/* Display images for filtered Pokémon */}
      <Text style={styles.subtitle}>Pokémon Images:</Text>
      {filteredMappings.map(([pokemonName, imagePaths], index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.pokemonName}>{pokemonName}</Text>
          {imagePaths.map((path, i) => (
            <Pressable key={i} onPress={() => openImage(`../../assets/images/${path}`)}>
              <Image
                source={{ uri: `../../assets/images/${path}` }} // Adjust path based on your project structure
                style={styles.image}
              />
            </Pressable>
          ))}
        </View>
      ))}

      {/* Fullscreen image modal */}
      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} onRequestClose={closeImage}>
          <View style={styles.modalBackground}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
              resizeMode='contain'
            />
            <Pressable style={styles.closeButton} onPress={closeImage}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </ScrollView>
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
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  item: {
    marginBottom: 20,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '10%', // Adjust size as needed
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
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
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TMDetailScreen;
