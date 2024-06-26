import React from 'react';
import { View, Text, Button } from 'react-native';

const MovieDetail = ({ navigation }: any): any => {
  const fetchData = (): void => {
    // Ganti dengan API key atau access token yang sesuai
    const ACCESS_TOKEN =
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjkwODJiMWI3NWRlZDI2N2QxYjRjZTc4YWYyNGQ0OSIsIm5iZiI6MTcxOTQxMzI5OC42NzU4MTYsInN1YiI6IjY2N2MyNmViYzM3NzM4ZWJhMDU1N2Q1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tPfI9yZe8bLP9xfIr9ZjYI1kYW7P9GL3GIzMa2GDtp8';

    const url =
      'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Movie Detail Page</Text>
      <Button
        title='Fetch Data'
        onPress={() => {
          fetchData();
        }}
      />
    </View>
  );
};

export default MovieDetail;
