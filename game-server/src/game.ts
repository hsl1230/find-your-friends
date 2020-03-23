import { Player } from './player';
import { GamePlayer } from './game-player';

export class Game {
    private _masterColor: string | undefined;

    masterGamePlayer: GamePlayer | undefined;

    gamePlayers: GamePlayer[] = [];

    shuffledPoker: number[] = [];
    reservedPoker: number[] = [];

    pointsCollected: number = 0;

    beKilledDown: boolean = false;

    constructor(private setsOfPoker: number, private players: Player[]) {
        this.shuffle();
        this.reservePoker();

        players.forEach((player, position) => {
            this.gamePlayers.push(this.createGamePlayer(player, position));
        });

        this.masterGamePlayer = this.gamePlayers[0];
    }

    private reservePoker() {
        const numberOfPlayers = this.players.length;
        let reservedNumberOfPoker = this.shuffledPoker.length % numberOfPlayers;
        if (reservedNumberOfPoker < 5) {
            reservedNumberOfPoker += numberOfPlayers;
        }

        for (let i = reservedNumberOfPoker; i > 0; i--) {
            this.reservedPoker.push(this.shuffledPoker[this.shuffledPoker.length - i]);
        }
    }

    private createGamePlayer(player: Player, position: number) {
        const numberOfPlayers = this.players.length;
        const poker: number[] = [];

        for (let i = 0; i < this.shuffledPoker.length - this.reservedPoker.length; i++) {
            if (i % numberOfPlayers === position) {
                poker.push(this.shuffledPoker[i]);
            }
        }
        return new GamePlayer(player, poker);
    }

    addPoints(points: number) {
        this.pointsCollected += points;
    }

    setMasterGamePlayer(playerId: string) {
        this.masterGamePlayer = this.gamePlayers.find(gamePlayer => gamePlayer.player.playerId === playerId);
    }

    set masterColor(color: string | undefined) {
        this._masterColor = color;
    }

    get masterColor(): string | undefined {
        return this._masterColor;
    }

    private shuffle() {
        const totalPokerNumber = 54 * this.setsOfPoker;

        let ind = 0;
        for (let j=0; j < this.setsOfPoker; j++) {
            for (let i=0; i < 54; i++) {
                this.shuffledPoker[ind++] = i;
            }
        }

        for (let i=0; i < totalPokerNumber; i++) {
            const index = Math.floor(Math.random() * (totalPokerNumber - i));
            const poker = this.shuffledPoker[index];
            this.shuffledPoker[index] = this.shuffledPoker[totalPokerNumber - i - 1];
            this.shuffledPoker[totalPokerNumber - i - 1] = poker;
        }
    }

    getGamePlayer(playerId: string) {
        return this.gamePlayers.find(player => player.player.playerId === playerId);
    }
}
