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
  const onGetTiles = (cells: Cell[][]) => {
    setBoardMap({
      size: cells.length,
      cells: _cellsToCellType(cells)
    })
  }
  const onTurnOf = (playerId: string) => {
    setIsMyTurn(me.id == playerId)
  }
  const onGameOver = (players: { you: SimplePlayer, enemy: SimplePlayer }) => {
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
  const onConnectionError = (err?: Error) => {
    alert("Connection error. Trying to reconnect.")
    Network.connect()
  }
  const onDisconnect = (err?: Error) => {
    alert("Enemy disconnected")
    navigation.navigate("Welcome")
  }
  React.useEffect(() => {
    Network.subscribeOnGetTiles(onGetTiles)
    Network.subscribeOnTurnOf(onTurnOf)
    Network.subscribeOnGameOver(onGameOver)
    Network.subscribeOnConnectError(onConnectionError)
    Network.subscribeOnDisconnect(onDisconnect)
    Network.getTiles(room.id)

    return () => {
      if (isGameOver == false) surrender()
      Network.unsubscribeOnGetTiles(onGetTiles)
      Network.unsubscribeOnTurnOf(onTurnOf)
      Network.unsubscribeOnGameOver(onGameOver)
      Network.unsubscribeOnConnectError(onConnectionError)
      Network.unsubscribeOnDisconnect(onDisconnect)
    }
  }, [route.params.room.id])
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
      <Text style={styles.title}>{ isMyTurn === false && 'Enemy move' }</Text>
      {boardMap ?
      <Board boardMap={boardMap} takeTurn={takeTurn} />
      :
      <ActivityIndicator size="large" color="#0000ff" />
      }
      <Text style={styles.title}>{ isMyTurn === true && 'Your move' }</Text>
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
