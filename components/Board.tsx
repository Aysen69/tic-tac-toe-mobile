import * as React from 'react';
import { Dimensions } from 'react-native';
import { View } from './Themed';
import { Cell, CellType } from './Cell'

export type BoardMap = {
  size: number
  cells: CellType[][]
}

export type BoardProps = {
  boardMap: BoardMap | undefined
  takeTurn: CallableFunction
}

export function Board(props: BoardProps) {
  const mapSize = (() => {
    let ret = []
    for (let i = 0; i < props.boardMap!.size; i++) ret.push(i)
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
        <View key={'row_' + y} style={{ flexDirection: "row" }}>
          {mapSize.map((x) => (
            <Cell key={'cell_' + x + '_' + y}
              x={x}
              y={y}
              windowSize={windowSize}
              size={props.boardMap!.size}
              takeTurn={props.takeTurn}
              cellType={props.boardMap!.cells[y][x]} />
          ))}
        </View>
      )}
    </View>
  )
}