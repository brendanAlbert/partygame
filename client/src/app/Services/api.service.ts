import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private trivia_api_endpoint = 'http://localhost:5000/trivia';
  //   private trivia_api_endpoint = 'http://192.168.0.12:5000/trivia';

  constructor(private httpClient: HttpClient) {}

  public fetchTrivia(roomCode: string, roundNumber: number) {
    return this.httpClient.get(
      this.trivia_api_endpoint + `/${roomCode}/${roundNumber}`
    );
  }
}
