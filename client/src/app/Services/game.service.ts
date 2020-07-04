import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { TriviumRound } from '../Models/TriviumRound';
import { ITriviumRound } from '../Models/ITriviumRound';
import { IGame } from '../Models/IGame';
import { Game } from '../Models/Game';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // here we want to track the game state
  triviumRound: ITriviumRound;
  game: IGame;
  //   questionTrivium: ITrivium;
  //   answerOptions: ITrivium[];
  constructor(
    private _apiService: ApiService,
    private _messageService: MessageService
  ) {
    this.game = new Game();
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
    this.fetchRoundFromRoom(0, roomCode);
  }

  getRound(): ITriviumRound {
    return this.game.triviumRounds[this.game.roundNumber];
  }
}
