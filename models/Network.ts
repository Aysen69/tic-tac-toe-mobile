import { io, Socket } from 'socket.io-client'

export type SimpleRoom = {
  id: string
  name: string
}

export class Network {
  private static _socket: Socket

  private static _start()
  {
    if (Network._socket === void 0) {
      Network._socket = io('http://10.1.0.1:3000')
    }
  }

  public static getSocket()
  {
    Network._start()
    return Network._socket
  }

  public static onConnect(onConnect: Function)
  {
    Network._start()
    Network._socket.on('connect', onConnect)
    return this
  }

  public static connect()
  {
    Network._start()
    Network._socket.connect()
    return this
  }

  public static onCreateRoom(onCreateRoom: Function)
  {
    Network._start()
    Network._socket.on('createdRoom', onCreateRoom)
    return this
  }

  public static createRoom(nickname: string, roomName: string)
  {
    Network._start()
    Network._socket.emit('createRoom', nickname, roomName)
    return this
  }

  public static onGetRooms(onGetRooms: Function)
  {
    Network._start()
    Network._socket.on('rooms', onGetRooms)
    return this
  }

  public static getRooms()
  {
    Network._start()
    Network._socket.emit('getRooms')
    return this
  }
}
