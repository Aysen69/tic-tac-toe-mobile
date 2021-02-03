import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { Auth, AuthMethod } from '../models/Auth';

type RouteParams = {
  nickname: string,
  authMethod: AuthMethod,
}

export default function WelcomeScreen({ route }: { route: { params: RouteParams } }) {
  const navigation = useNavigation()
  const logOut = () => {
    Auth.signOutAsync(route.params.authMethod).then(() => {
      navigation.navigate("Auth")
    })
  }
  const findGame = () => {
    navigation.navigate("FindGame", { nickname: route.params.nickname })
  }
  const createGame = () => {
    navigation.navigate("CreateGame", { nickname: route.params.nickname })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {route.params.nickname}</Text>
      <View>
        <View style={{ marginVertical: 10 }}><Button title="Find game" onPress={findGame} /></View>
        <View style={{ marginVertical: 10 }}><Button title="Create game" onPress={createGame} /></View>
      </View>
      <Button title="Logout" onPress={logOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
