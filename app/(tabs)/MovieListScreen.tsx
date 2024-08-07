import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-snap-carousel';
import { BASE_URL, API_KEY, MOVIE_POPULAR, URL_IMAGE } from '../../config';

const { width } = Dimensions.get('window');
const itemWidth = Math.round(width * 0.7);
const itemHeight = Math.round(itemWidth * 1.5); // Adjusted for better image aspect ratio

const MovieListScreen = () => {
  const [movies, setMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [animatedMovies, setAnimatedMovies] = useState([]); // State for animated movies
  const [latestMovies, setLatestMovies] = useState([]); // State for latest 2024 movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
    fetchComedyMovies();
    fetchAnimatedMovies(); // Fetch animated movies
    fetchLatestMovies(); // Fetch latest 2024 movies
  }, []);

  const fetchMovies = async () => {
    try {
      const url = `${BASE_URL}${MOVIE_POPULAR}${API_KEY}`;
      const response = await axios.get(url);
      setMovies(response.data.results.slice(0, 10));
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat film');
      setLoading(false);
    }
  };

  const fetchGenreId = async (genreName) => {
    try {
      const response = await axios.get(`${BASE_URL}genre/movie/list?${API_KEY}`);
      const genre = response.data.genres.find(genre => genre.name === genreName);
      return genre ? genre.id : null;
    } catch (err) {
      setError('Gagal memuat genre film');
      return null;
    }
  };

  const fetchComedyMovies = async () => {
    try {
      const genreId = await fetchGenreId('Comedy');
      if (genreId) {
        const response = await axios.get(`${BASE_URL}discover/movie?${API_KEY}&with_genres=${genreId}`);
        setComedyMovies(response.data.results.slice(0, 10));
      } else {
        setError('Genre Comedy tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal memuat film genre Comedy');
    }
  };

  const fetchAnimatedMovies = async () => {
    try {
      const genreId = await fetchGenreId('Animation'); // Fetch genre ID for Animation
      if (genreId) {
        const response = await axios.get(`${BASE_URL}discover/movie?${API_KEY}&with_genres=${genreId}`);
        setAnimatedMovies(response.data.results.slice(0, 10));
      } else {
        setError('Genre Animation tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal memuat film genre Animation');
    }
  };

  const fetchLatestMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}discover/movie?${API_KEY}&primary_release_year=2024&sort_by=release_date.desc`);
      setLatestMovies(response.data.results.slice(0, 10));
    } catch (err) {
      setError('Gagal memuat film terbaru 2024');
    }
  };

  const renderItem = ({ item, index }) => {
    const isActive = index === activeIndex;
    const handlePress = (id) => {
      router.push(`/MovieDetailScreen?id=${id}`);
    };
    return (
      <TouchableOpacity onPress={() => handlePress(item.id)} style={[styles.card, isActive && styles.activeCard]}>
        <Image 
          source={{ uri: `${URL_IMAGE}${item.poster_path}` }} 
          style={[styles.image, isActive && styles.activeImage]}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, isActive && styles.activeTitle]}>{item.title}</Text>
          <Text style={[styles.rating, isActive && styles.activeRating]}>Rating: {item.vote_average}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderComedyItem = ({ item }) => (
    <TouchableOpacity style={styles.card1}>
      <Image 
        source={{ uri: `${URL_IMAGE}${item.poster_path}` }} 
        style={styles.image1}
      />
      <View style={styles.textContainer1}>
        <Text style={styles.title1}>{item.title}</Text>
        <Text style={styles.rating1}>Rating: {item.vote_average}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAnimatedItem = ({ item }) => (
    <TouchableOpacity style={styles.card1}>
      <Image 
        source={{ uri: `${URL_IMAGE}${item.poster_path}` }} 
        style={styles.image1}
      />
      <View style={styles.textContainer1}>
        <Text style={styles.title1}>{item.title}</Text>
        <Text style={styles.rating1}>Rating: {item.vote_average}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLatestItem = ({ item }) => (
    <TouchableOpacity style={styles.card1}>
      <Image 
        source={{ uri: `${URL_IMAGE}${item.poster_path}` }} 
        style={styles.image1}
      />
      <View style={styles.textContainer1}>
        <Text style={styles.title1}>{item.title}</Text>
        <Text style={styles.rating1}>Rating: {item.vote_average}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>NONTONKUSOCA</Text>
      {loading ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <Carousel
            data={movies}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={itemWidth}
            onSnapToItem={(index) => setActiveIndex(index)}
            inactiveSlideScale={0.8}
            inactiveSlideOpacity={0.7}
            firstItem={3}
          /> 
          <Text style={styles.subHeader}>Film Terbaru 2024</Text>
          <FlatList
            data={latestMovies}
            renderItem={renderLatestItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
          <Text style={styles.subHeader}>Film Comedy</Text>
          <FlatList
            data={comedyMovies}
            renderItem={renderComedyItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
          <Text style={styles.subHeader}>Film Animation</Text>
          <FlatList
            data={animatedMovies}
            renderItem={renderAnimatedItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
          <View >
            <Text style={styles.subHeader}>Asu</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use full height
    backgroundColor: '#1d1d1d', // Background color black
    paddingTop: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 30,
    color: '#c1c1c1', // Soft white color for a subtle look
    marginLeft: 20,
    textShadowColor: '#333', // Dark shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 4, // Shadow blur radius
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#FFFFFF', // White text
  },
  error: {
    fontSize: 18,
    color: '#FFFFFF', // White text
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 10,
  },
  activeCard: {
    borderColor: '#5d5d5d', // Border for active card
    borderWidth: 1,
  },
  image: {
    width: itemWidth - 30,
    height: itemHeight - 50, // Adjust height to leave space for text
    borderRadius: 8,
    marginBottom: 10,
  },
  activeImage: {
    opacity: 1, // Full opacity for active image
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  activeTitle: {
    fontSize: 18,
  },
  rating: {
    fontSize: 14,
    textAlign:'center',
    color: '#FFFFFF', // White text
  },
  activeRating: {
    fontSize: 14,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  actionImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  actionTextContainer: {
    marginLeft: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionRating: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  subHeader: {
    fontSize: 18,
    color: '#c1c1c1',
    marginLeft: 30,
  },
  card1: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparan
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    // borderColor: '#5d5d5d', // Border color putih
    borderWidth: 1, // Width border putih
    marginHorizontal: 10, // Margin horizontal untuk spacing
    marginVertical: 10, 

  },
  image1: {
    width: 85,
    height: 125,
    borderRadius: 10,
    marginRight: 10, // Spacing between image and text
  },
  textContainer1: {
    flex: 1, // Allows text container to use remaining space
  },
  title1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Putih
    padding:10,
  },
  rating1: {
    fontSize: 14,
    padding:14,
    color: '#FFFFFF', // Putih
  },
  flatListContent: {
    paddingLeft: 20, // Adding padding to align with other components
  },
});

export default MovieListScreen;
