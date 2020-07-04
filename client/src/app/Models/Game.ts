import { IGame } from './IGame';
import { ITriviumRound } from './ITriviumRound';
import { TriviumRound } from './TriviumRound';

export class Game implements IGame {
  roundNumber: number;
  triviumRounds: ITriviumRound[];

  constructor() {
    this.triviumRounds = new Array<TriviumRound>();
  }
}
