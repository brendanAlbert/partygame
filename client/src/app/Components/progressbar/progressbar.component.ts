import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.sass'],
})
export class ProgressbarComponent implements OnInit {
  @ViewChild('progressBar') pb: ElementRef;
  timer: any;
  secondsLeft: number = 25;
  timerStopped: boolean = false;

  constructor(private _messageService: MessageService) {
    console.log('instantiated progressbar component');
  }

  ngOnInit(): void {
    this.subscribeToRoundEmitters();
  }

  private subscribeToRoundEmitters() {
    // this.roomCode = this._messageService.getRoomCode();
    this._messageService.startRound.subscribe(() => {
      if (!this.timerStopped) {
        this.startTimer();
      }
    });

    // this._messageService.getHubConnection().on('RoundEndedShowScore', () => {
    //   console.log('Stopping Timer');
    //   if (!this.timerStopped) {
    //     this.stopTimerAllPlayersAnswered();
    //     this._messageService.visitScore.emit();
    //   } else {
    //     console.log(
    //       'did not call visitScore.emit because timer already stopped'
    //     );
    //   }
    // });
    // this._messageService.endRound.subscribe(() => {
    // });
  }

  timeLeftTimer = () => {
    let w = this.pb.nativeElement.style.width;
    w = parseInt(w);
    this.secondsLeft--; // used to show countdown #
    console.log('for some reason the seconds timer gets hit twice ??');
    console.log(`this.secondsLeft = ${this.secondsLeft}`);
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

  ngAfterViewInit() {}

  stopTimer() {
    clearInterval(this.timer);
    this.timerStopped = true;
    // this._messageService.roundTimeUp();
  }

  stopTimerAllPlayersAnswered() {
    clearInterval(this.timer);
    this.timerStopped = true;
  }

  startTimer() {
    this.timer = setInterval(this.timeLeftTimer, 1000);
  }
}
