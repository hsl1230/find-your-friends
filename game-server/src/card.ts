import { PokerSuits } from "./poker-suits";

export class Card {
    suit: PokerSuits;
    level: number;
    constructor(public cardNumber: number) {
        const card = cardNumber % 100;
        if (card === 53) {
            this.suit = PokerSuits.Joker;
            this.level = 1;
        } else if (card === 52) {
            this.suit = PokerSuits.Joker;
            this.level = 0;
        } else {
            this.suit = Math.floor(cardNumber % 100 / 13);
            this.level = (cardNumber % 100 % 13 + 2);
        }
    }
}