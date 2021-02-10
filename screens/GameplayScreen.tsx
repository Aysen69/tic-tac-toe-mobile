import * as React from 'react';
import { ActivityIndicator, Button, StyleSheet } from 'react-native';

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
  let room: SimpleRoom = route.params.room
  let me: SimplePlayer = route.params.you
  let enemy: SimplePlayer = route.params.enemy
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
            alert("You win!")
            break;
          case GamerStatus.Lose:
            alert("You lose")
            break;
          case GamerStatus.Draw:
            alert("Draw")
            break;
        }
      }
    })
    let onConnectionError = () => {
      if (isMounted) {
        alert("Connection error")
        navigation.navigate("Welcome")
      }
    }
    Network.onConnectError((err: Error) => onConnectionError())
    Network.onConnectError((err: Error) => onConnectionError())
    Network.onDisconnect(() => onConnectionError())
    Network.getTiles(room.id)

    return () => {
      isMounted = false
      if (isGameOver == false) {
        Network.surrender(me.id, room.id)
      }
    }
  }, [])
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Text>{room.name} </Text>
        </View>
        <View style={{marginLeft: 5}}>
          <Text style={{ backgroundColor: 'orange' }}>[ {room.mapSize}x{room.mapSize} ]</Text>
        </View>
        <View style={{marginLeft: 5}}>
          <Text style={{ backgroundColor: 'orange' }}>[ marks: {room.markCount} ]</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{backgroundColor: isMyTurn ? '#99ff00' : '#fff'}}>
          <Text style={styles.title}>{me.nickname}</Text>
        </View>
        <View>
          <Text> vs </Text>
        </View>
        <View style={{backgroundColor: !isMyTurn ? '#99ff00' : '#fff'}}>
          <Text style={styles.title}>{enemy.nickname}</Text>
        </View>
      </View>
      <Text style={styles.title}>{ isMyTurn === false && 'Turn of enemy' }</Text>
      {boardMap ?
      <Board boardMap={boardMap} takeTurn={takeTurn} />
      :
      <ActivityIndicator size="large" color="#0000ff" />
      }
      <Text style={styles.title}>{ isMyTurn === true && 'Your turn' }</Text>
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
