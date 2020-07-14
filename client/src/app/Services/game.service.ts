import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hacker } from '../Models/Hacker';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  users: any[];

  user: any;

  private hackers_api_endpoint = 'http://192.168.0.12:5000/hackers';

  constructor(private httpClient: HttpClient) {
    this.users = [];
    this.user = {};
  }

  addUser(user: any) {
    this.user = user;
  }

  addUserToList(user: any) {
    this.users.push(user);
  }

  getUsers() {
    return this.users;
  }

  fetchHackers(): Observable<Hacker[]> {
    return this.httpClient.get<Hacker[]>(this.hackers_api_endpoint);
  }

  addHacker(hacker: Hacker) {
    this.httpClient.post(this.hackers_api_endpoint + '/add', hacker).subscribe(
      (data) => {
        // console.log('Post request successful', data);
      },
      (error) => {
        // console.log('Error posting hacker', error);
      }
    );
  }
}
