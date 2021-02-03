import * as React from 'react';
import { ActivityIndicator, Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { SimpleRoom, SimplePlayer } from '../models/DuplexTypes';
import { Network } from '../models/Network';

type RouteParams = {
  nickname: string
}

export default function FindGameScreen({ route }: { route: { params: RouteParams } }) {
  const navigation = useNavigation()
  let nickname = route.params.nickname
  const [rooms, setRooms] = React.useState<SimpleRoom[]>([])
  const [selectedRoom, setSelectedRoom] = React.useState<SimpleRoom>()
  const [isRoomListLoading, setIsRoomListLoading] = React.useState(false)
  const [isConnectingToRoomLoading, setIsConnectingToRoomLoading] = React.useState(false)
  const getRooms = () => {
    setIsRoomListLoading(true)
    Network.getRooms()
  }
  const joinToRoom = (room: SimpleRoom) => {
    setSelectedRoom(room)
    setIsConnectingToRoomLoading(true)
    Network.joinToRoom(nickname, room.id)
  }
  let isMounted = false
  React.useEffect(() => {
    isMounted = true
    Network.onGetRooms((rooms: SimpleRoom[]) => {
      if (isMounted) {
        setRooms(rooms)
        setIsRoomListLoading(false)
      }
    })
    Network.onJoinToRoom((join: { room: SimpleRoom, you: SimplePlayer, enemy: SimplePlayer }) => {
      if (isMounted) {
        setIsConnectingToRoomLoading(false)
        navigation.navigate('Gameplay', {
          room: join.room,
          you: join.you,
          enemy: join.enemy
        })
      }
    })
    getRooms()

    return () => {
      isMounted = false
    }
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
            <Text>Connecting to room "{selectedRoom?.name}"...</Text>
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
