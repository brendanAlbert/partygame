import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DrawPlayer } from 'src/app/Models/DrawPlayer';
import { DrawService } from 'src/app/Services/draw.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.sass'],
})
export class DrawComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('clearCanvasBtn') clearCanvasBtn: ElementRef;
  @ViewChild('avatarBtn') avatarbtn: ElementRef;
  @ViewChild('color1') colorBtn1: ElementRef;
  @ViewChild('color2') colorBtn2: ElementRef;
  navigationExtras: NavigationExtras = {};
  roomCode: string = '';
  username: string = '';
  uploadImgUrl: string = environment.image_upload_endpoint;
  playerImgEndpoint = environment.player_image_url;
  playerImgUrl: string = '';
  sending: boolean = false;
  color1: string = '';
  color2: string = '';
  activeColor: string;
  id: string;

  constructor(private router: Router, private _drawService: DrawService) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      username: string;
      imgUrl: string;
      id: string;
      color1: string;
      color2: string;
    };
    this.roomCode = state.roomCode;
    this.username = state.username;
    this.color1 = state.color1;
    this.color2 = state.color2;
    this.activeColor = state.color1;
    this.playerImgUrl = state.imgUrl;
    this.id = state.id;
  }

  ngOnInit(): void {}

  getColor1() {
    return {
      'background-color': this.color1,
    };
  }

  getColor2() {
    return {
      'background-color': this.color2,
    };
  }

  ngAfterViewInit() {
    let that = this;
    let canvas, ctx;
    let mouseX,
      mouseY,
      pressed = 0;
    let touchX, touchY;
    that.activeColor = that.color1;

    function mouseDown(e) {
      pressed = 1;
      drawDot(ctx, mouseX, mouseY, 12);
    }

    function drawDot(ctx, x, y, size) {
      ctx.lineWidth = 13;
      ctx.lineCap = 'round';
      console.log(`that.activeColor = ${that.activeColor}`);
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
      that.activeColor = that.color1;
    });
    let cbtn2 = this.colorBtn2.nativeElement;
    cbtn2.addEventListener('click', () => {
      that.activeColor = that.color2;
    });

    canvas.height = 400;
    canvas.width = window.innerWidth <= 400 ? window.innerWidth : 400;

    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('touchstart', touchStart, { passive: false });
    canvas.addEventListener('touchend', touchEnd, { passive: false });
    canvas.addEventListener('touchmove', touchMove, { passive: false });

    // let baseimg = new Image();
    // baseimg.src = this.playerImgEndpoint + this.playerImgUrl;
    // baseimg.height = window.innerWidth;
    // baseimg.width = window.innerWidth;
    // baseimg.onload = function () {
    //   baseimg.setAttribute('crossorigin', 'anonymous');
    //   ctx.drawImage(
    //     baseimg,
    //     0,
    //     0,
    //     baseimg.width,
    //     baseimg.height,
    //     0,
    //     0,
    //     canvas.width,
    //     canvas.width
    //   );
    // };
  }

  setNavExtras(nav_extras) {
    this.navigationExtras = nav_extras;
  }

  getNavExtras() {
    return this.navigationExtras;
  }

  // step 1: draw avatar
  // step 2: pick username
  // step 3: when done, return to lobby with passed in roomcode
  returnToLobby = () => {
    let that = this;
    that.sending = true;
    let imgUrl = 'this should be overridden';
    this.canvas.nativeElement.toBlob(function (blob) {
      let formData = new FormData();
      that.playerImgUrl = `${that.id}_${that.username}_${that.roomCode}.png`;
      imgUrl = that.playerImgUrl;
      formData.append('img', blob, that.playerImgUrl);

      console.log(`value of imgUrl = ${imgUrl}`);
      //   that.username = username;
      that.navigationExtras = {
        state: {
          roomCode: that.roomCode,
          username: that.username,
          imgUrl: imgUrl,
          id: that.id,
          color1: that.color1,
          color2: that.color2,
        },
      };

      that.setNavExtras(that.navigationExtras);

      // TODO
      // WE WANT TO CALL THE MESSAGE HUB
      // WE WANT TO UPDATE THE DRAW GAME ROOM WITH THIS NEW PLAYER'S INFO

      //   let drawPlayer = new DrawPlayer();
      //   drawPlayer.name = that.username;
      //   drawPlayer.imgUrl = imgUrl;

      that._drawService.associateUserUrl(that.roomCode, that.username, imgUrl);

      fetch(environment.image_upload_endpoint, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((err) => {
          console.log(err);
        });
    });

    setTimeout(() => {
      this._drawService.getConnectedDrawUsers(that.roomCode);
      //   this._drawService.getActiveDrawGameLobbies();
      that.router.navigate(['/drawlobby'], this.getNavExtras());
    }, 300);
  };
}
