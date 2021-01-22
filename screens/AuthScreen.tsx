import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';

import { Text, View } from '../components/Themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const GoogleButton = () => {
  const navigation = useNavigation()
  const goToWelcome = () => navigation.navigate('Welcome')
  const signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const authResult: GoogleSignIn.GoogleSignInAuthResult = await GoogleSignIn.signInAsync();
      if (authResult.type === 'success') goToWelcome()
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  }
  const signInSilentlyAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync()
    if (user) goToWelcome()
  }
  React.useEffect(() => {
    signInSilentlyAsync()
  })
  return <Button onPress={signInAsync} title="Sign in with Google"/>
}

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authorization</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <GoogleButton />
    </View>
  );
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
