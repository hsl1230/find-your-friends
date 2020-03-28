import { Game } from './game';
import { GameRoom } from './game-room';

export class RoomGame {
    currentGame: Game | undefined;
    gamesPlayed: Game[] = [];

    constructor(public gameRoom: GameRoom) {
    }

    nextGame() {
        console.log('========nextGame', this.gameRoom.players.length, this.gameRoom.numberOfPlayer);
        if (this.gameRoom.players.length < this.gameRoom.numberOfPlayer) {
            console.log('========nextGame, exited');
            return;
        }

        if (this.currentGame) {
            this.gamesPlayed.push(this.currentGame);
        }

        console.log('========nextGame, new Game');
        this.currentGame = new Game(this.gameRoom.setsOfPoker, this.gameRoom.players);
    }
}