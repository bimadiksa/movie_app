import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
};

const Favorite = (): JSX.Element => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList');
      if (initialData !== null) {
        setFavorites(JSON.parse(initialData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]);

  const navigateToMovieDetail = (movie: Movie) => {
    navigation.navigate('MovieDetail', { movie }); // Navigate to MovieDetail and pass movie data
  };

  const renderFavoriteMovies = () => {
    const rows: JSX.Element[] = [];
    let rowIndex = 0;

    for (let i = 0; i < favorites.length; i += 3) {
      const rowMovies = favorites.slice(i, i + 3); // Get 3 movies for current row
      rows.push(
        <View style={styles.row} key={rowIndex++}>
          {rowMovies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              size={coverImageSize['poster']}
              coverType={'poster'}
              onPress={() => navigateToMovieDetail(movie)}
            />
          ))}
        </View>,
      );
    }

    return rows;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Favorite Movies</Text>
        {favorites.length > 0 ? (
          renderFavoriteMovies()
        ) : (
          <Text style={styles.noFavorites}>No favorite movies added yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noFavorites: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
});

export default Favorite;
