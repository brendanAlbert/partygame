import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import anime from 'animejs/lib/anime.es';
import { Router } from '@angular/router';
import { GameService } from 'src/app/Services/game.service';
import { Hacker } from 'src/app/Models/Hacker';

@Component({
  selector: 'app-simonlobby',
  templateUrl: './simonlobby.component.html',
  styleUrls: ['./simonlobby.component.sass'],
})
export class SimonlobbyComponent implements OnInit, AfterViewInit {
  @ViewChild('view') screenElement: ElementRef;

  users: any;

  hackerHArray: number[] = [];
  hackerHMid: number[] = [];
  hackerHRight: number[] = [];
  easingNames = [
    'easeInQuad',
    'easeInCubic',
    'easeInQuart',
    'easeInQuint',
    'easeInSine',
    'easeInExpo',
    'easeInCirc',
    'easeInBack',
    'easeInBounce',
    'easeInOutQuad',
    'easeInOutCubic',
    'easeInOutQuart',
    'easeInOutQuint',
    'easeInOutSine',
    'easeInOutExpo',
    'easeInOutCirc',
    'easeInOutBack',
    'easeInOutBounce',
    'easeOutQuad',
    'easeOutCubic',
    'easeOutQuart',
    'easeOutQuint',
    'easeOutSine',
    'easeOutExpo',
    'easeOutCirc',
    'easeOutBack',
    'easeOutBounce',
  ];

  texts = [];
  texts2 = [];
  texts3 = [];

  screenContext: any;

  constructor(private router: Router, private _gameService: GameService) {
    this.hackerHArray;
    this.screenContext = {
      that: this,
    };
    for (let i = 0; i < 30; i++) {
      this.hackerHArray.push(i);
      this.hackerHRight.push(i);
    }
    for (let i = 0; i < 8; i++) {
      this.hackerHMid.push(i);
    }
    for (let i = 0; i < 3; i++) {
      this.matrixString(1);
    }
    for (let i = 0; i < 2; i++) {
      this.cyrillicString(1);
    }
    for (let i = 0; i < 2; i++) {
      this.binaryString(1);
    }

    for (let i = 0; i < 3; i++) {
      this.matrixString(2);
    }
    for (let i = 0; i < 2; i++) {
      this.cyrillicString(2);
    }
    for (let i = 0; i < 2; i++) {
      this.binaryString(2);
    }

    for (let i = 0; i < 3; i++) {
      this.matrixString(3);
    }
    for (let i = 0; i < 2; i++) {
      this.cyrillicString(3);
    }
    for (let i = 0; i < 2; i++) {
      this.binaryString(3);
    }
  }

  ngOnInit(): void {
    this._gameService.fetchHackers().subscribe((data: any[]) => {
      console.log(data);
      //   this.users = data.sort((a, b) => b.score - a.score);
      this.users = data;
    });
    console.log(this.users);
  }

  ngAfterViewInit() {
    //   let that = this;
    console.log(window.innerWidth);
    let w = window.innerWidth - 50;
    setTimeout(() => {
      anime({
        targets: ['.matrix-string'],
        translateX: function () {
          return anime.random(0, w);
        },
        duration: 1000,
      });
    }, 40);

    setTimeout(() => {
      anime({
        targets: ['.matrix-string2'],
        translateX: function () {
          return anime.random(0, w);
        },
        duration: 1000,
      });
    }, 12440);

    setTimeout(() => {
      anime({
        targets: ['.matrix-string3'],
        translateX: function () {
          return anime.random(0, w);
        },
        duration: 1000,
      });
    }, 18440);

    setTimeout(() => {
      let m2s = document.querySelectorAll('.matrix-string2');
      m2s.forEach((element) => {
        element.classList.add('visible');
      });
    }, 12700);

    setTimeout(() => {
      let m2s = document.querySelectorAll('.matrix-string3');
      m2s.forEach((element) => {
        element.classList.add('visible');
      });
    }, 18700);

    setTimeout(() => {
      anime({
        targets: ['.matrix-string'],
        translateY: 700,
        duration: function () {
          return anime.random(10000, 22000);
        },
        easing: 'linear',
        loop: true,
      });
    }, 700);

    setTimeout(() => {
      anime({
        targets: ['.matrix-string2'],
        translateY: 700,
        duration: function () {
          return anime.random(10000, 22000);
        },
        easing: 'linear',
        loop: true,
      });
    }, 12900);

    setTimeout(() => {
      anime({
        targets: ['.matrix-string3'],
        translateY: 700,
        duration: function () {
          return anime.random(15000, 22000);
        },
        easing: 'linear',
        loop: true,
      });
    }, 18900);

    setTimeout(() => {
      // FOR "HACKED" H EFFECT
      this.easingNames.forEach((name) => {
        anime({
          targets: '.hacker-h-left',
          translateX: function () {
            return anime.random(3, 9);
          },
          direction: 'alternate',
          duration: function () {
            return anime.random(10, 300);
          },
          endDelay: function () {
            return anime.random(150, 300);
          },
          loop: true,
          easing: name,
        });
      });

      this.easingNames.forEach((name) => {
        anime({
          targets: '.hacker-h-right',
          translateX: function () {
            return anime.random(3, 9);
          },
          direction: 'alternate',
          duration: function () {
            return anime.random(10, 300);
          },
          endDelay: function () {
            return anime.random(150, 300);
          },
          loop: true,
          easing: name,
        });
      });

      this.easingNames.forEach((name) => {
        anime({
          targets: '.hacker-h-middle',
          translateY: function () {
            return anime.random(2, 5);
          },
          direction: 'alternate',
          duration: function () {
            return anime.random(10, 300);
          },
          endDelay: function () {
            return anime.random(150, 300);
          },
          loop: true,
          easing: name,
        });
      });
    }, 800);
  }

