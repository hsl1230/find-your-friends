import { Game } from './game';
import { GameRoom } from './game-room';

export class RoomGame {
    currentGame: Game | undefined;
    gamesPlayed: Game[] = [];

    constructor(public gameRoom: GameRoom) {
    }

    nextGame() {
        if (this.gameRoom.players.length < this.gameRoom.numberOfPlayer) {
            return;
        }

        if (this.currentGame) {
            this.gamesPlayed.push(this.currentGame);
        }

        this.currentGame = new Game(this.gameRoom.setsOfPoker, this.gameRoom.players);
    }
}