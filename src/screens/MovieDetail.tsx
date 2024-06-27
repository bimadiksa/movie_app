import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';
import MovieList from '../components/movies/MovieList';
import { Movie, MovieRecommendation } from '../types/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

type RouteParams = {
  params: {
    id: number;
  };
};

const MovieDetail = (): JSX.Element => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>(
    [],
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data: Movie = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie detail:', error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations`,
          {
            headers: {
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data: { results: MovieRecommendation[] } = await response.json();
        setRecommendations(data.results);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    const checkIsFavorite = async (id: number): Promise<boolean> => {
      try {
        const initialData: string | null =
          await AsyncStorage.getItem('@FavoriteList');
        if (initialData !== null) {
          const favMovieList: Movie[] = JSON.parse(initialData);
          return favMovieList.some((movie) => movie.id === id);
        }
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    fetchMovieDetail();
    fetchRecommendations();
    checkIsFavorite(id).then((result) => setIsFavorite(result));
  }, [id]);

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = [];

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
      navigation.navigate('Home'); // Refresh favorite screen
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList');
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData);
        const updatedList = favMovieList.filter((movie) => movie.id !== id);
        await AsyncStorage.setItem(
          '@FavoriteList',
          JSON.stringify(updatedList),
        );
        setIsFavorite(false);
        navigation.navigate('Home'); // Refresh favorite screen
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
          }}
          style={styles.poster}
          resizeMode='cover'
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.rating}>⭐ {movie.vote_average}</Text>
          <TouchableOpacity
            onPress={() => {
              isFavorite ? removeFavorite(movie.id) : addFavorite(movie);
            }}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color='red'
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.overview}>{movie.overview}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Original Language</Text>
              <Text style={styles.infoValue}>{movie.original_language}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Popularity</Text>
              <Text style={styles.infoValue}>{movie.popularity}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Release Date</Text>
              <Text style={styles.infoValue}>
                {new Date(movie.release_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Vote Count</Text>
              <Text style={styles.infoValue}>{movie.vote_count}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.recommendationTitle}>Recommendation</Text>
        <MovieList
          title='Recommendations'
          path={`movie/${id}/recommendations`}
          coverType='poster'
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  rating: {
    fontSize: 18,
    color: 'white',
    marginRight: 8,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoBlock: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
  },
  overview: {
    fontSize: 16,
    marginVertical: 16,
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default MovieDetail;
