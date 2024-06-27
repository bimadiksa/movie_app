import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';
import { useRoute } from '@react-navigation/native';

const GenreMovies = () => {
  const route = useRoute();
  const { movies, genreName } = route.params as {
    movies: Movie[];
    genreName: string;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Research Of {genreName} Genre</Text>
      {movies.length > 0 ? (
        <FlatList
          data={movies}
          renderItem={({ item }) => (
            <View style={styles.movieItemContainer}>
              <MovieItem
                key={item.id}
                movie={item}
                size={{ width: 100, height: 160 }}
                coverType='poster'
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <Text style={styles.noMoviesText}>No movies found for this genre.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  noMoviesText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  movieItemContainer: {
    flex: 1,
    margin: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default GenreMovies;
