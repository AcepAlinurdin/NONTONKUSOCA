import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BASE_URL, API_KEY, MOVIE_POPULAR, URL_IMAGE, SEARCH_MOVIE, QUERY } from '../../config';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Adjust card width to fit within the screen

const MovieListScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${MOVIE_POPULAR}${API_KEY}`);
      setMovies(response.data.results.slice(0, 10));
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat film');
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${SEARCH_MOVIE}${API_KEY}${QUERY}${query}`);
      setMovies(response.data.results);
      setLoading(false);
    } catch (err) {
      setError('Gagal mencari film');
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      searchMovies(text);
    } else {
      fetchMovies();
    }
  };

  const handlePress = (id) => {
    router.push(`/MovieDetailScreen?id=${id}`);
  };

  const addFavorite = async (movie) => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      let favoriteMovies = existingFavorites ? JSON.parse(existingFavorites) : [];

      // Check if the movie is already in the favorites
      if (favoriteMovies.find((fav) => fav.id === movie.id)) {
        Alert.alert('Info', 'Film sudah ada dalam favorit.');
        return;
      }

      favoriteMovies.push(movie);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoriteMovies));
      Alert.alert('Sukses', 'Film ditambahkan ke favorit.');
    } catch (err) {
      Alert.alert('Error', 'Gagal menambahkan film ke favorit.');
    }
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
          <TouchableOpacity onPress={() => addFavorite(item)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Tambah ke Favorit</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Cari film..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {!searchQuery && <Text style={styles.header}>Film Teratas</Text>}
      {loading && <Text style={styles.loading}>Memuat...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={movies}
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
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
    marginBottom:10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    shadowRadius:10,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    marginBottom: 14,
  },
  card: {
    width: cardWidth,
    height: 280, // Fixed height for consistency
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    justifyContent: 'space-between', // Ensure spacing between elements
  },
  image: {
    width: '100%',
    height: 180, // Ensure image height is consistent
  },
  infoContainer: {
    padding: 8,
    flex: 1, // Ensure infoContainer takes up the remaining space
    justifyContent: 'space-between', // Space out elements evenly
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 13,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#00c0f3',
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12, // Reduced font size
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

export default MovieListScreen;
