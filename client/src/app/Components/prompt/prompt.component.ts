import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DrawService } from 'src/app/Services/draw.service';
import { IDrawPlayer } from 'src/app/Models/IDrawPlayer';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.sass'],
})
export class PromptComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('clearCanvasBtn') clearCanvasBtn: ElementRef;
  @ViewChild('avatarBtn') avatarbtn: ElementRef;
  @ViewChild('color1') colorBtn1: ElementRef;
  @ViewChild('color2') colorBtn2: ElementRef;
  @ViewChild('prompt') prompt: ElementRef;
  @ViewChild('counter') counter: ElementRef;

  navigationExtras: NavigationExtras = {};
  activeColor: string;
  roomCode: string;
  sending: boolean = false;
  timeLeft: number = 60;
  intervalTimer: any;
  promptToDraw: string = 'fetching prompt ...';
  player: IDrawPlayer;

  constructor(private router: Router, private _drawService: DrawService) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      player: IDrawPlayer;
    };

    this.roomCode = state.roomCode;
    this.player = state.player;
    this.activeColor = state.player.color1;
  }

  ngOnInit(): void {
    this._drawService.fetchPrompt(this.roomCode);

    this._drawService
      .getDrawHubConnection()
      .on('FetchedPrompt', (prompt: string) => {
        this.promptToDraw = prompt;
      });

    this.intervalTimer = setInterval(this.timeLeftInRoundFunction, 1000);
  }

  stopInterval = () => {
    clearInterval(this.intervalTimer);

    // SEND THE PLAYER'S BEAUTIFUL ARTWORK SUBMISSION TO THE BACKEND
    // this._drawService.
    this.submitArt();

    this._drawService.newPromptLobbyArrival(this.roomCode, this.player);

    // THEN head to promptLobby
    this.navigationExtras = {
      state: {
        roomCode: this.roomCode,
        player: this.player,
      },
    };

    this.router.navigate([`/promptlobby`], this.navigationExtras);
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
      this.counter.nativeElement.innerHTML = this.timeLeft--;
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
    canvas.width = window.innerWidth;

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
}
