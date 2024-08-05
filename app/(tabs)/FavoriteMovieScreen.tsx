import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { URL_IMAGE } from '../../config';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const FavoriteMoviesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      if (existingFavorites) {
        setFavorites(JSON.parse(existingFavorites));
      }
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat film favorit');
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      let favoriteMovies = existingFavorites ? JSON.parse(existingFavorites) : [];

      favoriteMovies = favoriteMovies.filter((movie) => movie.id !== id);

      await AsyncStorage.setItem('favorites', JSON.stringify(favoriteMovies));
      setFavorites(favoriteMovies);
      Alert.alert('Sukses', 'Film dihapus dari favorit.');
    } catch (err) {
      Alert.alert('Error', 'Gagal menghapus film dari favorit.');
    }
  };

  const handlePress = (id) => {
    router.push(`/MovieDetailScreen?id=${id}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.card}>
        <Image
          source={{ uri: `${URL_IMAGE}${item.poster_path}` }}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.rating}>Rating: {item.vote_average}</Text>
        </View>
        <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Hapus dari Favorit</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Film Favorit Anda</Text>
      {loading && <Text style={styles.loading}>Memuat...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom:10,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: 14,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#ff5c5c',
  
    paddingVertical: 8,
    
    alignItems: 'center',
    
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoriteMoviesScreen;
