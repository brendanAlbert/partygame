import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { IPlayer } from 'src/app/Models/Iplayer';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.sass'],
})
export class ScoreComponent implements OnInit, OnDestroy {
  scoreResults: any;
  @ViewChild('progressBar') pb: ElementRef;
  secondsLeft: number;
  timer: any;
  navigationExtras: NavigationExtras = {};
  player: IPlayer;
  roomCode: string;

  constructor(private router: Router, private _messageService: MessageService) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roundResults: any;
      player: IPlayer;
      roomCode: string;
    };
    this.scoreResults = state.roundResults;
    this.player = state.player;
    this.roomCode = state.roomCode;
    this.secondsLeft = 10;
  }

  ngOnInit(): void {
    if (!this.scoreResults.lastRound) {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    console.log('cleaning up score component...');
    if (this.scoreResults.lastRound) {
      this._messageService.stopConnection();
    }
  }

  timeLeftTimer = () => {
    let w = this.pb.nativeElement.style.width;
    w = parseInt(w);
    this.secondsLeft--;
    w -= 10;
    if (w < 30) {
      this.pb.nativeElement.classList.add('bg-warning');
      this.pb.nativeElement.classList.remove('bg-info');
    }
    // if (w < 15) {
    //   this.pb.nativeElement.classList.remove('bg-warning');
    //   this.pb.nativeElement.classList.add('bg-danger');
    // }

    this.pb.nativeElement.style.width = w + '%';

    if (w <= 1) {
      this.stopTimer();
    }
  };

  stopTimer() {
    clearInterval(this.timer);

    if (this.scoreResults.lastRound) {
      // show final score screen
    } else {
      this.navigationExtras = {
        state: {
          roomCode: this.roomCode,
          player: this.player,
        },
      };
      this.router.navigate([`/trivia`], this.navigationExtras);
    }
  }

  startTimer() {
    this.timer = setInterval(this.timeLeftTimer, 1000);
  }
}
