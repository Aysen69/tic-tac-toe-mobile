import * as React from 'react';
import { ActivityIndicator, Button, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { Network, SimpleRoom } from '../models/Network';

export default function CreateGameScreen() {
  const navigation = useNavigation()
  const [googleUser, setGoogleUser] = React.useState<GoogleSignIn.GoogleUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [roomName, setRoomName] = React.useState<string>('Room ' + 100 * Math.random())
  const createRoom = () => {
    setIsLoading(true)
    Network.createRoom(googleUser?.displayName ? googleUser.displayName : 'noname ' + 100 * Math.random(), roomName)
  }
  Network.onCreateRoom((room: SimpleRoom) => setIsLoading(false))
  React.useEffect(() => {
    GoogleSignIn.signInSilentlyAsync().then(setGoogleUser)
  }, [])
  React.useEffect(() => {
    setRoomName('Room by ' + googleUser?.displayName)
  }, [googleUser])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create game</Text>
      <View>
        {!isLoading ?
        <View style={{flexDirection: "column", alignItems: 'center', justifyContent: "space-evenly"}}>
          <View style={{margin: 5}}>
            <Text>Room name:</Text>
            <TextInput onChangeText={text => setRoomName(text)} value={roomName} style={{ borderColor: 'gray', borderWidth: 1, height: 40, minWidth: '50%' }} />
          </View>
          <View style={{margin: 5}}>
            <Button title="Create room" onPress={createRoom} />
          </View>
        </View>
        :
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Waiting for player</Text>
        </View>
        }
      </View>
      <View>
        <View style={{margin: 2}}>
          <Button title="Back" onPress={() => navigation.navigate("Welcome")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
