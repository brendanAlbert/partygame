import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
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
export class DrawlobbyComponent implements OnInit, OnDestroy {
  @ViewChild('timeleft', { static: false }) countdowntimer: ElementRef;
  roomCode: string = '';
  username: string = '';
  inRoom: boolean = false;
  hasUsername: boolean = false;
  isAdmin: boolean = false;
  //   roomPlayers: string[] = [];
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
  drawMyOwn: boolean = false;
  placeHolderImg: string = '';
  readyToStart: boolean = false;

  id: string;

  gameLobbyLoaderTimer: any;

  constructor(private router: Router, private _drawService: DrawService) {
    this.playerImgUrl = environment.player_image_url;
    this.roomCode = '';
    this.inRoom = false;
    this.isAdmin = false;

    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      username: string;
      imgUrl: string;
      id: string;
      color1: string;
      color2: string;
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
      this.readyToStart = true;
      this.player.imageUrl = state.imgUrl;
      this.id = state.id;
    }
  }

  getPlayerColor(): string {
    return this.color1;
  }

  ngOnDestroy() {
    this._drawService.getDrawHubConnection().off('StartGame');
    this._drawService.getDrawHubConnection().off('connectedDrawUsers');
    this._drawService.getDrawHubConnection().off('FetchedYourImgUrl');
  }

  ngOnInit(): void {
    if (this._drawService.isConnectionSet() == true) {
      //   this._drawService.listenStartGame();
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

    this._drawService
      .getDrawHubConnection()
      .on('connectedDrawUsers', (drawPlayers: IDrawPlayer[]) => {
        console.log('users from draw service : ');
        console.log(drawPlayers);

        this.roomDrawPlayers = drawPlayers;

        drawPlayers.forEach((player) => {
          if (
            player.isAdmin &&
            player.name == this.username &&
            player.id == this.id
          ) {
            this.isAdmin = true;
            this.placeHolderImg = player.imageUrl;
          }
          if (player.name == this.username && player.id == this.id) {
            this.player = player;
            this.placeHolderImg = player.imageUrl;
          }
        });

        //   this.roomUsers = users;
        // this.incomingDrawPlayer.emit(users);
      });

    this.subscribeToEvents();

    if (this.roomCode !== '') {
      this._drawService.listenForAddDrawGroup();
    } else {
      this._drawService.listenGetActiveDrawGameLobbies();
    }

    this.countdown = false;

    if (this.activeDrawGameLobbies.length == 0) {
    }

    if (
      !this.readyToStart &&
      (this.roomCode == '' || this.activeDrawGameLobbies.length == 0)
    ) {
      this.gameLobbyLoaderTimer = setInterval(() => {
        this._drawService.getActiveDrawGameLobbies();
      }, 1000);
    }
  }

  enterRoom(roomcode: string) {
    clearInterval(this.gameLobbyLoaderTimer);

    this.roomCode = roomcode.toUpperCase();
    this.inRoom = true;

    // this._drawService.drawUserListener(roomcode);
    this._drawService.addDrawUser(roomcode);
    this._drawService.getConnectedDrawUsers(roomcode);
    // this._drawService.fetchPlaceholderImg(roomcode);

    // this is to show the placeholder img avatar at the username choosing stage
    this._drawService
      .getDrawHubConnection()
      .invoke('FetchMyPlaceholderImgUrl', this.roomCode)
      .catch((err) => {
        console.log('error fetching my placeholder img url ' + err);
      });

    this._drawService
      .getDrawHubConnection()
      .on('FetchedYourImgUrl', (imgUrl: string) => {
        this.placeHolderImg = imgUrl;
      });
  }

  addusername(username: string) {
    this.username = username;
    this.hasUsername = true;
    this.id = this.generateUUID();
    this._drawService.associateUserData(this.roomCode, username, this.id);
    this._drawService.getConnectedDrawUsers(this.roomCode);
    this._drawService.getActiveDrawGameLobbies();

    setTimeout(() => {
      this.roomDrawPlayers.forEach((player) => {
        console.log(`player.name == ${player.name}  username == ${username}`);
        if (player.name == username) {
          this.color1 = player.color1;
          this.color2 = player.color2;
        }
      });
    }, 1500);
  }

  keepplaceholder() {
    this.readyToStart = true;
    this._drawService.keepAvatar(
      this.roomCode,
      this.username,
      this.username + '_' + this.roomCode + '.png'
    );

    // this._drawService.listenStartGame();
    this._drawService.getDrawHubConnection().on('StartGame', () => {
      this.countdown = true;
      if (this.timer == null) {
        this.timer = setInterval(this.timeLeftTimer, 1000);
      }
    });

    let imgurl = `${this.id}_${this.username}_${this.roomCode}.png`;

    const imgUrlsToCopy = {
      originalUrl: this.placeHolderImg,
      newImageUrl: imgurl,
    };
    fetch(environment.avatar_copy_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imgUrlsToCopy),
    })
      .then((res) => res.json())
      .then((text) => {
        console.log('img url returned after copying ' + text.newImageUrl);
        this.player.imageUrl = text.newImageUrl;
      })
      .catch((err) => {
        console.log(err);
      });

    this._drawService.associateUserUrl(this.roomCode, this.username, imgurl);
  }

  generateUUID(): string {
    let randomCharacters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let stringToReturn = '';

    for (let i = 0; i < 5; i++) {
      stringToReturn +=
        randomCharacters[Math.floor(Math.random() * randomCharacters.length)];
    }
    return stringToReturn;
  }

  drawmyown() {
    this.drawMyOwn = true;
    this.navigationExtras = {
      state: {
        roomCode: this.roomCode,
        username: this.username,
        imgUrl: this.placeHolderImg,
        id: this.id,
        color1: this.color1,
        color2: this.color2,
      },
    };

    this.router.navigate([`/draw`], this.navigationExtras);
  }

  private subscribeToEvents = () => {
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
    // this._drawService.startGame(this.roomCode);
    this.roomCode = this.roomCode.toUpperCase();

    this._drawService
      .getDrawHubConnection()
      .invoke('StartGame', this.roomCode)
      .catch((err) => {
        console.log('error attempting to start game ' + err);
      });
  };
}
