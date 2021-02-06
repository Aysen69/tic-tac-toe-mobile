import { io, Socket } from 'socket.io-client'
import { Cell, SimplePlayer, SimpleRoom } from './DuplexTypes'

export class Network {
  private static _socket: Socket

  private static _start()
  {
    if (Network._socket === void 0) {
      let url = 'http://185.228.232.184:3000'
      if (__DEV__) {
        url = 'http://10.1.0.1:3000'
      }
      Network._socket = io(url)
    }
  }

  public static onConnect(onConnect: () => void)
  {
    Network._start()
    Network._socket.on('connect', onConnect)
  }

  public static onDisconnect(onDisconnect: () => void)
  {
    Network._start()
    Network._socket.on('disconnect', onDisconnect)
  }

  public static connect()
  {
    Network._start()
    Network._socket.connect()
  }

  public static onCreateRoom(onCreateRoom: (room: SimpleRoom) => void)
  {
    Network._start()
    Network._socket.on('createdRoom', onCreateRoom)
  }

  public static createRoom(nickname: string, roomName: string, mapSize: number, markCount: number)
  {
    Network._start()
    Network._socket.emit('createRoom', nickname, roomName, mapSize, markCount)
  }

  public static onGetRooms(onGetRooms: (rooms: SimpleRoom[]) => void)
  {
    Network._start()
    Network._socket.on('rooms', onGetRooms)
  }

  public static getRooms()
  {
    Network._start()
    Network._socket.emit('getRooms')
  }

  public static onJoinToRoom(onJoinToRoom: (joinInfo: { room: SimpleRoom, you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._start()
    Network._socket.on('youJoinedToTheRoom', onJoinToRoom)
  }

  public static onSomeoneJoinedToYourRoom(onSomeoneJoinedToYourRoom: (joinInfo: { room: SimpleRoom, you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._start()
    Network._socket.on('someoneJoinedToYourRoom', onSomeoneJoinedToYourRoom)
  }

  public static joinToRoom(nickname: string, roomId: string)
  {
    Network._start()
    Network._socket.emit('joinToRoom', nickname, roomId)
  }

  public static onGetTiles(onGetTiles: (cells: Cell[][]) => void)
  {
    Network._start()
    Network._socket.on('tiles', onGetTiles)
  }

  public static getTiles(roomId: string)
  {
    Network._start()
    Network._socket.emit('getTiles', roomId)
  }

  public static onTurnOf(onTurnOf: (playerId: string) => void)
  {
    Network._start()
    Network._socket.on('turnOf', onTurnOf)
  }

  public static onGameOver(onGameOver: (gameOver: { you: SimplePlayer, enemy: SimplePlayer }) => void)
  {
    Network._start()
    Network._socket.on('gameOver', onGameOver)
  }

  public static takeTurn(playerId: string, roomId: string, x: number, y: number)
  {
    Network._start()
    Network._socket.emit('takeTurn', playerId, roomId, x, y)
  }

  public static surrender(playerId: string, roomId: string)
  {
    Network._start()
    Network._socket.emit('surrender', playerId, roomId)
  }

  public static onConnectError(onConnectError: (err: Error) => void)
  {
    Network._start()
    Network._socket.on('connectError', onConnectError)
  }

  public static onRoomDisconnect(onRoomDisconnect: (reason: string) => void)
  {
    Network._start()
    Network._socket.on('roomDisconnect', onRoomDisconnect)
  }
}
