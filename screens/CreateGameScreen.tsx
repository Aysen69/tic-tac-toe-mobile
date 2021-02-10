import * as React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { Network } from '../models/Network';
import { SimpleRoom } from '../models/DuplexTypes';
import NumericInput from 'react-native-numeric-input';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

type RouteParams = {
  nickname: string
}

enum CreateRoomStage {
  Setup,
  CreatingRoom,
  WaitingForPlayer
}

export default function CreateGameScreen({ route }: { route: { params: RouteParams } }) {
  const navigation = useNavigation()
  let nickname = route.params.nickname
  const [createRoomStage, setCreateRoomStage] = React.useState<CreateRoomStage>(CreateRoomStage.Setup)
  const [roomName, setRoomName] = React.useState<string>('Room ' + (100 * Math.random()))
  const [mapSize, setMapSize] = React.useState(3)
  const [markCount, setMarkCount] = React.useState(3)
  const createRoom = () => {
    setCreateRoomStage(CreateRoomStage.CreatingRoom)
    Network.createRoom(nickname, roomName, mapSize, markCount)
  }
  let isMounted = false
  React.useEffect(() => {
    isMounted = true
    setRoomName('Room by ' + nickname)
    Network.onCreateRoom((room: SimpleRoom) => {
      if (isMounted) {
        setCreateRoomStage(CreateRoomStage.WaitingForPlayer)
      }
    })
    Network.onSomeoneJoinedToYourRoom((joinInfo) => {
      navigation.navigate('Gameplay', {
        room: joinInfo.room,
        you: joinInfo.you,
        enemy: joinInfo.enemy
      })
    })

    return () => {
      isMounted = false
    }
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create game</Text>
      <View>
        {createRoomStage == CreateRoomStage.Setup ?
        <View style={{flexDirection: "column", alignItems: 'center', justifyContent: "space-evenly"}}>
          <View style={{margin: 5}}>
            <Text>Room name:</Text>
            <TextInput onChangeText={text => setRoomName(text)} value={roomName} style={{ borderColor: 'gray', borderWidth: 1, height: 40, minWidth: '50%' }} />
          </View>
          <View style={{margin: 5}}>
            <Text>Map size: {mapSize}x{mapSize}</Text>
            <NumericInput onChange={value => setMapSize(value)} value={mapSize} minValue={3} maxValue={20} />
          </View>
          <View style={{margin: 5}}>
            <Text>Mark count to win: {markCount}</Text>
            <NumericInput onChange={value => setMarkCount(value)} value={markCount} minValue={3} maxValue={mapSize} />
          </View>
          <View style={{margin: 5}}>
            <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={createRoom}>
              <Text style={{ color: '#fff', textTransform: 'uppercase' }}><FontAwesome name="plus-circle" size={16} color="white" /> Create room</Text>
            </Pressable>
          </View>
        </View>
        :
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          {createRoomStage == CreateRoomStage.CreatingRoom && <Text>Creating room...</Text>}
          {createRoomStage == CreateRoomStage.WaitingForPlayer && <Text>Waiting for opponent...</Text>}
        </View>
        }
      </View>
      <View>
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
