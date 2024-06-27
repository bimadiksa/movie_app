import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MovieItem from '../movies/MovieItem'; // Adjust the path according to your file structure
import { FontAwesome } from '@expo/vector-icons';
import { API_ACCESS_TOKEN } from '@env';

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

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    console.log('Searching for:', keyword);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMovieItem = ({ item }) => (
    <View style={styles.movieItemContainer}>
      <MovieItem
        movie={item}
        size={coverImageSize['poster']}
        coverType='poster'
      />
    </View>
  );

  const ItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
          placeholder='Input title movie here'
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <FontAwesome name='search' size={24} color='grey' />
        </TouchableOpacity>
      </View>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.moviesList}
        numColumns={3}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    paddingTop: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  searchButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  moviesList: {
    marginTop: 10,
    flexGrow: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  movieItemContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  itemSeparator: {
    height: 10,
  },
});

export default KeywordSearch;
