import { GamePlayer } from './game-player';

export class Game {
  masterColor: string | undefined;

  masterGamePlayer: GamePlayer | undefined;

  gamePlayers: GamePlayer[];

  shuffledPoker: number[];
  reservedPoker: number[];

  pointsCollected: number;

  beKilledDown: boolean;
}
