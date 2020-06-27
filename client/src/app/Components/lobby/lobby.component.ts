import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../Services/message.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.sass'],
})
export class LobbyComponent implements OnInit {
  roomCode: string;
  codeEntered: boolean = false;
  userAdded: boolean = false;

  players: string[] = [
    'player 1',
    'player 2',
    // 'player 3',
    // 'player 4',
    // 'player 5',
  ];

  colors: string[] = [
    'bg-primary',
    'bg-warning',
    'bg-danger',
    'bg-info',
    'bg-dark',
    'bg-secondary',
  ];

  // {{ getRandomColor() }}

  constructor(
    private _messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // this.startHttpRequest();
    this._messageService.startConnection();
    this._messageService.ListenForAddToGroup();
  }

  //   ngOnDestroy(): void {
  //     this._messageService.LeaveGroup(this.roomCode);
  //   }

  //   private startHttpRequest = () => {
  //     this.http.get(this._messageService.msgHubUrl).subscribe((res) => {
  //       console.log(res);
  //     });
  //   };

  sendMessage = (user: string, message: string = '', roomCode: string) => {
    this._messageService.sendMessage(user, message, roomCode);
  };

  enterGameLobby(roomCode: string): void {
    this.codeEntered = true;
    // this._messageService.messageListener();
    this.roomCode = roomCode;
    // this.players = this._messageService.emittedUsers();
    this._messageService.AddToGroup(roomCode);
    // console.log('this . players = ');
    // console.log(this.players);
  }

  //   getUsersInRoom(roomCode: string) {
  //   }

  //   getRandomColor(): string {
  //     return this.colors[Math.floor(Math.random() * this.colors.length)];
  //   }

  addUserToLobby(player: string) {
    console.log(`pushing player ${player} to players list`);
    this.players.push(player);
    this.userAdded = true;

    // this.sendMessage(
    //   player,
    //   `player ${player} has joined the lobby`,
    //   this.roomCode
    // );
    // console.log(`players list = ${this.players}`);
    // setTimeout(() => {
    //   this._messageService.getUsersInRoom(this.roomCode);
    // }, 1000);
  }
}
