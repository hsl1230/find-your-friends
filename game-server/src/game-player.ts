import { Player } from './player';

export class GamePlayer {
    friends: GamePlayer[] = [];
    cardsInHand: number[] = [];
    cardsPlayed: number[] = [];
    cardsPlaying: number[] = [];

    constructor(public readonly player: Player, public cards: number[]) {
        this.cardsInHand = [...cards];
    }

    play(cards: number[]) {
        this.cardsPlaying = cards;
        this.cardsPlayed.push(...cards);
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