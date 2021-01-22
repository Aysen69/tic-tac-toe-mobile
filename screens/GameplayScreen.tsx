import * as React from 'react';
import { Button, Dimensions, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

enum GamerStatus {
  Win,
  Lose,
  Draw,
  InBattle,
  Waiting
}

const Cell = (props) => {
  enum Status {
    Cross,
    Circle,
    Nothing
  }
  const [status, setStatus] = React.useState<Status>(Status.Nothing)
  const [isSelected, setIsSelected] = React.useState<boolean>(false)
  const [selectionColor, setSelectionColor] = React.useState<string>('#eee')
  const setSelectionColorByGamerStatus = () => {
    switch (props.gamerStatus) {
      case GamerStatus.Win:
        setSelectionColor('#0e0')
        break
      case GamerStatus.Lose:
        setSelectionColor('#e00')
        break
      default:
        setSelectionColor('#eee')
        break
    }
  }
  const takeTurn = (x: number, y: number) => {
    props.takeTurn(x, y)
    if (Math.random() > 0.3) {
      setStatus(Math.random() > 0.5 ? Status.Cross : Status.Circle)
    } else {
      setStatus(Status.Nothing)
    }
    setIsSelected(Math.random() > 0.9)
  }
  React.useEffect(() => {
    takeTurn(props.x, props.y)
  }, [])
  React.useEffect(() => {
    if (isSelected) {
      setSelectionColorByGamerStatus()
    }
  }, [isSelected])
  return (
    <View
      style={{
        width: props.windowSize / props.size,
        height: props.windowSize / props.size,
        backgroundColor: selectionColor,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
      }}
      onTouchEnd={() => { takeTurn(props.x, props.y) }}>
      <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'blue' }}>
        {status == Status.Cross && <Entypo name="cross" size={24} color="red" />}
        {status == Status.Circle && <Entypo name="circle" size={18} color="blue" />}
      </Text>
    </View>
  )
}

const Board = (props) => {
  const mapSize = (() => {
    let ret = []
    for (let i = 0; i < props.size; i++) ret.push(i)
    return ret
  })()
  const dimensionWindow = Dimensions.get('window')
  let windowSize = dimensionWindow.width
  if (dimensionWindow.height < windowSize) {
    windowSize = dimensionWindow.height
  }
  return (
    <View style={{ width: windowSize, height: windowSize, flexDirection: "column"}}>
      {mapSize.map((y) =>
        <View key={'row_y_' + y} style={{ flexDirection: "row" }}>
          {mapSize.map((x) => (
            <Cell key={'cell_' + x + '_' + y}
              size={props.size}
              windowSize={windowSize}
              x={x}
              y={y}
              takeTurn={props.takeTurn}
              gamerStatus={props.gamerStatus} />
            )
          )}
        </View>)
      }
    </View>
  )
}

export default function GameplayScreen() {
  const navigation = useNavigation()
  const [googleUser, setGoogleUser] = React.useState<GoogleSignIn.GoogleUser | null>(null)
  const [isMyTurn, setIsMyTurn] = React.useState<boolean | null>(null)
  const [gamerStatus, setGamerStatus] = React.useState<GamerStatus>(GamerStatus.Waiting)
  const signInSilentlyAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync()
    setGoogleUser(user)
  }
  const takeTurn = (x: number, y: number) => {
    if (isMyTurn === null) {
      setIsMyTurn(true)
    } else {
      setIsMyTurn(!isMyTurn)
    }
    setGamerStatus(GamerStatus.Lose)
  }
  React.useEffect(() => {
    signInSilentlyAsync()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nickname (opponent)</Text>
      <Text>{ isMyTurn === false && 'Turn of enemy' }</Text>
      <Board size={10} takeTurn={takeTurn} gamerStatus={gamerStatus} />
      <Text>{ isMyTurn === true && 'Your turn' }</Text>
      <Text style={styles.title}>{googleUser?.displayName} (you)</Text>
      <View>
        <Button title="Surrender" onPress={() => navigation.navigate("Welcome")} />
      </View>
    </View>
  )
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
})
