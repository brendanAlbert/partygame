import { Injectable, EventEmitter } from '@angular/core';
// import * as signalR from '@aspnet/signalr';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { IDrawPlayer } from '../Models/IDrawPlayer';
import { DrawPlayer } from '../Models/DrawPlayer';
@Injectable({
  providedIn: 'root',
})
export class DrawService {
  private drawHubConnection: signalR.HubConnection;
  incomingDrawPlayer = new EventEmitter<IDrawPlayer[]>();
  activeGameLobbies = new EventEmitter<string[]>();
  startGameEmitter = new EventEmitter();
  drawServiceConnectionSet: boolean = false;
  private roomCode: string;

  constructor() {
    this.drawServiceConnectionSet = false;
  }

  private drawHubUrl = environment.drawHubUrl;

  public startConnection = () => {
    this.drawHubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.drawHubUrl)
      .withAutomaticReconnect([0, 2000, 2000, 2000, 3000])
      .build();
    this.drawServiceConnectionSet = true;

    this.drawHubConnection
      .start()
      .then(() => {
        console.log('draw hub connection started');
        console.log(
          `this.drawHubConnection.connectionId = ${this.drawHubConnection.connectionId}`
        );
        localStorage.setItem(
          'wbg-connection-id',
          this.drawHubConnection.connectionId
        );
      })
      .catch((err) => console.log('error while starting connection ' + err));

    this.drawHubConnection.onclose((err) => {});

    this.drawHubConnection.onreconnecting((err) => {
      console.log('client reconnecting ...');
      console.error('the client connection state : ');
      console.error(this.drawHubConnection.state);
    });

    this.drawHubConnection.onreconnected((err) => {
      console.log(' onreconnected callback fired .');
      console.error('the client connection state : ');
      console.error(this.drawHubConnection.state);
    });
  };

  public stopConnection = () => {
    this.drawHubConnection
      .stop()
      .then(() => console.log('draw hub connection ended'))
      .catch((err) => console.log('error while starting connection ' + err));
    this.drawServiceConnectionSet = false;
  };

  public isConnectionSet() {
    return this.drawServiceConnectionSet;
  }

  public getConnectedDrawUsers(roomCode: string) {
    this.drawHubConnection
      .invoke('GetConnectedDrawUsers', roomCode)
      .catch((err) =>
        console.log('error attempting to fetch draw users ' + err)
      );
  }

  public addDrawUser(roomCode: string) {
    console.log('attempting to invoke add to draw group');
    this.roomCode = roomCode;
    this.drawHubConnection
      .invoke('AddToDrawGroup', roomCode)
      .catch(function (err) {
        console.log(err.toString());
      });
  }

  public listenForAddDrawGroup() {
    this.drawHubConnection.on('DrawSend', (msg) => {
      console.log(msg);
      this.getConnectedDrawUsers(this.roomCode);
    });
  }

  //   public drawUserListener = (roomCode: string) => {
  //     this.drawHubConnection.on('connectedDrawUsers', (users: IDrawPlayer[]) => {
  //       console.log('users from draw service : ');
  //       console.log(users);
  //       //   this.roomUsers = users;
  //       this.incomingDrawPlayer.emit(users);
  //     });
  //   };

  public getActiveDrawGameLobbies() {
    console.log('getting active game lobbies ...');
    this.drawHubConnection
      .invoke('GetActiveGameLobbies')
      .catch((err) =>
        console.log('error attempting to fetch game lobbies ' + err)
      );
  }

  public listenGetActiveDrawGameLobbies() {
    this.drawHubConnection.on('ActiveLobbies', (activeLobbies: string[]) => {
      console.log('active lobbies returned: ');

      this.activeGameLobbies.emit(activeLobbies);
    });
  }

  public associateUserData(roomCode: string, userName: string, id: string) {
    this.drawHubConnection
      .invoke('AssociateUserWithId', userName, roomCode, id)
      .catch((err) =>
        console.log('error attempting to associate user info ' + err)
      );
  }

  public associateUserUrl(roomCode: string, userName: string, url: string) {
    this.drawHubConnection
      .invoke('AssociateUserWithUrl', userName, roomCode, url)
      .catch((err) =>
        console.log('error attempting to associate user info ' + err)
      );
  }

  public keepAvatar(roomCode: string, userName: string, url: string) {
    this.drawHubConnection
      .invoke('KeepAvatar', userName, roomCode, url)
      .catch((err) => console.log('error attempting to keep avatar ' + err));
  }

  //   public startGame(room: string) {
  //     room = room.toUpperCase();

  //     this.drawHubConnection.invoke('StartGame', room).catch((err) => {
  //       console.log('error attempting to start game ' + err);
  //     });

  // here we want to invoke the 65ish second count down on the server
  // we do it here because it will only get invoked once, since there is only 1 admin

  // this.drawHubConnection.invoke('StartDrawPromptTimer', room).catch((err) => {
  //   console.log('error attempting to start prompt timer ' + err);
  // });
  //   }

  public getDrawHubConnection() {
    return this.drawHubConnection;
  }

  //   public listenStartGame() {
  //     this.drawHubConnection.on('StartGame', () => {
  //       console.log('RECEIVED START GAME SIGNAL FROM BACKEND, EMITTING EVENT');
  //       //   this.startGameEmitter.emit();
  //     });
  //   }

  public fetchPrompt(room: string) {
    this.drawHubConnection.invoke('FetchPrompt', room).catch((err) => {
      console.log('error fetching prompt' + err);
    });
  }

  // FUNCTION TO SUBMIT USER ARTWORK FOR ROUND X OF PROMPT
  public submitUserArtwork(room: string, url: string, prompt: string) {
    this.drawHubConnection
      .invoke('ArtSubmission', room, url, prompt)
      .catch((err) =>
        console.log('error attempting submit user art submission ' + err)
      );
  }

  public newPromptLobbyArrival(room: string, player: IDrawPlayer) {
    this.drawHubConnection
      .invoke('NewLobbyArrival', room, player)
      .catch((err) => console.log('error invoking new lobby arrival ' + err));
  }

  public startPrompt(roomCode: string) {
    this.drawHubConnection
      .invoke('FetchRandomPromptRound', roomCode)
      .catch((err) => console.log('error starting prompt ' + err));
  }

  public addUserGuessForPrompt(
    room: string,
    player: IDrawPlayer,
    guess: string
  ) {
    this.drawHubConnection
      .invoke('AddUserGuessForPrompt', room, player, guess)
      .catch((err) =>
        console.log('error adding user guess for prompt image ' + err)
      );
  }

  public fetchAllGuessesForPromptRound(room: string) {
    this.drawHubConnection
      .invoke('FetchAllGuessesForPromptRound', room)
      .catch((err) =>
        console.log('error fetching all guesses for prompt round' + err)
      );
  }

  public addPlayerToListWaitingToSeeResults(
    room: string,
    player: IDrawPlayer,
    chosenAnswer: string
  ) {
    this.drawHubConnection
      .invoke('AddPlayerToListWaitingToSeeResults', room, player, chosenAnswer)
      .catch((err) =>
        console.log('error adding player to list waiting to see results' + err)
      );
  }

  public takePlayersToResultsScreen(room: string) {
    this.drawHubConnection
      .invoke('TakePlayersToResultsScreen', room)
      .catch((err) =>
        console.log(
          'error starting process of taking players to results screen ' + err
        )
      );
  }

  //   let theme = localStorage.getItem("theme");
  // localStorage.setItem("theme", mode);
}
