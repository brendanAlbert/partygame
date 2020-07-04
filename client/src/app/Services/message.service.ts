import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { IPlayer } from '../Models/Iplayer';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private hubConnection: signalR.HubConnection;
  private roomUsers: IPlayer[] = [];
  //   private usersWhoAnswered: IPlayer[] = [];
  private roomCode: string = '';
  private roundNumber: number;
  private roundResultsFetched: boolean = false;
  private roundResultsReceived: boolean = false;
  incomingPlayer = new EventEmitter<IPlayer[]>();
  answeredPlayers = new EventEmitter<IPlayer[]>();
  startGame = new EventEmitter();
  startRound = new EventEmitter();
  endRound = new EventEmitter();
  visitScore = new EventEmitter();
  roundResults = new EventEmitter();

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

  public ListenRoundEndedShowScore() {
    this.hubConnection.on('RoundEndedShowScore', () => {
      console.log('Emitting Stop Round.');
      this.endRound.emit();

      this.visitScore.emit();
    });
  }

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

  public ListenForAnswerSubmitted() {
    this.hubConnection.on('AnswerSubmitted', () => {
      this.getUsersWhoAnswered(this.getRoomCode());
    });
  }

  public ListenForUsersWhoAnswered() {
    this.hubConnection.on('UsersWhoAnswered', (players: IPlayer[]) => {
      this.answeredPlayers.emit(players);
    });
  }

  public getUsersWhoAnswered(roomCode: string) {
    this.hubConnection
      .invoke('GetUsersWhoAnswered', roomCode, this.roundNumber)
      .catch((err) => console.error(err.toString()));
  }

  public AddToGroup = (groupName: string) => {
    this.setRoomCode(groupName);
    this.setRoundNumber(0);
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

  public emitStartRound() {
    this.startRound.emit();
  }

  //   public emitStopRound() {
  //     // this.endRound.emit();
  //     this.hubConnection
  //       .invoke('EndRound', this.getRoomCode(), this.roundNumber)
  //       .catch((err) => console.error(err.toString()));
  //   }

  public roundTimeUp() {
    console.log('invoking RoundTimeUp');
    this.hubConnection
      .invoke('RoundTimeUp', this.getRoomCode(), this.roundNumber)
      .catch((err) => console.error(err.toString()));
  }

  private setRoundNumber(roundNumber: number) {
    this.roundNumber = roundNumber;
  }

  public playerAnswered(
    player: IPlayer,
    answerId: number,
    roundNumber: number
  ) {
    this.hubConnection
      .invoke('PlayerAnswered', player, answerId, roundNumber, this.roomCode)
      .catch((err) => console.error(err.toString()));
  }

  public fetchRoundResults() {
    if (!this.roundResultsFetched) {
      this.roundResultsFetched = true;
      console.log('fetching round results ...');
      this.hubConnection
        .invoke('FetchRoundResults', this.getRoomCode(), this.roundNumber)
        .catch((err) => console.error(err.toString()));
    }
  }

  public listenFetchRoundResults() {
    console.log('Round Results received from backend : ');
    this.hubConnection.on('RoundResults', (roundResults: any) => {
      console.log('Round Results received from backend : ');
      console.log('roundResults');
      if (!this.roundResultsReceived) {
        this.roundResultsReceived = true;
        this.roundResults.emit(roundResults);
      }
    });
  }
}
