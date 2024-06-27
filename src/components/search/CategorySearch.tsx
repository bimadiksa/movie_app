import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { useNavigation } from '@react-navigation/native';

const CategorySearch = () => {
  const navigation = useNavigation();

  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list`,
          {
            headers: {
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setError('Failed to fetch genres. Please try again later.');
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (id: number, name: string) => {
    setSelectedGenre({ id, name });
  };

  const handleSearch = async () => {
    if (selectedGenre !== null) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenre.id}`,
          {
            headers: {
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setIsLoading(false);
        navigation.navigate('GenreMovies', {
          movies: data.results,
          genreName: selectedGenre.name,
        });
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching movies:', error);
        Alert.alert('Error', 'Failed to fetch movies. Please try again later.');
      }
    } else {
      Alert.alert('No Genre Selected', 'Please select a genre to search.');
    }
  };

  const renderGenreItem = ({
    item,
  }: {
    item: { id: number; name: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.genreItem,
        selectedGenre?.id === item.id && styles.genreItemSelected,
      ]}
      onPress={() => handleGenreSelect(item.id, item.name)}
    >
      <Text style={styles.genreText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={genres}
        renderItem={renderGenreItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.genresList}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
  },
  genresList: {
    justifyContent: 'space-between',
  },
  genreItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e6e6fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreItemSelected: {
    backgroundColor: '#9370DB',
  },
  genreText: {
    fontSize: 14,
    color: '#4B0082',
  },
  searchButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#9370DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 16,
  },
});

export default CategorySearch;
