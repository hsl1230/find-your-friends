import { Player } from './player';

export class GamePlayer {
  player: Player;
  friends: GamePlayer[] = [];
  cards: number[];
  cardsInHand: number[] = [];
  cardsPlayed: number[] = [];
  cardsPlaying: number[] = [];
}
