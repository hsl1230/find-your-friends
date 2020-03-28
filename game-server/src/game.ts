import { Player } from './player';
import { GamePlayer } from './game-player';
import { throws } from 'assert';

enum PokerSuits {
    Spades = 1,
    Hearts,
    Clubs,
    Diamonds
}

const sortCards = (cards: number[]) => {
    return cards.sort((card1:number, card2:number) => card2 - card1);
}
export class Game {
    private _masterSuit: PokerSuits | undefined;

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
        const cards: number[] = [];

        for (let i = 0; i < this.shuffledPoker.length - this.reservedPoker.length; i++) {
            if (i % numberOfPlayers === position) {
                cards.push(this.shuffledPoker[i]);
            }
        }
        return new GamePlayer(player, sortCards(cards));
    }

    addPoints(points: number) {
        this.pointsCollected += points;
    }

    setMasterGamePlayer(playerId: string) {
        this.masterGamePlayer = this.gamePlayers.find(gamePlayer => gamePlayer.player.playerId === playerId);
    }

    set masterSuit(suit: PokerSuits | undefined) {
        this._masterSuit = suit;
    }

    get masterSuit(): PokerSuits | undefined {
        return this._masterSuit;
    }

    organizeCards() {
        if (this.masterSuit) {
            this.masterSuit * 13
        }
        const suitNumber = this.masterSuit? this.masterSuit: 0;
        const level: number = this.masterGamePlayer? this.masterGamePlayer.player.level : this.players[0].level;
        
        if (this.gamePlayers.length === this.players.length) {
            this.gamePlayers.forEach(gamePlayer => {
                gamePlayer.cards.map((card: number) => {
                    if (card > 51) {
                        return card + 3000;
                    } else if ((card + 1) % 13 === level - 1) {
                        return card + 2000;
                    } else if (card >= suitNumber * 13 && card < (suitNumber +1) * 13) {
                        return card + 1000;
                    }
                });
            });
        }
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
