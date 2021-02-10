import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { SignInWithGoogle } from '../components/SignInWithGoogle';
import { useNavigation } from '@react-navigation/native';
import { AuthMethod } from '../models/Auth';

export default function AuthScreen() {
  const navigation = useNavigation()
  const onSuccessSignIn = (nickname: string, authMethod: AuthMethod) => {
    navigation.navigate('Welcome', { nickname: nickname, authMethod: authMethod })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Big Tic-Tac-Toe</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <SignInWithGoogle onSuccess={onSuccessSignIn} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
