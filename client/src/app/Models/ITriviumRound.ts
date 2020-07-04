import { ITrivium } from './ITrivium';

export interface ITriviumRound {
  roundNumber: number;
  questionTrivium: ITrivium;
  wrongTrivia: ITrivium[];
}
