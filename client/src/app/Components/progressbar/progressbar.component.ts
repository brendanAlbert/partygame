import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.sass'],
})
export class ProgressbarComponent implements OnInit {
  @ViewChild('progressBar') pb: ElementRef;
  roomCode: string;
  timer: any;
  secondsLeft: number = 25;
  timerStopped: boolean = false;

  constructor(private _messageService: MessageService) {}

  ngOnInit(): void {
    this.subscribeToRoundStartEmitter();
  }

  private subscribeToRoundStartEmitter() {
    this.roomCode = this._messageService.getRoomCode();
    this._messageService.startRound.subscribe(() => {
      this.startTimer();
    });
    this._messageService.endRound.subscribe(() => {
      console.log('Stopping Timer');
      if (!this.timerStopped) {
        this.stopTimerAllPlayersAnswered();
      }
    });
  }

  timeLeftTimer = () => {
    let w = this.pb.nativeElement.style.width;
    w = parseInt(w);
    this.secondsLeft--;
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
      return;
    }
  };

  ngAfterViewInit() {}

  stopTimer() {
    clearInterval(this.timer);
    this.timerStopped = true;
    // this._messageService.emitStopRound();
    this._messageService.roundTimeUp();
  }

  stopTimerAllPlayersAnswered() {
    clearInterval(this.timer);
    this.timerStopped = true;
  }

  startTimer() {
    this.timer = setInterval(this.timeLeftTimer, 1000);
  }
}
