import * as React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { SimpleRoom, SimplePlayer } from '../models/DuplexTypes';
import { Network } from '../models/Network';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
              <View style={{margin: 2, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <View>
                  <View style={{margin: 2}}>
                    <Text style={{ color: 'black' }}>{item.name}</Text>
                  </View>
                  <View style={{margin: 2, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <View>
                      <Text style={{ backgroundColor: 'orange' }}>[ {item.mapSize}x{item.mapSize} ]</Text>
                    </View>
                    <View>
                      <Text style={{ backgroundColor: 'orange' }}>[ marks: {item.markCount} ]</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={(item) => { joinToRoom(rooms[index]) }}>
                    <Text style={{ color: '#fff', textTransform: 'uppercase' }}><MaterialCommunityIcons name="login" size={16} color="white" /> join</Text>
                  </Pressable>
                </View>
              </View>
            )
          }}
          keyExtractor={item => item.id}
        />
      }
      <View>
        {!isRoomListLoading && <Text>Found {rooms.length} room(s)</Text>}
      </View>
      <View>
        <View style={{margin: 2}}>
          <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={getRooms}>
            <Text style={{ color: '#fff', textTransform: 'uppercase' }}><FontAwesome name="refresh" size={16} color="white" /> Refresh</Text>
          </Pressable>
        </View>
        <View style={{margin: 2}}>
          <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={() => navigation.navigate("Welcome")}>
            <Text style={{ color: '#fff', textTransform: 'uppercase' }}><Ionicons name="caret-back-circle" size={16} color="white" /> Back</Text>
          </Pressable>
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