  // awesome cyberpunk/matrix text crawl credit belongs to
  // Tibix - https://codepen.io/Tibixx/pen/YjamYW?editors=1010

  chars = [
    '園',
    '迎',
    '簡',
    '益',
    '大',
    '诶',
    '比',
    '西',
    '迪',
    '伊',
    '弗',
    '吉',
    '尺',
    '杰',
    '开',
    '艾',
    '勒',
    '马',
    '娜',
  ];
  cyrillic = [
    'А',
    'Б',
    'В',
    'Г',
    'Д',
    'Е',
    'Ж',
    'З',
    'И',
    'Й',
    'К',
    'Л',
    'М',
    'Н',
    'О',
    'П',
    'Р',
    'С',
    'Т',
    'У',
    'Ф',
    'Х',
    'Ц',
    'Ч',
    'Ш',
    'Щ',
    'Ю',
    'Я',
  ];
  allStreams = [];
  //   textColor1 = '#2355dd';
  //   textColor2 = '#e83272';

  minStringDelay = 100;
  maxStringDelay = 300;

  minStringLength = 4;
  maxStringLength = 10;

  minStringSpeed = 1;
  maxStringSpeed = 2.5;

  matrixString = (list: number) => {
    let randomLength = Math.floor(
      Math.random() * this.maxStringLength + this.minStringLength
    );

    let singleStream = [];
    for (let i = 0; i < randomLength; i++) {
      let randomCharacter = Math.floor(Math.random() * this.chars.length);
      singleStream[i] = this.chars[randomCharacter];
    }

    if (list == 1) this.texts.push(singleStream.toString());
    else if (list == 2) this.texts2.push(singleStream.toString());
    else if (list == 3) this.texts3.push(singleStream.toString());
  };

  binaryString = (list: number) => {
    // let screenwidth = this.screenElement.nativeElement.style.width;
    let randomTime = Math.floor(
      Math.random() * this.maxStringDelay + this.minStringDelay
    );
    let randomLength = Math.floor(
      Math.random() * this.maxStringLength + this.minStringLength
    );

    let singleStream = [];
    for (let i = 0; i < randomLength; i++) {
      let randomCharacter = Math.floor(Math.random() * 2);
      singleStream[i] = randomCharacter;
    }

    if (list == 1) this.texts.push(singleStream.toString());
    else if (list == 2) this.texts2.push(singleStream.toString());
    else if (list == 3) this.texts3.push(singleStream.toString());
  };

  cyrillicString = (list: number) => {
    let randomLength = Math.floor(
      Math.random() * this.maxStringLength + this.minStringLength
    );

    let singleStream = [];
    for (let i = 0; i < randomLength; i++) {
      let randomCharacter = Math.floor(Math.random() * this.cyrillic.length);
      singleStream[i] = this.cyrillic[randomCharacter];
    }

    if (list == 1) this.texts.push(singleStream.toString());
    else if (list == 2) this.texts2.push(singleStream.toString());
    else if (list == 3) this.texts3.push(singleStream.toString());
  };

  addUserToList(userNameValue: string) {
    if (userNameValue.length > 0) {
      // add user to list
      let newUser = { user: userNameValue, score: 0 };

      this._gameService.addUser(newUser);
      this._gameService.addUserToList(newUser);
      // navigate to simon page
      this.router.navigate(['/simon']);
    } else {
      // ask user to provide a name in order to proceed
    }
  }
}
