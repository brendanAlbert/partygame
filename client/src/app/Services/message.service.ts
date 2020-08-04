import { EventEmitter, Injectable } from '@angular/core';
// import * as signalR from '@aspnet/signalr';
import * as signalR from '@microsoft/signalr';
import { IPlayer } from '../Models/Iplayer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private hubConnection: signalR.HubConnection;
  private roomUsers: IPlayer[] = [];
  private roomCode: string = '';
  incomingPlayer = new EventEmitter<IPlayer[]>();
  answeredPlayers = new EventEmitter<IPlayer[]>();
  startGame = new EventEmitter();
  startRound = new EventEmitter();
  //   endRound = new EventEmitter();
  visitScore = new EventEmitter();
  roundResults = new EventEmitter();
  nextRound = new EventEmitter();
  stopTimers = new EventEmitter();

  constructor() {}

  private msgHubUrl = environment.msgHubUrl;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.msgHubUrl)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while starting connection ' + err));

    this.hubConnection.on('FetchedNextRound', (nextRound: any) => {
      console.log('FETCHED NEXT ROUND : ');
      this.startRound.emit(nextRound);
    });

    this.hubConnection.on('RoundEndedShowScore', () => {
      console.log('calling this._messageService.visitScore.emit()');
      this.stopTimers.emit();
      //   this.fetchRoundResults(); // moved to trivia b.c. we only want admin to fetch
    });

    this.hubConnection.on('RoundResults', (roundResults: any) => {
      console.log('Round Results received from backend : ');
      this.roundResults.emit(roundResults);
    });

    this.hubConnection.on('UsersWhoAnswered', (players: IPlayer[]) => {
      console.log('EMITTING PLAYERS WHO HAVE ANSWERED ######');
      this.answeredPlayers.emit(players);
    });
  };

  public stopConnection() {
    this.hubConnection.stop();
  }

  //   public ListenForAddToGroup() {
  //     this.hubConnection.on('Send', (data) => {
  //       console.log(data);
  //     });
  //   }

  public ListenForStartGame() {
    this.hubConnection.on('StartGame', () => {
      this.startGame.emit();
    });
  }

  public playerAnswered(player: IPlayer, answerId: number) {
    this.hubConnection
      .invoke('PlayerAnswered', player, answerId, this.roomCode)
      .catch((err) => console.error(err.toString()));
  }

  public AddToGroup = (groupName: string) => {
    this.setRoomCode(groupName);
    this.hubConnection.invoke('AddToGroup', groupName).catch(function (err) {
      console.log(err.toString());
    });
  };

  public getConnectedUsers() {
    this.hubConnection
      .invoke('GetConnectedUsers', this.getRoomCode())
      .catch((err) => console.error(err.toString()));
  }

  public userListener = (roomCode: string) => {
    this.hubConnection.on(roomCode, (users) => {
      console.log('users from message service : ');
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

  //   public roundTimeUp() {
  //     console.log('invoking RoundTimeUp');
  //     this.hubConnection
  //       .invoke('EndRound', this.getRoomCode())
  //       .catch((err) => console.error(err.toString()));
  //   }

  public fetchRoundResults() {
    console.log('fetching round results ...');
    this.hubConnection
      .invoke('FetchRoundResults', this.getRoomCode())
      .catch((err) => console.error(err.toString()));
  }

  public fetchNextRound() {
    console.log('FETCHING NEXT ROUND');
    this.hubConnection
      .invoke('FetchNextRound', this.roomCode)
      .catch((err) => console.error(err.toString()));
  }
}
