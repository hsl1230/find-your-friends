import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RoomGame, GameRoom } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GamingService {
  gameRooms = this.socket.fromEvent<GameRoom[]>('game-rooms');
  currentRoomGame =  this.socket.fromEvent<RoomGame>('room-game');

  constructor(private socket: Socket) { }

  getGameRooms() {
    this.socket.emit('get-game-rooms');
  }

  createGameRoom(playerId: string, roomName: string, startLevel: number, numberOfPlayers: number, setsOfPoker: number) {
    this.socket.emit('create-game-room', {playerId, roomName, startLevel, numberOfPlayers, setsOfPoker});
  }

  joinInRoom(roomId: string, playerId: string) {
    this.socket.emit('join-in-room', {roomId, playerId});
  }

  startGame(roomId: string) {
    this.socket.emit('start-game', {roomId});
  }
}
