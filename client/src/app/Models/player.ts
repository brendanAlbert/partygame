import { IPlayer } from './Iplayer';

export class Player implements IPlayer {
  id: number;
  isAdmin: boolean;
  score: number;
  name: string;
}
