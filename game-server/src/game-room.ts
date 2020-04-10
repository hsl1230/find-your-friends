import { Player } from "./player";

let ROOM_ID = 0;

export class GameRoom {
    roomId: string;
    players: Player[] = [];

    constructor(
        public readonly startLevel: number,
        public readonly numberOfPlayer: number,
        public readonly setsOfPoker: number,
        public readonly roomName: string) {
        ROOM_ID++;
        this.roomId = 'room-' + ROOM_ID;
    }

    addPlayer(playerId: string, clientId: string) {
        if (this.players.length < this.numberOfPlayer) {
            const player = new Player(playerId, this.startLevel, clientId);
            this.players.push(player);
            return player;
        }
    }

    getPlayer(playerId: string) {
        return this.players.find(player => player.playerId === playerId);
    }

    getPlayerByClientId(clientId: string) {
        return this.players.find(player => player.clientId === clientId);
    }
}