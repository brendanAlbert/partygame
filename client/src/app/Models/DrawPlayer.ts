import { IDrawPlayer } from './IDrawPlayer';

export class DrawPlayer implements IDrawPlayer {
  imageUrl: string;
  color1: string;
  color2: string;
  id: number;
  isAdmin: boolean;
  score: number;
  name: string;
}
