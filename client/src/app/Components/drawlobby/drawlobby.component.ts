import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { IDrawPlayer } from '../../Models/IDrawPlayer';
import { DrawPlayer } from '../../Models/DrawPlayer';
import { environment } from '../../../environments/environment';
import { DrawService } from '../../Services/draw.service';

@Component({
  selector: 'app-drawlobby',
  templateUrl: './drawlobby.component.html',
  styleUrls: ['./drawlobby.component.sass'],
})
export class DrawlobbyComponent implements OnInit {
  @ViewChild('timeleft', { static: false }) countdowntimer: ElementRef;
  roomCode: string = '';
  username: string = '';
  inRoom: boolean = false;
  hasUsername: boolean = false;
  isAdmin: boolean = false;
  roomPlayers: string[] = [];
  roomDrawPlayers: IDrawPlayer[] = [];
  navigationExtras: NavigationExtras = {};
  playerImgUrl: string;
  playerImgReceived: boolean = false;
  activeDrawGameLobbies: string[] = [];
  color1: string = '';
  color2: string = '';
  countdown: boolean;
  timer: any = null;
  secondsLeft: number = 5;
  player: IDrawPlayer = new DrawPlayer();

  constructor(private router: Router, private _drawService: DrawService) {
    this.playerImgUrl = environment.player_image_url;
    this.roomCode = '';
    this.inRoom = false;
    this.isAdmin = false;

    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      username: string;
      color1: string;
      color2: string;
      //   imgUrl: string;
    };
    if (state) {
      this.roomCode = state.roomCode;
      this.username = state.username;
      this.color1 = state.color1;
      this.color2 = state.color2;
      this.inRoom = true;
      this.hasUsername = true;
      this.player.color1 = state.color1;
      this.player.color2 = state.color2;
      this.player.name = state.username;
      this.playerImgReceived = true;
    }
  }

  getPlayerColor(): string {
    return this.color1;
  }

  ngOnDestroy() {}

  ngOnInit(): void {
    if (this._drawService.isConnectionSet() == true) {
      this._drawService.listenStartGame();
      this._drawService.getDrawHubConnection().on('StartGame', () => {
        this.countdown = true;
        if (this.timer == null) {
          this.timer = setInterval(this.timeLeftTimer, 1000);
        }
      });
    }
    if (this._drawService.isConnectionSet() == false) {
      this._drawService.startConnection();
    }

    this.subscribeToEvents();

    if (this.roomCode !== '') {
      this._drawService.listenForAddDrawGroup();
    } else {
      this._drawService.listenGetActiveDrawGameLobbies();
      setTimeout(() => {
        this._drawService.getActiveDrawGameLobbies();
      }, 500);
    }

    this.countdown = false;
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
      this.roomDrawPlayers.forEach((player) => {
        console.log(`player.name == ${player.name}  username == ${username}`);
        if (player.name == username) {
          color1 = player.color1;
          color2 = player.color2;
        }
      });

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
    this._drawService.incomingDrawPlayer.subscribe(
      (drawPlayers: IDrawPlayer[]) => {
        this.roomDrawPlayers = drawPlayers;

        drawPlayers.forEach((player) => {
          if (player.isAdmin && player.name == this.username) {
            this.isAdmin = true;
          }
          if (player.name == this.username) {
            this.player = player;
          }
        });
      }
    );

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
          },
        };

        this.router.navigate([`/prompt`], this.navigationExtras);
      } else {
        this.countdowntimer.nativeElement.innerHTML = this.secondsLeft--;
      }
    }
  };

  startGame = () => {
    console.log('admin tapped start game');
    this._drawService.startGame(this.roomCode);
  };
}
