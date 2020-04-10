import { Player } from './player';
import { Card } from './card';

export class GamePlayer {
    friends: GamePlayer[] = [];
    cardsInHand: number[] = [];
    cardsPlayed: Card[] = [];
    cardsPlaying: Card[] = [];

    constructor(public readonly player: Player, public cards: number[]) {
        this.cardsInHand = [...cards];
    }

    play(cards: number[]) {
        this.cardsPlaying = cards.map(card => new Card(card));;
        this.cardsPlayed.push(...this.cardsPlaying);
        const cardsPicking = [...cards];
        for(let i = 0; i < this.cardsInHand.length; ) {
            if (cardsPicking.length === 0) {
                break;
            }
            for (let j = 0; j < cardsPicking.length; j++) {
                if (this.cardsInHand[i] === cardsPicking[j]) {
                    delete this.cardsInHand[i];
                    delete cardsPicking[j];
                    break;
                } else {
                    i++;
                }
            }
        }
    }
}