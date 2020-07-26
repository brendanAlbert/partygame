import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  private trivia_api_endpoint = environment.trivia_api_endpoint;

  constructor(private httpClient: HttpClient) {}

  public fetchTrivia(roomCode: string, roundNumber: number) {
    return this.httpClient.get(
      this.trivia_api_endpoint + `/${roomCode}/${roundNumber}`
    );
  }
}
