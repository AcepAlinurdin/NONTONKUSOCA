import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { BASE_URL, API_KEY, URL_IMAGE } from '../config';

const { width } = Dimensions.get('window');

const MovieDetailScreen = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const route = useRoute();
  const movieId = route.params?.id; // Mendapatkan ID dari parameter rute

  useEffect(() => {
    if (movieId) {
      fetchMovieDetail(movieId);
      checkIfFavorite(movieId);
    }
  }, [movieId]);

  const fetchMovieDetail = async (movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}movie/${movieId}?${API_KEY}`);
      setMovie(response.data);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat detail film');
      setLoading(false);
    }
  };

  const checkIfFavorite = async (movieId) => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoriteMovies = JSON.parse(favorites);
        const isFav = favoriteMovies.some((movie) => movie.id === movieId);
        setIsFavorite(isFav);
      }
    } catch (err) {
      console.error('Gagal memeriksa favorit', err);
    }
  };

  const toggleFavorite = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      const favoriteMovies = existingFavorites ? JSON.parse(existingFavorites) : [];

      if (isFavorite) {
        // Hapus dari favorit
        const updatedFavorites = favoriteMovies.filter((movie) => movie.id !== movieId);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        Alert.alert('Berhasil', 'Film dihapus dari favorit');
      } else {
        // Tambahkan ke favorit
        const movieDetails = await axios.get(`${BASE_URL}movie/${movieId}?${API_KEY}`);
        favoriteMovies.push(movieDetails.data);
        await AsyncStorage.setItem('favorites', JSON.stringify(favoriteMovies));
        setIsFavorite(true);
        Alert.alert('Berhasil', 'Film ditambahkan ke favorit');
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal memperbarui daftar favorit.');
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Memuat...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {movie && (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${URL_IMAGE}${movie.poster_path}` }}
              style={styles.image}
            />
            <Text style={styles.title}>{movie.title}</Text>
          </View>
          <View style={styles.genreBox}>
            <Text style={styles.genreText}>
              {movie.genres.map(genre => genre.name).join(', ')}
            </Text>
          </View>
          <View style={styles.detailsBox}>
            <Text style={styles.releaseDate}>Tanggal Rilis: {movie.release_date}</Text>
            <Text style={styles.runtime}>Durasi: {movie.runtime} menit</Text>
            <Text style={styles.genres}>
              Genre: {movie.genres.map(genre => genre.name).join(', ')}
            </Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            {/* <Text style={styles.favoriteButtonText}>
              {isFavorite ? 'Hapus dari Favorit' : 'Tambahkan ke Favorit'}
            </Text> */}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#1d1d1d',
  },
  imageContainer: {
    position: 'relative',
    width: width - 32,
    height: 300,
    marginBottom: 16,
    marginTop:30,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  title: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  genreBox: {
    alignSelf: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: width - 32,
  },
  genreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  detailsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: width - 32,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  releaseDate: {
    fontSize: 16,
    marginBottom: 8,
  },
  runtime: {
    fontSize: 16,
    marginBottom: 8,
  },
  genres: {
    fontSize: 16,
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    color: '#333',
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
  favoriteButton: {
    backgroundColor: '#1d1d1d',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MovieDetailScreen;
