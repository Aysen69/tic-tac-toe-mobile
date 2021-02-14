import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { SignInWithGoogle } from '../components/SignInWithGoogle';
import { useNavigation } from '@react-navigation/native';
import { AuthMethod } from '../models/Auth';
import { TextInput } from 'react-native-gesture-handler';

export default function AuthScreen() {
  const navigation = useNavigation()
  const [nickname, setNickname] = React.useState("User" + Math.floor(1000 * Math.random()))
  const onSuccessSignIn = (nickname: string, authMethod: AuthMethod) => {
    navigation.navigate('Welcome', { nickname: nickname, authMethod: authMethod })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Big Tic-Tac-Toe</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View>
        <Text>Nickname:</Text>
        <TextInput onChangeText={text => setNickname(text)} value={nickname} style={{ marginBottom: 5, borderColor: 'gray', borderWidth: 1, height: 40, minWidth: '50%' }}/>
        <Button title="Go" onPress={() => { onSuccessSignIn(nickname, AuthMethod.CustomNickname) }} />
      </View>
      {/* <SignInWithGoogle onSuccess={onSuccessSignIn} /> */}
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
