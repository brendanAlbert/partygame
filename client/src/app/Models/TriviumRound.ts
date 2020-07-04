import { ITriviumRound } from './ITriviumRound';
import { ITrivium } from './ITrivium';

export class TriviumRound implements ITriviumRound {
  roundNumber: number;
  questionTrivium: ITrivium;
  wrongTrivia: ITrivium[];
}
