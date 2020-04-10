import { PokerSuits } from "./poker-suits";

export class CardsPattern {
    valid?: boolean;
    tractorsPattern: number[][] = [];
    nonTractorPattern: number[] = [];
    constructor(public suit: PokerSuits, public masterSuit: boolean) {
    }
}