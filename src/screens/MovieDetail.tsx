import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';
import MovieList from '../components/movies/MovieList';
import { Movie, MovieRecommendation } from '../types/app';

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

    fetchMovieDetail();
    fetchRecommendations();
  }, [id]);

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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  rating: {
    fontSize: 18,
    color: 'white',
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
