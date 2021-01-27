import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { Board, BoardMap } from '../components/Board';
import { CellContain, BgColor } from '../components/Cell';

export default function GameplayScreen() {
  const navigation = useNavigation()
  const [googleUser, setGoogleUser] = React.useState<GoogleSignIn.GoogleUser | null>()
  const [isMyTurn, setIsMyTurn] = React.useState<boolean | undefined>()
  const [boardMap, setBoardMap] = React.useState<BoardMap | undefined>()
  const takeTurn = (x: number, y: number) => {
    boardMap!.cells[y][x].cellContain = isMyTurn ? CellContain.Cross : CellContain.Circle
    setBoardMap(boardMap)
    setIsMyTurn(!isMyTurn)
  }
  React.useEffect(() => {
    GoogleSignIn.signInSilentlyAsync().then(setGoogleUser)
    setBoardMap({
      size: 3,
      cells: [
        [
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
        ],
        [
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
        ],
        [
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
          { cellContain: CellContain.Nothing, isSelected: false, bgColor: BgColor.Nothing},
        ],
      ],
    })
    if (isMyTurn === void 0) {
      setIsMyTurn(true)
    }
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nickname (opponent)</Text>
      <Text>{ isMyTurn === false && 'Turn of enemy' }</Text>
      {boardMap && <Board boardMap={boardMap} takeTurn={takeTurn} />}
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
