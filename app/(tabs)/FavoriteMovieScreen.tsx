import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { URL_IMAGE } from '../../config';

const { width } = Dimensions.get('window');
const cardWidth = (width -30) / 1;

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
          <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Hapus dari Favorit</Text>
          </TouchableOpacity>
        </View>
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
        // numColumns={2}
        // columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#192931',
    flex: 1,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: 14,
  },
  card: {
    width: cardWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    flexDirection: 'row', // Mengatur agar konten di dalam card dalam satu baris
  },
  image: {
    width: '40%', // Atur lebar gambar sesuai kebutuhan
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  infoContainer: {
    width: '60%', // Atur lebar kontainer informasi sesuai kebutuhan
    padding: 8,
    justifyContent: 'center', // Agar konten di tengah secara vertikal
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 50,
    marginBottom:-10,
    padding:5,
    borderRadius:5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#FFFFFF',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoriteMoviesScreen;
