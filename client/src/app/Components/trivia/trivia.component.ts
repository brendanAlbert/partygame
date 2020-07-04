import { Component, OnInit, EventEmitter } from '@angular/core';

import { Router, NavigationExtras } from '@angular/router';

import { ITrivium } from '../../Models/ITrivium';
import { MessageService } from 'src/app/Services/message.service';
import { GameService } from 'src/app/Services/game.service';
import { IPlayer } from 'src/app/Models/Iplayer';
import { ITriviumRound } from 'src/app/Models/ITriviumRound';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.sass'],
})
export class TriviaComponent implements OnInit {
  questionTrivium: ITrivium;
  triviumRound: ITriviumRound;
  answerOptions: ITrivium[];
  roomCode: string;
  player: IPlayer;
  players: IPlayer[];
  playersWhoAnswered: IPlayer[] = [];
  answerPicked: boolean = false;

  navigationExtras: NavigationExtras = {};

  constructor(
    private _gameService: GameService,
    private router: Router,
    private _messageService: MessageService
  ) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      player: IPlayer;
    };
    this.roomCode = state.roomCode;
    this.player = state.player;

    this.subscribeToEvents();
  }

  ngOnInit(): void {
    this.getUsers();
    this._gameService.startRound(this._messageService.getRoomCode());

    setTimeout(() => {
      this.triviumRound = this._gameService.getRound();
      this.questionTrivium = this.triviumRound.questionTrivium;
      this.answerOptions = this.triviumRound.wrongTrivia;
      // here we trigger the progress bar
      this._messageService.emitStartRound();
    }, 1500);
  }

  getUsers = () => {
    this._messageService.getConnectedUsers(this._messageService.getRoomCode());
    setTimeout(() => {
      this.players = this._messageService.fetchUsers();
    }, 100);
  };

  pickAnswer(answerId: string) {
    console.log(`picked answer ${answerId}`);
    this.answerPicked = true;
    this._messageService.playerAnswered(
      this.player,
      parseInt(answerId),
      this.triviumRound.roundNumber
    );
    // console.log(
    //   `this.players.length -1 : ${
    //     this.players.length - 1
    //   } this.playersWhoAnswered.length  : ${this.playersWhoAnswered.length}`
    // );
    // // console.log(this.players.length === this.playersWhoAnswered.length - 1);
    // if (this.players.length - 1 === this.playersWhoAnswered.length) {
    // //   this._messageService.emitStopRound();
    // }
  }

  private subscribeToEvents(): void {
    this._messageService.answeredPlayers.subscribe((players: IPlayer[]) => {
      this.playersWhoAnswered = players;
    });

    this._messageService.ListenRoundEndedShowScore();
    this._messageService.ListenForAnswerSubmitted();
    this._messageService.ListenForUsersWhoAnswered();

    this._messageService.visitScore.subscribe(() => {
      this._messageService.fetchRoundResults();
    });

    this._messageService.listenFetchRoundResults();

    this._messageService.roundResults.subscribe((roundResults) => {
      console.log('round results');
      console.log(roundResults);
      this.viewScoreScreen(roundResults);
    });
    // this._messageService.endRound.subscribe()
  }

  public viewScoreScreen(roundResults) {
    this.navigationExtras = {
      state: {
        roundResults: roundResults,
        // player: this.player,
      },
    };

    this.router.navigate([`/score`], this.navigationExtras);
  }
}
