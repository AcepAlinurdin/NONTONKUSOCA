import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, Animated } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { BASE_URL, API_KEY, MOVIE_POPULAR, URL_IMAGE, LANGUAGE } from '../config';

export default function HomeScreen() {
    const [backgroundImage, setBackgroundImage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fadeAnim] = useState(new Animated.Value(0)); // Inisialisasi animasi opacity
    const router = useRouter();

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
            } finally {
                setLoading(false);
            }
        };

        fetchBackgroundImage();
    }, []);

    useEffect(() => {
        if (!loading && !error) {
            // Animasi fade in untuk teks
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 7000,
                useNativeDriver: true,
            }).start(() => {
                // Pindah ke MovieListScreen setelah animasi selesai
                setTimeout(() => {
                    router.push('MovieListScreen');
                }, 500); // Delay sedikit sebelum pindah halaman
            });
        }
    }, [loading, error, router, fadeAnim]);

    return (
        <ImageBackground 
            source={{ uri: backgroundImage }}
            style={styles.container}
        >
            <View style={styles.overlay}>
                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <Animated.View style={{ ...styles.animatedTextContainer, opacity: fadeAnim }}>
                        <Text style={styles.animatedText}>NONTONKUSOCA</Text>
                    </Animated.View>
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
  animatedTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
