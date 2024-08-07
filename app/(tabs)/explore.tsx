import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { BASE_URL, API_KEY, MOVIE_POPULAR, URL_IMAGE, SEARCH_MOVIE, QUERY } from '../../config';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Adjust card width to fit within the screen

const MovieListScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [startYear, setStartYear] = useState('2020'); // Default year
  const [endYear, setEndYear] = useState('2024'); // Default year
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchMovies();
    } else {
      fetchMovies();
    }
  }, [selectedGenres, startYear, endYear]);

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

  const searchMovies = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}${SEARCH_MOVIE}${API_KEY}${QUERY}${searchQuery}`;
      if (selectedGenres.length > 0) {
        url += `&with_genres=${selectedGenres.join(',')}`;
      }
      if (startYear && endYear) {
        url += `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
      }
      console.log('Request URL:', url); // Debugging URL
      const response = await axios.get(url);
      const filteredMovies = response.data.results.filter(movie => {
        const releaseDate = new Date(movie.release_date);
        const releaseYear = releaseDate.getFullYear();
        return releaseYear >= parseInt(startYear) && releaseYear <= parseInt(endYear);
      });
      setMovies(filteredMovies);
      setLoading(false);
    } catch (err) {
      setError('Gagal mencari film');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchMovies();
  };

  const handlePress = (id) => {
    router.push(`/MovieDetailScreen?id=${id}`);
  };

  const addFavorite = async (movie) => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      let favoriteMovies = existingFavorites ? JSON.parse(existingFavorites) : [];

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

  const years = Array.from({ length: 20 }, (_, i) => (2024 - i).toString());

  const FilterComponent = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
        <Text style={styles.toggleFilter}>{showFilters ? 'Sembunyikan Filter' : 'Filter'}</Text>
      </TouchableOpacity>
      {showFilters && (
        <>
          <Text style={styles.filterLabel}>Tahun Mulai:</Text>
          <Picker
            selectedValue={startYear}
            style={styles.picker}
            onValueChange={(itemValue) => setStartYear(itemValue)}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>

          <Text style={styles.filterLabel}>Tahun Akhir:</Text>
          <Picker
            selectedValue={endYear}
            style={styles.picker}
            onValueChange={(itemValue) => setEndYear(itemValue)}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </>
      )}
    </View>
  );

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cari film..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Cari</Text>
        </TouchableOpacity>
      </View>
      <FilterComponent />
      {!searchQuery && <Text style={styles.header}>Film Teratas</Text>}
      {loading && <Text style={styles.loading}>Memuat...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {movies.length === 0 && !loading && !error && (
        <Text style={styles.noResults}>Tidak ada film yang sesuai dengan filter.</Text>
      )}
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
    // marginTop:40,
    flex: 1,
    padding: 16,
    backgroundColor: '#1d1d1d',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#c1c1c1',
  },
  input: {
    backgroundColor: '#808080',
    shadowColor: '#000',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    shadowRadius: 10,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:30,
    marginBottom:10,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#0025bb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
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
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  rating: {
    fontSize: 11,
    color: '#ddd',
  },
  addButton: {
    backgroundColor: '#0025bb',
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 7,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
  error: {
    fontSize: 18,
    color: '#ff4d4d',
    textAlign: 'center',
    marginTop: 20,
  },
  filterContainer: {
    marginBottom: 16,
    borderRadius:10,
  },
  toggleFilter: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#c1c1c1',
    borderRadius:10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#c1c1c1',
    borderRadius:10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#808080',
    marginBottom: 16,
    borderRadius:30,
   
  },
  noResults: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    borderRadius:10,
  },
});

export default MovieListScreen;
