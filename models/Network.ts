import { io, Socket } from 'socket.io-client'
import { Cell, SimplePlayer, SimpleRoom } from './DuplexTypes'

export class Network {
  private static _socket: Socket

  private static _establish()
  {
    if (Network._socket == void 0 || (Network._socket && Network._socket.disconnected)) {
      Network.connect()
    }
  }

  public static connect()
  {
    if (Network._socket === void 0) {
      let url = 'http://143.198.183.146:3000'
      if (__DEV__) {
        url = 'http://10.1.0.1:3000'
      }
      Network._socket = io(url)
    }
    Network._socket.connect()
  }

  public static subscribeOnConnect(onConnect: () => void)
  {
    Network._establish()
    Network._socket.on('connect', onConnect)
  }

  public static unsubscribeOnConnect(onConnect: () => void)
  {
    Network._establish()
    Network._socket.off('connect', onConnect)
  }

  public static subscribeOnDisconnect(onDisconnect: () => void)
  {
    Network._establish()
    Network._socket.on('disconnect', onDisconnect)
  }

  public static unsubscribeOnDisconnect(onDisconnect: () => void)
  {
    Network._establish()
    Network._socket.off('disconnect', onDisconnect)
  }

  public static subscribeOnCreateRoom(onCreateRoom: (room: SimpleRoom) => void)
  {
    Network._establish()
    Network._socket.on('createdRoom', onCreateRoom)
  }

  public static unsubscribeOnCreateRoom(onCreateRoom: (room: SimpleRoom) => void)
  {
    Network._establish()
    Network._socket.off('createdRoom', onCreateRoom)
  }

  public static createRoom(nickname: string, roomName: string, mapSize: number, markCount: number)
  {
    Network._establish()
    Network._socket.emit('createRoom', nickname, roomName, mapSize, markCount)
  }

  public static subscribeOnGetRooms(onGetRooms: (rooms: SimpleRoom[]) => void)
  {
    Network._establish()
    Network._socket.on('rooms', onGetRooms)
  }

  public static unsubscribeOnGetRooms(onGetRooms: (rooms: SimpleRoom[]) => void)
  {
    Network._establish()
    Network._socket.off('rooms', onGetRooms)
  }

  public static getRooms()
  {
    Network._establish()
    Network._socket.emit('getRooms')
  }

  public static subscribeOnJoinToRoom(onJoinToRoom: (joinInfo: { room: SimpleRoom, you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._establish()
    Network._socket.on('youJoinedToTheRoom', onJoinToRoom)
  }

  public static unsubscribeOnJoinToRoom(onJoinToRoom: (joinInfo: { room: SimpleRoom, you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._establish()
    Network._socket.off('youJoinedToTheRoom', onJoinToRoom)
  }

  public static subscribeOnSomeoneJoinedToYourRoom(onSomeoneJoinedToYourRoom: (joinInfo: { room: SimpleRoom, you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._establish()
    Network._socket.on('someoneJoinedToYourRoom', onSomeoneJoinedToYourRoom)
  }

  public static unsubscribeOnSomeoneJoinedToYourRoom(onSomeoneJoinedToYourRoom: (joinInfo: { room: SimpleRoom, you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._establish()
    Network._socket.off('someoneJoinedToYourRoom', onSomeoneJoinedToYourRoom)
  }

  public static joinToRoom(nickname: string, roomId: string)
  {
    Network._establish()
    Network._socket.emit('joinToRoom', nickname, roomId)
  }

  public static subscribeOnGetTiles(onGetTiles: (cells: Cell[][]) => void)
  {
    Network._establish()
    Network._socket.on('tiles', onGetTiles)
  }

  public static unsubscribeOnGetTiles(onGetTiles: (cells: Cell[][]) => void)
  {
    Network._establish()
    Network._socket.off('tiles', onGetTiles)
  }

  public static getTiles(roomId: string)
  {
    Network._establish()
    Network._socket.emit('getTiles', roomId)
  }

  public static subscribeOnTurnOf(onTurnOf: (playerId: string) => void)
  {
    Network._establish()
    Network._socket.on('turnOf', onTurnOf)
  }

  public static unsubscribeOnTurnOf(onTurnOf: (playerId: string) => void)
  {
    Network._establish()
    Network._socket.off('turnOf', onTurnOf)
  }

  public static subscribeOnGameOver(onGameOver: (gameOver: { you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._establish()
    Network._socket.on('gameOver', onGameOver)
  }

  public static unsubscribeOnGameOver(onGameOver: (gameOver: { you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._establish()
    Network._socket.off('gameOver', onGameOver)
  }

  public static takeTurn(playerId: string, roomId: string, x: number, y: number)
  {
    Network._establish()
    Network._socket.emit('takeTurn', playerId, roomId, x, y)
  }

  public static surrender(playerId: string, roomId: string)
  {
    Network._establish()
    Network._socket.emit('surrender', playerId, roomId)
  }

  public static subscribeOnConnectError(onConnectError: (err: Error) => void)
  {
    Network._establish()
    Network._socket.on('connectError', onConnectError)
  }

  public static unsubscribeOnConnectError(onConnectError: (err: Error) => void)
  {
    Network._establish()
    Network._socket.off('connectError', onConnectError)
  }

  public static subscribeOnRoomDisconnect(onRoomDisconnect: (reason: string) => void)
  {
    Network._establish()
    Network._socket.on('roomDisconnect', onRoomDisconnect)
  }

  public static unsubscribeOnRoomDisconnect(onRoomDisconnect: (reason: string) => void)
  {
    Network._establish()
    Network._socket.off('roomDisconnect', onRoomDisconnect)
  }
}
