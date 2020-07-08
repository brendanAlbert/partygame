import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Router, NavigationExtras } from '@angular/router';

import { ITrivium } from '../../Models/ITrivium';
import { MessageService } from 'src/app/Services/message.service';
import { IPlayer } from 'src/app/Models/Iplayer';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.sass'],
})
export class TriviaComponent implements OnInit, OnDestroy {
  question: string;
  answerOptions: ITrivium[];
  roundNumber: number;
  roomCode: string;
  player: IPlayer;
  players: IPlayer[];
  playersWhoAnswered: IPlayer[] = [];
  answerPicked: boolean = false;

  navigationExtras: NavigationExtras = {};

  @ViewChild('progressBar') pb: ElementRef;
  timer: any;
  secondsLeft: number = 25;
  timerStopped: boolean = false;

  roundSubscription: any;
  roundResults: any;
  roundPlayers: any;
  roundTimer: any;

  constructor(private router: Router, private _messageService: MessageService) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      player: IPlayer;
    };
    this.roomCode = state.roomCode;
    this.player = state.player;
    console.log('instantiating new trivia component');
  }

  ngOnInit(): void {
    if (this.player.isAdmin) {
      console.log('fetching next round from ng on init');
      this._messageService.fetchNextRound();
    }

    this.roundSubscription = this._messageService.startRound.subscribe(
      (nextRound) => {
        console.log(`nextRound fetched = `);
        console.log(nextRound);
        this.roundNumber = nextRound.roundNumber;
        this.question = nextRound.questionTrivium.question;
        this.answerOptions = nextRound.wrongTrivia;
        if (!this.timerStopped) {
          this.startTimer();
        }
      }
    );

    this.roundResults = this._messageService.roundResults.subscribe(
      (roundResults) => {
        console.log('subbed round results');
        console.log(roundResults);
        this.viewScoreScreen(roundResults);
      }
    );

    this.roundPlayers = this._messageService.answeredPlayers.subscribe(
      (players: IPlayer[]) => {
        this.playersWhoAnswered = players;
      }
    );

    this.roundTimer = this._messageService.stopTimers.subscribe(() => {
      clearInterval(this.timer);
      if (this.player.isAdmin) {
        this._messageService.fetchRoundResults();
      }
    });
  }

  ngOnDestroy() {
    console.log('trivia component being cleaned up ...');

    this.roundSubscription.unsubscribe();
    this.roundResults.unsubscribe();
    this.roundPlayers.unsubscribe();
    this.roundTimer.unsubscribe();
  }

  pickAnswer(answerId: string) {
    this.answerPicked = true;
    this._messageService.playerAnswered(this.player, parseInt(answerId));
  }

  public viewScoreScreen(roundResults) {
    this.navigationExtras = {
      state: {
        roundResults: roundResults,
        player: this.player,
        roomCode: this._messageService.getRoomCode(),
      },
    };

    this.router.navigate([`/score`], this.navigationExtras);
  }

  timeLeftTimer = () => {
    let w = this.pb.nativeElement.style.width;
    w = parseInt(w);
    this.secondsLeft--; // used to show countdown #
    w -= 4;
    if (w < 30) {
      this.pb.nativeElement.classList.add('bg-warning');
      this.pb.nativeElement.classList.remove('bg-success');
    }
    if (w < 15) {
      this.pb.nativeElement.classList.remove('bg-warning');
      this.pb.nativeElement.classList.add('bg-danger');
    }

    this.pb.nativeElement.style.width = w + '%';

    if (w <= 1 && !this.timerStopped) {
      this.stopTimer();
    }
  };

  stopTimer() {
    clearInterval(this.timer);
    this.timerStopped = true;
  }

  startTimer() {
    this.timer = setInterval(this.timeLeftTimer, 1000);
  }
}
