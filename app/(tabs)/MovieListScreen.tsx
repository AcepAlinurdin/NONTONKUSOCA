import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-snap-carousel'
import { BASE_URL, API_KEY, MOVIE_POPULAR, URL_IMAGE } from '../../config';

const { width } = Dimensions.get('window');
const itemWidth = Math.round(width * 0.7);
const itemHeight = Math.round(itemWidth * 1.5); // Adjusted for better image aspect ratio

const MovieListScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
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

  const handlePress = (id) => {
    router.push(`/MovieDetailScreen?id=${id}`);
  };

  const renderItem = ({ item, index }) => {
    const isActive = index === activeIndex;

    return (
      <TouchableOpacity onPress={() => handlePress(item.id)} style={[styles.card, isActive && styles.activeCard]}>
        <Image source={{ uri: `${URL_IMAGE}${item.poster_path}` }} style={[styles.image, isActive && styles.activeImage]} />
        <Text style={[styles.title, isActive && styles.activeTitle]}>{item.title}</Text>
        <Text style={[styles.rating, isActive && styles.activeRating]}>Rating: {item.vote_average}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NONTONKUSOCA</Text>
      {loading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Carousel
          data={movies}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={itemWidth}
          onSnapToItem={(index) => setActiveIndex(index)}
          inactiveSlideScale={0.8}
          inactiveSlideOpacity={0.7}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3d3d3',
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 30,
    color: '#000000',
    marginLeft: 20,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  activeCard: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: itemWidth - 25,
    height: itemHeight - 25,
    borderRadius: 8,
    marginBottom: 8,
  },
  activeImage: {
    width: itemWidth - 25,
    height: itemHeight - 25,
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTitle: {
    fontSize: 18,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  activeRating: {
    fontSize: 14,
    color: '#000',
  },
});

export default MovieListScreen;
