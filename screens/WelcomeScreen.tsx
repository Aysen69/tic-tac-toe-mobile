import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
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
        <View style={{ marginVertical: 10 }}>
          <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={findGame}>
            <Text style={{ color: '#fff', textTransform: 'uppercase' }}><FontAwesome name="search" size={16} color="white" /> Find game</Text>
          </Pressable>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={createGame}>
            <Text style={{ color: '#fff', textTransform: 'uppercase' }}><FontAwesome name="plus-circle" size={16} color="white" /> Create game</Text>
          </Pressable>
        </View>
      </View>
      <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={logOut}>
        <Text style={{ color: '#fff', textTransform: 'uppercase' }}><MaterialCommunityIcons name="logout" size={16} color="white" /> Logout</Text>
      </Pressable>
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
