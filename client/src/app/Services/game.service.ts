import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { TriviumRound } from '../Models/TriviumRound';
import { Player } from 'src/app/Models/player';
import { ITriviumRound } from '../Models/ITriviumRound';
import { IGame } from '../Models/IGame';
import { Game } from '../Models/Game';
import { IPlayer } from '../Models/Iplayer';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // here we want to track the game state
  triviumRound: ITriviumRound;
  game: IGame;

  roundNumber: number;
  roomCode: string;
  player: IPlayer;

  constructor(private _apiService: ApiService) {
    this.game = new Game();
    // this.player = new Player();
    this.roundNumber = 0;
  }

  fetchRoundFromRoom(roundNumber: number, roomCode: string) {
    this._apiService
      .fetchTrivia(roomCode, roundNumber)
      .subscribe((data: any) => {
        this.triviumRound = data;
        this.triviumRound.roundNumber = roundNumber;
        this.game.roundNumber = roundNumber;
        this.game.triviumRounds.push(this.triviumRound);
      });
  }

  startRound(roomCode: string) {
    // fetch first round
    // return round to trivia component
    this.fetchRoundFromRoom(this.roundNumber, roomCode);
    // this.setRoundNumber(this.roundNumber + 1);
  }

  getRound(): ITriviumRound {
    return this.game.triviumRounds[this.game.roundNumber];
  }

  setRoundNumber(roundNumber: number) {
    this.roundNumber = roundNumber;
  }

  setRoomCode(roomCode: string) {
    this.roomCode = roomCode;
  }
}
