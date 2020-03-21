import { GameRoom, Player, Game } from '.';

export class RoomGame {
  gameRoom: GameRoom;
  players: Player[];
  currentGame: Game | undefined;
  gamesPlayed: Game[];
}
