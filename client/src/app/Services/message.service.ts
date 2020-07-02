import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import { group } from 'console';
import { IPlayer } from '../Models/Iplayer';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private hubConnection: signalR.HubConnection;
  private roomUsers: IPlayer[] = [];
  private roomCode: string = '';
  incomingPlayer = new EventEmitter<IPlayer[]>();
  startGame = new EventEmitter();

  //   public msgHubUrl = 'http://localhost:5000/msghub';
  public msgHubUrl = 'http://192.168.0.12:5000/msghub';

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.msgHubUrl)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while starting connection ' + err));
  };

  public ListenForAddToGroup() {
    this.hubConnection.on('Send', (data) => {
      console.log(data);
    });
  }

  public ListenForStartGame() {
    this.hubConnection.on('StartGame', () => {
      this.startGame.emit();
    });
  }

  public AddToGroup = (groupName: string) => {
    this.setRoomCode(groupName);
    this.hubConnection.invoke('AddToGroup', groupName).catch(function (err) {
      console.log(err.toString());
    });
  };

  public getConnectedUsers(groupName: string) {
    this.hubConnection
      .invoke('GetConnectedUsers', groupName)
      .catch((err) => console.error(err.toString()));
  }

  public userListener = (roomCode: string) => {
    this.hubConnection.on(roomCode, (users) => {
      console.log('users : ');
      console.log(users);
      this.roomUsers = users;
      this.incomingPlayer.emit(users);
    });
  };

  public fetchUsers(): IPlayer[] {
    return this.roomUsers;
  }

  private setRoomCode(roomCode: string) {
    this.roomCode = roomCode;
  }
  public getRoomCode(): string {
    return this.roomCode;
  }

  public associateUserWithId(userName: string, roomCode: string) {
    this.hubConnection
      .invoke('AssociateUserWithId', userName, roomCode)
      .catch((err) => console.error(err.toString()));
  }

  public initiateStartGame = () => {
    this.hubConnection
      .invoke('StartGame', this.getRoomCode())
      .catch((err) => console.error(err.toString()));
  };
}
