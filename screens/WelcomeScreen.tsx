import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation()
  const [googleUser, setGoogleUser] = React.useState<GoogleSignIn.GoogleUser | null>(null)
  const logOut = () => {
    GoogleSignIn.signOutAsync().then(() => {
      navigation.navigate("Auth")
    })
  }
  const findGame = () => {
    navigation.navigate("FindGame")
  }
  const createGame = () => {
    navigation.navigate("CreateGame")
  }
  React.useEffect(() => {
    GoogleSignIn.signInSilentlyAsync().then(setGoogleUser)
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {googleUser?.displayName}</Text>
      <View>
        <View style={{ marginVertical: 10 }}><Button title="Find game" onPress={findGame} /></View>
        <View style={{ marginVertical: 10 }}><Button title="Create game" onPress={createGame} /></View>
        <View style={{ marginVertical: 10 }}><Button title="gameplay" onPress={() => { navigation.navigate("Gameplay") }} /></View>
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
