import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DrawService } from 'src/app/Services/draw.service';
import { IDrawPlayer } from 'src/app/Models/IDrawPlayer';
import { environment } from '../../../environments/environment';
import { DrawPlayer } from 'src/app/Models/DrawPlayer';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.sass'],
})
export class PromptComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('clearCanvasBtn') clearCanvasBtn: ElementRef;
  @ViewChild('avatarBtn') avatarbtn: ElementRef;
  @ViewChild('color1') colorBtn1: ElementRef;
  @ViewChild('color2') colorBtn2: ElementRef;
  @ViewChild('prompt') prompt: ElementRef;
  @ViewChild('counter') counter: ElementRef;
  @ViewChild('timeleft', { static: false }) countdowntimer: ElementRef;

  navigationExtras: NavigationExtras = {};
  activeColor: string;
  roomCode: string;
  //   sending: boolean = false;
  timeLeft: number = 60;
  intervalTimer: any;

  promptToDraw: string = 'fetching prompt ...';
  player: IDrawPlayer;

  promptLobby: boolean = false;
  playerImgUrl: string;
  isAdmin: boolean = false;
  promptLobbyPlayers: DrawPlayer[] = [];
  garysList: DrawPlayer[] = [];
  countdown: boolean = false;
  countdownTimer: any = null;
  secondsBeforeRouting: number = 2;
  promptRoundURL: string = '';

  garyTrail: string = '';
  garyIntervalTimer: any;

  constructor(private router: Router, private _drawService: DrawService) {
    this.isAdmin = false;

    this.playerImgUrl = environment.player_image_url;

    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      player: IDrawPlayer;
    };

    this.roomCode = state.roomCode;
    this.player = state.player;
    this.activeColor = state.player.color1;

    if (state.player.isAdmin) {
      this.isAdmin = true;
    }
  }
  ngOnDestroy(): void {
    this._drawService.getDrawHubConnection().off('FetchedPrompt');
    this._drawService.getDrawHubConnection().off('FetchedRandomPromptRound');
    this._drawService.getDrawHubConnection().off('connectedDrawUsers');
    this._drawService.getDrawHubConnection().off('FetchedNewLobbyArrivals');
  }

  ngOnInit(): void {
    this._drawService.fetchPrompt(this.roomCode);

    this._drawService
      .getDrawHubConnection()
      .on('FetchedPrompt', (prompt: string) => {
        this.promptToDraw = prompt;
      });

    this.garyIntervalTimer = setInterval(this.garyIntervalTimerFunction, 1000);
    this.intervalTimer = setInterval(this.timeLeftInRoundFunction, 1000);

    this._drawService
      .getDrawHubConnection()
      .on('FetchedRandomPromptRound', (gameRoundDTO: any) => {
        this.promptRoundURL = gameRoundDTO.url;
        this.countdown = true;
        this.countdownTimer = setInterval(
          this.timeLeftBeforeRoutingInterval,
          1000
        );
      });

    this._drawService
      .getDrawHubConnection()
      .invoke('GetConnectedDrawUsers', this.roomCode)
      .catch((err) =>
        console.log('error getting connected draw users in prompt ' + err)
      );

    this._drawService
      .getDrawHubConnection()
      .on('connectedDrawUsers', (garys: DrawPlayer[]) => {
        // this.promptToDraw = prompt;
        this.garysList = garys;
      });

    this._drawService
      .getDrawHubConnection()
      .on('FetchedNewLobbyArrivals', (players: IDrawPlayer[]) => {
        this.promptLobbyPlayers = players;

        this.garysList.forEach((gary) => {
          players.forEach((plyr) => {
            if (gary.name == plyr.name && plyr.stillDrawing == false) {
              gary.stillDrawing = false;
            }
          });
        });
      });
  }

  stopInterval = () => {
    clearInterval(this.intervalTimer);

    // SEND THE PLAYER'S BEAUTIFUL ARTWORK SUBMISSION TO THE BACKEND
    // this._drawService.
    this.submitArt();

    this.player.stillDrawing = false;

    // this._drawService.newPromptLobbyArrival(this.roomCode, this.player);
    this._drawService
      .getDrawHubConnection()
      .invoke('NewLobbyArrival', this.roomCode, this.player)
      .catch((err) => console.log('error invoking new lobby arrival ' + err));

    // THEN head to promptLobby
    // this.navigationExtras = {
    //   state: {
    //     roomCode: this.roomCode,
    //     player: this.player,
    //   },
    // };

    // instead of navigating to a new route, lets just change the html,
    // show the prompt lobby html, the reason we want to do it this way
    // it greatly simplifies the simultaneous start of timer which the garys
    // follow ^_^
    this.promptLobby = true;
    // this.router.navigate([`/promptlobby`], this.navigationExtras);
  };

  submitArt = () => {
    let that = this;
    this.canvas.nativeElement.toBlob(function (blob) {
      let formData = new FormData();
      let imgUrl = that.player.name + '_' + that.roomCode + '_prompt.png';
      formData.append('img', blob, imgUrl);

      // here we want to send to the game object on the server the answer to the prompt and the link to the img url
      that._drawService.submitUserArtwork(
        that.roomCode,
        imgUrl,
        that.promptToDraw
      );

      fetch(environment.prompt_image_upload_url, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((err) => {
          console.log(err);
        });
    });
  };

  timeLeftInRoundFunction = () => {
    if (this.timeLeft >= 0) {
      this.counter.nativeElement.innerHTML = this.timeLeft;
    } else {
      this.stopInterval();
    }
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.prompt.nativeElement.innerHTML = '"' + this.promptToDraw + '"';
    }, 500);

    let that = this;
    let canvas, ctx;
    let mouseX,
      mouseY,
      pressed = 0;
    let touchX, touchY;
    this.activeColor = this.player.color1;

    function mouseDown(e) {
      pressed = 1;
      drawDot(ctx, mouseX, mouseY, 12);
    }

    function drawDot(ctx, x, y, size) {
      ctx.lineWidth = 13;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.strokeStyle = that.activeColor;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function mouseUp(e) {
      pressed = 0;
      ctx.beginPath();
    }

    function mouseMove(e) {
      getMousePos(e);
      if (pressed == 1) {
        drawDot(ctx, mouseX, mouseY, 12);
      }
    }

    function getMousePos(e) {
      if (!e) {
        var event = event;
        if (event.offsetX) {
          mouseX = event.offsetX;
          mouseY = event.offsetY;
        } else if (event.layerX) {
          mouseX = event.layerX;
          mouseY = event.layerY;
        }
      } else if (e) {
        if (e.offsetX) {
          mouseX = e.offsetX;
          mouseY = e.offsetY;
        } else if (e.layerX) {
          mouseX = e.layerX;
          mouseY = e.layerY;
        }
      }
    }

    function touchStart(e) {
      e.preventDefault();
      getTouchPos(e);
      drawDot(ctx, touchX, touchY, 12);
    }

    function touchEnd(e) {
      e.preventDefault();
      ctx.beginPath();
    }

    function touchMove(e) {
      e.preventDefault();
      getTouchPos(e);
      drawDot(ctx, touchX, touchY, 12);
    }

    function getTouchPos(e) {
      if (!e) {
      }

      if (e.touches) {
        if (e.touches.length == 1) {
          let touch = e.touches[0];
          touchX = touch.pageX - touch.target.offsetLeft;
          touchY = touch.pageY - touch.target.offsetTop;
        }
      }
    }

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    let clearCanvasBtn = this.clearCanvasBtn.nativeElement;
    clearCanvasBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    let cbtn1 = this.colorBtn1.nativeElement;
    cbtn1.addEventListener('click', () => {
      this.activeColor = this.player.color1;
    });
    let cbtn2 = this.colorBtn2.nativeElement;
    cbtn2.addEventListener('click', () => {
      this.activeColor = this.player.color2;
    });

    canvas.height = 400;
    // canvas.width = window.innerWidth < 400 ? window.innerWidth - 2 : 400;

    if (window.innerWidth < 330) {
      canvas.width = 300;
    } else if (window.innerWidth <= 360) {
      canvas.width = 340;
    } else if (window.innerWidth <= 375) {
      canvas.width = 350;
    } else {
      canvas.width = 400;
    }

    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('touchstart', touchStart, { passive: false });
    canvas.addEventListener('touchend', touchEnd, { passive: false });
    canvas.addEventListener('touchmove', touchMove, { passive: false });
  }

  getColor1() {
    return {
      'background-color': this.player.color1,
    };
  }

  getColor2() {
    return {
      'background-color': this.player.color2,
    };
  }

  /**       PROMPT LOBBY CODE BELOW HERE  */
  timeLeftBeforeRoutingInterval = () => {
    if (this.countdownTimer != null) {
      if (this.secondsBeforeRouting < 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;

        console.log('here is where we transition to the next route');
        this.stopRoutingInterval();
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
        this.countdowntimer.nativeElement.innerHTML = this
          .secondsBeforeRouting--;
      }
    }
  };

  stopRoutingInterval = () => {
    clearInterval(this.countdownTimer);
  };

  startPrompt = () => {
    console.log('admin tapped start prompt');

    this._drawService.startPrompt(this.roomCode);
  };

  garyIntervalTimerFunction = () => {
    // since we are counting down 60 here
    // this seems like a good place to tick the moving of the garys

    //   if (this.timeLeft >= 0) {
    //     this.counter.nativeElement.innerHTML = this.timeLeft--;

    //   } else {
    //     this.stopInterval();
    //   }
    this.timeLeft--;

    if (this.timeLeft < 0) {
      this.stopGaryInterval();
    }

    if (this.timeLeft % 2 == 0) {
      this.garysList.forEach((gary) => {
        if (gary.stillDrawing) {
          gary.garyTrail += '_';
        }
      });
      // if player still exists in garyTrail
    }
  };

  stopGaryInterval() {
    clearInterval(this.garyIntervalTimer);
  }
}
