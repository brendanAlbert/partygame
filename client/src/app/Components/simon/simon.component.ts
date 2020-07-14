import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameService } from 'src/app/Services/game.service';
import { Hacker } from 'src/app/Models/Hacker';

@Component({
  selector: 'app-simon',
  templateUrl: './simon.component.html',
  styleUrls: ['./simon.component.sass'],
})
export class SimonComponent implements OnInit {
  @ViewChild('hex1') hex1: ElementRef;
  @ViewChild('hex2') hex2: ElementRef;
  @ViewChild('hex3') hex3: ElementRef;
  @ViewChild('hex4') hex4: ElementRef;

  sound1;
  sound2;
  sound3;
  sound4;

  gameObject = {
    bot_order: [],
    player_order: [],
    bot_turn: true,
    flash_index: 0,
    botAddsATurn: true,
  };

  interval;
  fail = false;

  constructor(private _gameservice: GameService) {}

  reset() {
    this.gameObject = {
      bot_order: [],
      player_order: [],
      bot_turn: true,
      flash_index: 0,
      botAddsATurn: true,
    };
    this.fail = false;
    this.hex1.nativeElement.classList.remove('red');
    this.hex2.nativeElement.classList.remove('red');
    this.hex3.nativeElement.classList.remove('red');
    this.hex4.nativeElement.classList.remove('red');
    this.hex1.nativeElement.classList.add('cyan');
    this.hex2.nativeElement.classList.add('purple');
    this.hex3.nativeElement.classList.add('pink');
    this.hex4.nativeElement.classList.add('green');
    this.startGame();
  }

  generateRandomInt() {
    return Math.floor(Math.random() * 4);
  }

  ngOnInit(): void {
    console.log('Starting game!');
    this.sound1 = new Audio(`./assets/sound1.wav`);
    this.sound2 = new Audio(`./assets/sound2.wav`);
    this.sound3 = new Audio(`./assets/sound3.wav`);
    this.sound4 = new Audio(`./assets/sound4.wav`);
    this.startGame();
  }

  startGame() {
    this.interval = setInterval(this.gameTurn, 1100);
  }

  gameTurn = () => {
    if (this.gameObject.bot_turn) {
      if (this.gameObject.botAddsATurn) {
        this.generateBotTurn();
        this.gameObject.flash_index = 0;
      }

      this.playBotsTurns();

      this.gameObject.flash_index++;

      if (this.gameObject.flash_index === this.gameObject.bot_order.length) {
        this.gameObject.flash_index = 0;
        this.gameObject.bot_turn = false;
      }
    } else if (!this.gameObject.bot_turn) {
    }
  };

  generateBotTurn() {
    let random_hex = this.generateRandomInt();
    this.gameObject.bot_order.push(random_hex);
    this.gameObject.botAddsATurn = false;
  }

  comparePlayerAndBotTurns() {
    if (
      this.gameObject.bot_order[this.gameObject.flash_index] !==
      this.gameObject.player_order[this.gameObject.flash_index]
    ) {
      this.fail = true;
      this.gameOver();
      clearInterval(this.interval);
    } else {
      if (
        this.gameObject.bot_order.length === this.gameObject.player_order.length
      ) {
        setTimeout(() => {
          this.gameObject.bot_turn = true;
          this.gameObject.botAddsATurn = true;
          this.gameObject.player_order = []; // reset players moves
        }, 1000);
      } else {
        this.gameObject.flash_index++;
      }
    }
  }

  playBotsTurns() {
    if (this.gameObject.bot_order[this.gameObject.flash_index] == 0)
      this.tapHex1();
    else if (this.gameObject.bot_order[this.gameObject.flash_index] == 1)
      this.tapHex2();
    else if (this.gameObject.bot_order[this.gameObject.flash_index] == 2)
      this.tapHex3();
    else if (this.gameObject.bot_order[this.gameObject.flash_index] == 3)
      this.tapHex4();
  }

  playsound(number: number) {
    let audio = new Audio(`./assets/sound${number}.wav`);
    audio.play();
  }

  tapHex1() {
    this.hex1.nativeElement.classList.add('yellow');
    this.hex1.nativeElement.classList.remove('cyan');
    this.sound1.currentTime = 0;
    this.sound1.play();

    if (!this.gameObject.bot_turn) {
      this.gameObject.player_order.push(0);
      this.comparePlayerAndBotTurns();
    }
    setTimeout(() => {
      this.hex1.nativeElement.classList.remove('yellow');
      this.hex1.nativeElement.classList.add('cyan');
    }, 500);
  }
  tapHex2() {
    this.hex2.nativeElement.classList.add('yellow');
    this.hex2.nativeElement.classList.remove('purple');

    this.sound2.currentTime = 0;
    this.sound2.play();
    if (!this.gameObject.bot_turn) {
      this.gameObject.player_order.push(1);
      this.comparePlayerAndBotTurns();
    }
    setTimeout(() => {
      this.hex2.nativeElement.classList.remove('yellow');
      this.hex2.nativeElement.classList.add('purple');
    }, 500);
  }
  tapHex3() {
    this.hex3.nativeElement.classList.add('yellow');
    this.hex3.nativeElement.classList.remove('pink');

    this.sound3.currentTime = 0;
    this.sound3.play();
    if (!this.gameObject.bot_turn) {
      this.gameObject.player_order.push(2);
      this.comparePlayerAndBotTurns();
    }
    setTimeout(() => {
      this.hex3.nativeElement.classList.add('pink');
      this.hex3.nativeElement.classList.remove('yellow');
    }, 500);
  }
  tapHex4() {
    this.hex4.nativeElement.classList.add('yellow');
    this.hex4.nativeElement.classList.remove('green');

    this.sound4.currentTime = 0;
    this.sound4.play();
    if (!this.gameObject.bot_turn) {
      this.gameObject.player_order.push(3);
      this.comparePlayerAndBotTurns();
    }
    setTimeout(() => {
      this.hex4.nativeElement.classList.remove('yellow');
      this.hex4.nativeElement.classList.add('green');
    }, 500);
  }

  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  gameOver() {
    this.hex1.nativeElement.classList.add('red');
    this.hex2.nativeElement.classList.add('red');
    this.hex3.nativeElement.classList.add('red');
    this.hex4.nativeElement.classList.add('red');

    this._gameservice.user.score = this.gameObject.bot_order.length - 1;

    this._gameservice.addHacker(
      new Hacker(this._gameservice.user.user, this._gameservice.user.score)
    );
  }
}
