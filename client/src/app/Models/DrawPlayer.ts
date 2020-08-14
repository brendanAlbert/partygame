import { IDrawPlayer } from './IDrawPlayer';

export class DrawPlayer implements IDrawPlayer {
  readyToStart: boolean = false;
  stillDrawing: boolean = true;
  garyTrail: string;
  imageUrl: string;
  color1: string;
  color2: string;
  id: string;
  isAdmin: boolean;
  score: number;
  name: string;
}
