import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DrawService } from '../../Services/draw.service';
import { DrawPlayer } from 'src/app/Models/DrawPlayer';
import { IDrawPlayer } from 'src/app/Models/IDrawPlayer';
@Component({
  selector: 'app-promptlobby',
  templateUrl: './promptlobby.component.html',
  styleUrls: ['./promptlobby.component.sass'],
})
export class PromptlobbyComponent implements OnInit {
  @ViewChild('timeleft', { static: false }) countdowntimer: ElementRef;
  roomCode: string = '';
  username: string = '';
  inRoom: boolean = false;
  hasUsername: boolean = false;
  isAdmin: boolean = false;
  roomPlayers: string[] = [];
  promptLobbyPlayers: DrawPlayer[] = [];
  navigationExtras: NavigationExtras = {};
  playerImgUrl: string;
  activeDrawGameLobbies: string[] = [];
  color1: string = '';
  color2: string = '';
  countdown: boolean;
  timer: any = null;
  secondsLeft: number = 5;
  player: DrawPlayer;
  promptRoundURL: string = '';

  constructor(private router: Router, private _drawService: DrawService) {
    this.playerImgUrl = environment.player_image_url;
    this.roomCode = '';
    this.inRoom = false;
    this.isAdmin = false;

    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      player: DrawPlayer;
    };
    if (state) {
      this.roomCode = state.roomCode;
      this.player = state.player;
      this.inRoom = true;
      this.hasUsername = true;

      if (state.player.isAdmin) {
        this.isAdmin = true;
      }
    }
  }

  getPlayerColor(): string {
    return this.color1;
  }

  ngOnInit(): void {
    this.subscribeToEvents();
    this._drawService
      .getDrawHubConnection()
      .on('FetchedNewLobbyArrivals', (players: IDrawPlayer[]) => {
        this.promptLobbyPlayers = players;
      });

    this.countdown = false;

    this._drawService
      .getDrawHubConnection()
      .on('FetchedRandomPromptRound', (gameRoundDTO: any) => {
        // gameRoundDTO.url = "some_url.png"
        this.promptRoundURL = gameRoundDTO.url;
        this.countdown = true;
        this.timer = setInterval(this.timeLeftTimer, 1000);
      });
  }

  enterRoom(roomcode: string) {
    this.roomCode = roomcode.toUpperCase();
    this.roomCode = roomcode;
    this.inRoom = true;
    // this.navigationExtras = {
    //   state: {
    //     roomCode: this.roomCode,
    //     // player: this.player,
    //   },
    // };
    this._drawService.drawUserListener(roomcode);
    this._drawService.addDrawUser(roomcode);
    this._drawService.getConnectedDrawUsers(roomcode);
    // if (this.roomCode !== '') {
    //   }
    // this.router.navigate([`/draw`], this.navigationExtras);
  }

  addusername(username: string) {
    // this._drawService.associateUserData(
    //   this.roomCode,
    //   username,
    //   'test_test.png'
    // );
    this.username = username;
    this.hasUsername = true;
    this._drawService.associateUserData(
      this.roomCode,
      username,
      'Dildo baggins_test.png'
    );
    this._drawService.getConnectedDrawUsers(this.roomCode);
    this._drawService.getActiveDrawGameLobbies();

    // wait a second before navigating away, we need the color1/2
    let color1: string;
    let color2: string;

    setTimeout(() => {
      //   this.roomDrawPlayers.forEach((player) => {
      //     console.log(`player.name == ${player.name}  username == ${username}`);
      //     if (player.name == username) {
      //       color1 = player.color1;
      //       color2 = player.color2;
      //     }
      //   });

      this.navigationExtras = {
        state: {
          roomCode: this.roomCode,
          username: this.username,
          color1: color1,
          color2: color2,
        },
      };

      this.router.navigate([`/draw`], this.navigationExtras);
    }, 1500);
  }

  private subscribeToEvents = () => {
    // this._drawService.incomingDrawPlayer.subscribe(
    //   (drawPlayers: IDrawPlayer[]) => {
    //     this.roomDrawPlayers = drawPlayers;

    //     drawPlayers.forEach((player) => {
    //       if (player.isAdmin && player.name == this.username) {
    //         this.isAdmin = true;
    //       }
    //     });
    //   }
    // );

    this._drawService.activeGameLobbies.subscribe((activeLobbies: string[]) => {
      this.activeDrawGameLobbies = activeLobbies;
    });
  };

  stopInterval = () => {
    clearInterval(this.timer);
  };

  timeLeftTimer = () => {
    if (this.timer != null) {
      if (this.secondsLeft < 0) {
        clearInterval(this.timer);
        this.timer = null;

        console.log('here is where we transition to the next route');
        this.stopInterval();
        this.countdowntimer = null;

        this.navigationExtras = {
          state: {
            roomCode: this.roomCode,
            player: this.player,
            promptRoundURL: this.promptRoundURL,
          },
        };

        this.router.navigate([`/guessprompt`], this.navigationExtras);
      } else {
        this.countdowntimer.nativeElement.innerHTML = this.secondsLeft--;
      }
    }
  };

  startPrompt = () => {
    console.log('admin tapped start prompt');
    // this._drawService.startGame(this.roomCode);
    this._drawService.startPrompt(this.roomCode);
  };
}
