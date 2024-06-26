import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home(): JSX.Element {
  const navigation = useNavigation();

  const goToMovieDetail = () => {
    navigation.navigate('MovieDetail');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Button title='Go to Movie Detail' onPress={goToMovieDetail} />
    </View>
  );
}
