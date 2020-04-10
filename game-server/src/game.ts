import { Player } from './player';
import { GamePlayer } from './game-player';
import { throws } from 'assert';
import { PokerSuits } from './poker-suits';
import { Card } from './card';
import { CardsPattern } from './cards-pattern';

const sortCards = (cards: number[]) => {
    return cards.sort((card1:number, card2:number) => card2 - card1);
}
export class Game {
    private _masterSuit: PokerSuits | undefined;

    _masterGamePlayer: GamePlayer;

    gamePlayers: GamePlayer[] = [];

    firstPlayerIndex: number = 0;
    currentPlayerIndex: number = 0;

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

        this._masterGamePlayer = this.gamePlayers[0];
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
        return new GamePlayer(player, this.orgCards(cards));
    }

    addPoints(points: number) {
        this.pointsCollected += points;
    }

    setMasterGamePlayer(clientId: string) {
        const masterGamePlayer = this.gamePlayers.find(gamePlayer => gamePlayer.player.clientId === clientId);
        if (masterGamePlayer) {
            this._masterGamePlayer = masterGamePlayer;
        }
    }

    set masterSuit(suit: PokerSuits | undefined) {
        this._masterSuit = suit;
        this.organizeCards();
    }

    get masterSuit(): PokerSuits | undefined {
        return this._masterSuit;
    }

    /*
     * 0, 1, 2, 3, 4, ..., 11, 12
     * 2, 3, 4, 5, 6, .... 13, 1
     */
    private orgCards(cards: number[]) {
        const suitNumber = this.masterSuit? this.masterSuit: 0;
        const level: number = this._masterGamePlayer? this._masterGamePlayer.player.level : this.players[0].level;
        const orgCards = cards.map((card: number) => {
            if (card > 51) {
                return card + 3000;
            } else if ((card + 1) % 14 === level) {
                if (card >= suitNumber * 13 && card < (suitNumber +1) * 13) {
                    return card + 2500;
                } else {
                    return card + 2000;
                }
            } else if (card >= suitNumber * 13 && card < (suitNumber +1) * 13) {
                return card + 1000;
            } else {
                return card;
            }
        });
        return sortCards(orgCards);
    }

    organizeCards() {
        if (this.gamePlayers.length === this.players.length) {
            this.gamePlayers.forEach(gamePlayer => {
                gamePlayer.cards = this.orgCards(gamePlayer.cards);
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

    getGamePlayer(clientId: string) {
        return this.gamePlayers.find(player => player.player.clientId === clientId);
    }

    playCards(clientId: string, cards: number[]) {
        const orderedCards = this.orgCards(cards);
        if (this.currentPlayerIndex === this.gamePlayers.length) {
            this.handleRound();
        }
        const playerId = this.firstPlayerIndex + this.currentPlayerIndex % this.gamePlayers.length;
        const gamePlayer1 = this.gamePlayers.find((gamePlayer, index) =>
            gamePlayer.player.clientId === clientId && index === playerId
        );
        if (gamePlayer1) {
            gamePlayer1.play(orderedCards);
            this.currentPlayerIndex++;
        }
    }

    private handleRound() {
        this.currentPlayerIndex = 0;
    }

    private isMasterSuit(card: Card) {
        return card.suit === PokerSuits.Joker || card.suit === this.masterSuit
            || card.level === this._masterGamePlayer?.player.level;
    }

    get level() {
        return this._masterGamePlayer.player.level;
    }

    parseMasterSuitCards(cards: Card[]) {

    }

    parseCards(cards: Card[]) {
        const cardPattern: CardsPattern = new CardsPattern(cards[0].suit, this.isMasterSuit(cards[0]));
        cardPattern.
        let count = 1;
        const patterns: {count: number, card: Card} [] = [];
        cards.forEach((card, index) => {
            if(index > 0 && card === cards[index - 1]) {
                count++;
            } else if (count > 1) {
                patterns.push({count, card: cards[index - 1]});
                count = 0;
            }
        });
        patterns.forEach((pattern, index) => {
            if ()
            if (index > 0) {
                if (pattern.card.level === this.level)
            }
            
            const diff = pattern.card.level - patterns[index - 1].card.level;
            if (diff === 1) {

            }
        });
    }

    private checkCards(cards: number[]) {
        const playingCards = cards.map(card => new Card(card));
        
        if (this.currentPlayerIndex === 0) {
            if (playingCards.find(
                card => this.isMasterSuit(playingCards[0])? !this.isMasterSuit(card) : card.suit !== playingCards[0].suit)) {
                return false;
            }
        } else {
            if (this.isMasterSuit(this._masterGamePlayer.cardsPlaying[0])) {

            }
        }

        if(this.gamePlayers[this.firstPlayerIndex].cardsPlaying.length !== cards.length) {
            return false;
        }
    }

}

