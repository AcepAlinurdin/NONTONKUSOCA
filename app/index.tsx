import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Link } from 'expo-router';
import { BASE_URL, API_KEY, MOVIE_POPULAR, URL_IMAGE, LANGUAGE } from '../config';

export default function HomeScreen() {
    const [backgroundImage, setBackgroundImage] = useState('');
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchBackgroundImage = async () => {
            try {
                const response = await axios.get(`${BASE_URL}${MOVIE_POPULAR}${API_KEY}${LANGUAGE}`);
                const movies = response.data.results;
                if (movies.length > 0) {
                    const firstMovie = movies[0];
                    setBackgroundImage(`${URL_IMAGE}${firstMovie.backdrop_path}`);
                }
            } catch (error) {
                setError('Gagal memuat gambar latar belakang');
                console.error('Gagal memuat gambar latar belakang', error);
            }
        };

        fetchBackgroundImage();
    }, []);

    return (
        <ImageBackground 
            source={{ uri: backgroundImage }}
            style={styles.container}
        >
            <View style={styles.overlay}>
                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <>
                        {/* <Text style={styles.title}>Home</Text> */}
                        <TouchableOpacity style={styles.button}>
                            <Link href="MovieListScreen" style={styles.buttonText}>
                                NONTONKUSOCA
                            </Link>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'transparent', // Mengatur latar belakang tombol menjadi transparan
    borderRadius: 8,
    borderWidth: 3, // Ketebalan border
    borderColor: '#192931', // Warna border
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 0,
    shadowRadius:20,
    shadowColor: '#000',
    
    shadowOpacity:0, // Jika Anda menggunakan Android, ini menambahkan efek bayangan
  },
  buttonText: {
    color: '#192931', // Warna teks tombol
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
