import * as React from 'react';
import { Alert, Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { Board, BoardMap } from '../components/Board';
import { Network } from '../models/Network';
import { SimplePlayer, SimpleRoom, GamerStatus, Cell, CellContain, BgColor, CellType } from '../models/DuplexTypes';

type RouteParams = {
  room: SimpleRoom
  you: SimplePlayer
  enemy: SimplePlayer
}

export default function GameplayScreen({ route }: { route: { params: RouteParams } }) {
  const navigation = useNavigation()
  const [isMyTurn, setIsMyTurn] = React.useState<boolean | undefined>()
  const [boardMap, setBoardMap] = React.useState<BoardMap | undefined>()
  const [isGameOver, setIsGameOver] = React.useState(false)
  let room: SimpleRoom = route.params.room;
  let me: SimplePlayer = route.params.you;
  let enemy: SimplePlayer = route.params.enemy;
  const takeTurn = (x: number, y: number) => {
    Network.takeTurn(me.id, room.id, x, y)
  }
  const _cellsToCellType = (cells: Cell[][]): CellType[][] => {
    let cellTypes: CellType[][] = []
    for (let y = 0; y < cells.length; y++) {
      let row: CellType[] = []
      for (let x = 0; x < cells[y].length; x++) {
        let cellContain = CellContain.Nothing
        switch (cells[y][x].cellContain) {
          case CellContain.Cross:
            cellContain = CellContain.Cross
            break;
          case CellContain.Nought:
            cellContain = CellContain.Nought
            break;
        }
        let bgColor = BgColor.Nothing
        if (cells[y][x].isChecked) {
          bgColor = me.gamerStatus == GamerStatus.Lose ? BgColor.Lose : BgColor.Win
        }
        row.push({
          cellContain: cellContain,
          isSelected: cells[y][x].isChecked,
          bgColor: bgColor
        })
      }
      cellTypes.push(row)
    }
    return cellTypes
  }
  const surrender = () => {
    Network.surrender(me.id, room.id)
  }
  let isMounted = false
  React.useEffect(() => {
    isMounted = true
    Network.onGetTiles((cells: Cell[][]) => {
      if (isMounted) {
        setBoardMap({
          size: cells.length,
          cells: _cellsToCellType(cells)
        })
      }
    })
    Network.onTurnOf((playerId: string) => {
      if (isMounted) {
        setIsMyTurn(me.id == playerId)
      }
    })
    Network.onGameOver((players: { you: SimplePlayer, enemy: SimplePlayer }) => {
      if (isMounted) {
        me = players.you
        enemy = players.enemy
        setIsGameOver(true)
        switch (me.gamerStatus) {
          case GamerStatus.Win:
            Alert.alert("You win!")
            break;
          case GamerStatus.Lose:
            Alert.alert("You lose")
            break;
          case GamerStatus.Draw:
            Alert.alert("Draw")
            break;
        }
      }
    })
    Network.getTiles(room.id)

    return () => {
      isMounted = false
    }
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{enemy.nickname} (opponent)</Text>
      <Text>{ isMyTurn === false && 'Turn of enemy' }</Text>
      {boardMap && <Board boardMap={boardMap} takeTurn={takeTurn} />}
      <Text>{ isMyTurn === true && 'Your turn' }</Text>
      <Text style={styles.title}>{me.nickname} (you)</Text>
      <View>
        {!isGameOver ?
        <Button title="Surrender" onPress={surrender} color={'#FFC300'} />
        :
        <Button title="Back" onPress={() => navigation.navigate("Welcome")} />
        }
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
