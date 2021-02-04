import * as React from 'react';
import { Text, View } from '../components/Themed';
import { Entypo } from '@expo/vector-icons';
import { CellContain, CellType, BgColor } from '../models/DuplexTypes';
import Emoji from 'react-native-emoji';

export type CellProps = {
  x: number
  y: number
  windowSize: number
  size: number | undefined
  takeTurn: (x: number, y: number) => void
  cellType: CellType
}

export function Cell(props: CellProps) {
  const [bgColor, setBgColor] = React.useState<string>('#eee')
  const setBgColorByEnum = () => {
    switch (props.cellType!.bgColor) {
      case BgColor.Win:
        setBgColor('#0e0')
        break
      case BgColor.Lose:
        setBgColor('#ee0')
        break
      default:
        setBgColor('#eee')
        break
    }
  }
  const takeTurn = (x: number, y: number) => {
    props.takeTurn(x, y)
  }
  const _width = props.windowSize / props.size!
  const _iconSize = _width * 0.6
  React.useEffect(() => {
    setBgColorByEnum()
  }, [props.cellType!.bgColor])
  return (
    <View
      style={{
        width: _width,
        height: _width,
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
      }}
      onTouchEnd={() => { takeTurn(props.x, props.y) }}>
      <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'blue' }}>
        {props.cellType!.cellContain == CellContain.Cross && <Emoji name=":smiling_imp:" style={{fontSize: _iconSize}} />}
        {props.cellType!.cellContain == CellContain.Nought && <Emoji name=":innocent:" style={{fontSize: _iconSize}} />}
      </Text>
    </View>
  )
}
