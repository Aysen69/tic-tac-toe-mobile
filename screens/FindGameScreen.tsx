import * as React from 'react';
import { ActivityIndicator, Button, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

export default function FindGameScreen() {
  const navigation = useNavigation()
  const [googleUser, setGoogleUser] = React.useState<GoogleSignIn.GoogleUser | null>(null)
  const [rooms, setRooms] = React.useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = React.useState<any[]>([])
  const [isRoomListLoading, setIsRoomListLoading] = React.useState(false)
  const [isConnectingToRoomLoading, setIsConnectingToRoomLoading] = React.useState(false)
  const signInSilentlyAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync()
    setGoogleUser(user)
  }
  const getRooms = async () => {
    setIsRoomListLoading(true)
    let rooms: any[] = []
    for (let i = 0; i < 10 * Math.random(); i++) {
      rooms.push({id: i + '', name: "room " + i})
    }
    new Promise(resolve => {
      setTimeout(resolve, 2000 * Math.random());
    }).then(() => {
      setIsRoomListLoading(false)
      setRooms(rooms)
    })
  }
  const joinToRoom = async (room: any) => {
    setSelectedRoom(room)
    setIsConnectingToRoomLoading(true)
    new Promise(resolve => {
      setTimeout(resolve, 2000 * Math.random());
    }).then(() => {
      setIsConnectingToRoomLoading(false)
    })
  }
  React.useEffect(() => {
    signInSilentlyAsync()
    getRooms()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find game</Text>
      {isRoomListLoading || isConnectingToRoomLoading ?
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          {!isConnectingToRoomLoading ?
            <Text>Loading rooms...</Text>
          :
            <Text>Connecting to room "{selectedRoom.name}"...</Text>
          }
        </View>
      :
        <FlatList style={{maxHeight: '50%', alignSelf: 'stretch'}}
          data={rooms}
          renderItem={({ item, index }) => {
            return (
              <View style={{margin: 2, flexDirection: "row", justifyContent: "space-evenly",}}>
                <Text style={{color: 'black'}}>{item.name}</Text>
                <View>
                  <Button title="join" onPress={(item) => { joinToRoom(rooms[index]) } } />
                </View>
              </View>
            )
          }}
          keyExtractor={item => item.id}
        />
      }
      <View>
        {!isRoomListLoading &&
          <Text>Found {rooms.length} room(s)</Text>
        }
      </View>
      <View>
        <View style={{margin: 2}}>
          <Button title="Refresh" onPress={getRooms} />
        </View>
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
