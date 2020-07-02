import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { Router } from '@angular/router';

import { ITrivium } from '../../Models/ITrivium';
import { MessageService } from 'src/app/Services/message.service';
import { IPlayer } from 'src/app/Models/Iplayer';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.sass'],
})
export class TriviaComponent implements OnInit {
  @ViewChild('progressBar') pb: ElementRef;
  question: string = '';
  questionTrivium: ITrivium;
  answerOptions: ITrivium[];
  roomCode: string;
  roundNumber: number = 0;
  players: IPlayer[] = [];

  shuffledTrivia: ITrivium[];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private _messageService: MessageService
  ) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
    };
    // .extras.state.roomCode('roomCode');
    console.log(`room code received from lobby component = ${state.roomCode}`);
    this.roomCode = state.roomCode;
  }

  ngOnInit(): void {
    this.getUsers();
    this.apiService
      .fetchTrivia(this.roomCode, this.roundNumber)
      .subscribe((data: any) => {
        this.questionTrivium = data.questionTrivium;
        // this.question = data[0].answerTrivium.question;
        this.answerOptions = data.wrongTrivia;
        //   console.log(data['data'][0]);
        //   console.log(this.question);
        console.info(data);
        //   console.log(this.answerOptions);
      });
  }

  ngAfterViewInit() {
    const timeLeftTimer = () => {
      //   let w = this.pb.style.width;
      let w = this.pb.nativeElement.style.width;
      // this.renderer.setStyle(this.pb.nativeElement, 'width', )
      w = parseInt(w);
      // 100 % / 15 seconds = 6.6666667
      // 100% / 25 secs = 4
      w -= 4;
      if (w < 30) {
        this.pb.nativeElement.classList.add('bg-warning');
        this.pb.nativeElement.classList.remove('bg-success');
      }
      if (w < 15) {
        this.pb.nativeElement.classList.remove('bg-warning');
        this.pb.nativeElement.classList.add('bg-danger');
      }

      //   console.log(w);
      this.pb.nativeElement.style.width = w + '%';

      if (w <= 1) {
        clearInterval(tmr);
        return;
      }
    };
    let tmr = setInterval(timeLeftTimer, 1000);
  }

  getUsers = () => {
    this._messageService.getConnectedUsers(this._messageService.getRoomCode());
    setTimeout(() => {
      console.log('players list updated');
      this.players = this._messageService.fetchUsers();
    }, 100);
  };
}
