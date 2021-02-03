import { io, Socket } from 'socket.io-client'

export class Network {
  private static _socket: Socket

  private static _start()
  {
    if (Network._socket === void 0) {
      Network._socket = io('http://10.1.0.1:3000')
    }
  }

  public static onConnect(onConnect: Function)
  {
    Network._start()
    Network._socket.on('connect', onConnect)
  }

  public static connect()
  {
    Network._start()
    Network._socket.connect()
  }

  public static onCreateRoom(onCreateRoom: Function)
  {
    Network._start()
    Network._socket.on('createdRoom', onCreateRoom)
  }

  public static createRoom(nickname: string, roomName: string, mapSize: number, markCount: number)
  {
    Network._start()
    Network._socket.emit('createRoom', nickname, roomName, mapSize, markCount)
  }

  public static onGetRooms(onGetRooms: Function)
  {
    Network._start()
    Network._socket.on('rooms', onGetRooms)
  }

  public static getRooms()
  {
    Network._start()
    Network._socket.emit('getRooms')
  }

  public static onJoinToRoom(onJoinToRoom: Function)
  {
    Network._start()
    Network._socket.on('youJoinedToTheRoom', onJoinToRoom)
  }

  public static onSomeoneJoinedToYourRoom(onSomeoneJoinedToYourRoom: Function)
  {
    Network._start()
    Network._socket.on('someoneJoinedToYourRoom', onSomeoneJoinedToYourRoom)
  }

  public static joinToRoom(nickname: string, roomId: string)
  {
    Network._start()
    Network._socket.emit('joinToRoom', nickname, roomId)
  }

  public static onGetTiles(onGetTiles: Function)
  {
    Network._start()
    Network._socket.on('tiles', onGetTiles)
  }

  public static getTiles(roomId: string)
  {
    Network._start()
    Network._socket.emit('getTiles', roomId)
  }

  public static onTurnOf(onTurnOf: Function)
  {
    Network._start()
    Network._socket.on('turnOf', onTurnOf)
  }

  public static onGameOver(onGameOver: Function)
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
}
