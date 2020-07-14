import { IHacker } from './IHacker';

export class Hacker implements IHacker {
  score: number;
  name: string;

  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}
