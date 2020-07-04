import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../Services/message.service';
import { HttpClient } from '@angular/common/http';
import { IPlayer } from 'src/app/Models/Iplayer';
import { Player } from 'src/app/Models/player';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.sass'],
})
export class LobbyComponent implements OnInit {
  roomCode: string;
  userAdded: boolean = false;
  player: IPlayer = new Player();
  players: IPlayer[] = [];
  navigationExtras: NavigationExtras = {};

  constructor(
    private apiService: ApiService,
    private _messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._messageService.startConnection();
    this._messageService.ListenForAddToGroup();
    this._messageService.ListenForStartGame();
    this.subscribeToEvents();
  }

  enterGameLobby(roomCode: string): void {
    roomCode = roomCode.toUpperCase();
    this.roomCode = roomCode;
    this._messageService.userListener(roomCode);
    this._messageService.AddToGroup(roomCode);
    this.players = this._messageService.fetchUsers();
    this._messageService.getConnectedUsers(this._messageService.getRoomCode());
  }

  addUserToLobby(playerName: string) {
    this._messageService.associateUserWithId(
      playerName,
      this._messageService.getRoomCode()
    );
    this.player.name = playerName;
    this.userAdded = true;
    this.getUsers();
  }

  getUsers = () => {
    this._messageService.getConnectedUsers(this._messageService.getRoomCode());
    setTimeout(() => {
      console.log('players list updated');
      this.players = this._messageService.fetchUsers();
      console.log(this.players);
      this.setAdminStatus();
    }, 1000);
  };

  private subscribeToEvents(): void {
    this._messageService.incomingPlayer.subscribe((players: IPlayer[]) => {
      this.players = players;
    });

    this._messageService.startGame.subscribe(() => {
      this.startGame();
    });
  }

  private setAdminStatus = () => {
    this.players.forEach((player) => {
      if (player.name == this.player.name && player.isAdmin) {
        this.player.isAdmin = true;
      }
    });
  };

  private startGame() {
    this.navigationExtras = {
      state: {
        roomCode: this.roomCode,
        player: this.player,
      },
    };
    this.router.navigate([`/trivia`], this.navigationExtras);
  }

  public initiateStartGame() {
    this._messageService.initiateStartGame();
  }
}
