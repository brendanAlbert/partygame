import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private hubConnection: signalR.HubConnection;

  public msgHubUrl = 'http://localhost:5000/msghub';

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

  public AddToGroup = (groupName: string) => {
    this.hubConnection.invoke('AddToGroup', groupName).catch(function (err) {
      console.log(err.toString());
    });
  };

  //   public LeaveGroup = (groupName: string) => {
  //     this.hubConnection
  //       .invoke('RemoveFromGroup', groupName)
  //       .catch(function (err) {
  //         console.log(err.toString());
  //       });
  //   };

  public messageListener = () => {
    this.hubConnection.on('ReceiveMessage', (data) => {
      console.log(data);
    });
  };

  public emittedUsers(): string[] {
    let users: string[] = [];

    this.hubConnection.on('EmitUsersList', (data: string[]) => {
      console.log('emitted user list:');
      console.log(data);
      users = data;
    });

    return users;
  }

  public getUsersInRoom = (roomcode: string) => {
    this.hubConnection.invoke('GetUsersInRoom', roomcode).catch((err) => {
      return console.error(err.toString());
    });
  };

  public sendMessage = (
    user: string,
    message: string = 'sent message',
    roomCode: string
  ) => {
    // let user = 'player';
    this.hubConnection
      .invoke('SendMessage', user, message, roomCode)
      .catch(function (err) {
        return console.error(err.toString());
      });
  };

  //     private subject = new Subject<any>();
  //   sendMessage(message: string) {
  //     this.subject.next({ text: message });
  //   }

  //   clearMessage() {
  //     this.subject.next();
  //   }

  //   getMessage(): Observable<any> {
  //     return this.subject.asObservable();
  //   }
}
