import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import pokemonImages from '../../assets/images/pokemonImages';

const TMDetailScreen = ({ route }: any) => {
  const { tm } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Extract properties from tm
  const { materials } = tm.tm_info;

  // Get the list of Pokémon names from materials
  const materialsPokemonNames = materials.map((material: { pokemon_name: string; }) => material.pokemon_name);

  // Access images for each Pokémon name
  const pokemonImagesToDisplay = materialsPokemonNames.map((pokemonName: string) => {
    return {
      name: pokemonName,
      images: pokemonImages[pokemonName] || [], // Access images or return an empty array
    };
  });

  const openImage = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Render item function for FlatList
  const renderItem = ({ item }: { item: { name: string; images: string[] } }) => (
    <View style={styles.item}>
      <Text style={styles.pokemonName}>{item.name} Images:</Text>
      {item.images.length > 0 ? (
        item.images.map((image, i) => (
          <Pressable key={i} onPress={() => openImage(image)}>
            <Image source={image} style={styles.image} />
          </Pressable>
        ))
      ) : (
        <Text>No images available</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonImagesToDisplay}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
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
          </>
        }
        contentContainerStyle={{ paddingBottom: 100 }} // Ensure there's padding at the bottom if needed
      />

      {/* Fullscreen image modal */}
      {selectedImage && (
        <Modal visible={modalVisible} transparent={true} onRequestClose={closeImage}>
          <Pressable style={styles.modalBackground} onPress={closeImage}>
            <Image
              source={selectedImage}
              style={styles.fullscreenImage}
            />
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
    width: '30%', // Adjust size as needed
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
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
});

export default TMDetailScreen;
