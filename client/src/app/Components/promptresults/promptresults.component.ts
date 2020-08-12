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
import { DrawPlayer } from 'src/app/Models/DrawPlayer';
import { environment } from '../../../environments/environment';
import anime from 'animejs/lib/anime.es';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-promptresults',
  templateUrl: './promptresults.component.html',
  styleUrls: ['./promptresults.component.sass'],
})
export class PromptresultsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('art') art: ElementRef;
  @ViewChild('resultsContainer') resultsContainer: ElementRef;
  @ViewChild('timeLeftUntilNextRound') timerCountdownElement: ElementRef;
  navigationExtras: NavigationExtras = {};

  roomCode: string = '';
  player: DrawPlayer;
  promptRoundURL: string = '';
  playerImgUrl: string = environment.player_image_url;
  //   isAdmin: boolean = false;
  roundResultsObject: any = {};
  answer: string = '';

  wrongAnswersArray: any[] = [];
  rightAnswerObject: any = {};

  scoreIntervalTimers: any[];
  correctScoresArray: any[] = [];

  answerObject: any = {};
  showAnswerResults: boolean = false;
  answerObjectIndex: number = -1;

  readyToShowAnswers: boolean = false;
  readyForNextRound: boolean = false;
  headingToNextRound: boolean = false;
  timeLeftTillNextRound: number = 6;
  timeLeftTillNextRoundTimer: any;
  //   timeSinceInit : number = 0;
  //   timeSinceInitTimer: any;
  timeSinceLastTap: number = 6;
  timeSinceLastTapTimer: any;

  scoreKeeperList: DrawPlayer[] = [];
  lastRound: boolean = false;
  showFinalScoreScreen: boolean = false;

  listFunnyTaunts: string[] = [
    `alright, let's see how everyone did`,
    `i can't wait to see these results...`,
    `some real picassos in the house`,
    `i really liked those guesses`,
    `some of those responses, wow.`,
  ];
  funnyTaunt: string = '';
  afterRevealTaunt: string = '';
  judgementTaunt: string = '';

  afterRevealTaunts: string[] = [
    'remember this beauty?',
    'what .. what is it?',
    'every day we stray further from his light',
    'that is amazing!',
    'you got talent kid',
    "more of a left brain arn't ya",
    "<sniff>.. it's so beautiful",
  ];

  judgementalTaunts: string[] = [
    'yeah, one of you drew that.',
    'no judgement here, this is a judgement free zone',
    "y'all mfers need jesus",
    'i wish I was this talented',
    'a true work of art, it shall hang on my refrigerator',
    'and just like that a new art style is born',
  ];

  constructor(private router: Router, private _drawService: DrawService) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roomCode: string;
      player: IDrawPlayer;
      promptRoundURL: string;
    };
    this.roomCode = state.roomCode;
    this.player = state.player;
    this.promptRoundURL = state.promptRoundURL;

    console.log(`logging this.promptRoundURL =[${this.promptRoundURL}]`);

    this.funnyTaunt = this.listFunnyTaunts[
      Math.floor(Math.random() * this.listFunnyTaunts.length)
    ];
    this.afterRevealTaunt = this.afterRevealTaunts[
      Math.floor(Math.random() * this.afterRevealTaunts.length)
    ];
    this.judgementTaunt = this.judgementalTaunts[
      Math.floor(Math.random() * this.judgementalTaunts.length)
    ];
  }
  ngOnDestroy(): void {
    this._drawService
      .getDrawHubConnection()
      .off('ReturningCalculatedAndFetchedRoundResults');
    this._drawService.getDrawHubConnection().off('GotNextRound');
    this._drawService.getDrawHubConnection().off('ShowingNextPromptResult');
    this._drawService.getDrawHubConnection().off('ShowingFinalScore');
  }

  //   initTimer = () => {
  //       this.timeSinceInit++;
  //   }

  answerButtonTimer = () => {
    this.timeSinceLastTap++;
  };

  resetShowAnswerButton() {
    clearInterval(this.timeSinceLastTapTimer);
    this.timeSinceLastTap = 0;
    this.timeSinceLastTapTimer = setInterval(this.answerButtonTimer, 1000);
  }

  stopInterval = () => {
    clearInterval(this.timeLeftTillNextRoundTimer);
    this.navigationExtras = {
      state: {
        roomCode: this.roomCode,
        player: this.player,
        promptRoundURL: this.promptRoundURL,
      },
    };

    this.router.navigate([`/guessprompt`], this.navigationExtras);
  };
  timeLeftInRoundFunction = () => {
    this.timeLeftTillNextRound--;

    if (this.timeLeftTillNextRound >= 0) {
      this.timerCountdownElement.nativeElement.innerHTML = this.timeLeftTillNextRound;
    } else {
      this.stopInterval();
    }
  };

  nextRound() {
    console.log('heading to next round');
    this._drawService
      .getDrawHubConnection()
      .invoke('GetNextRound', this.roomCode, this.scoreKeeperList)
      .catch((err) => console.log('error fetching next round ' + err));
  }

  triggerShowNext() {
    //  here we need to invoke to broadcast to all
    // if ~5 seconds have passed since last click otherwise ignore clicks (in case someone fat fingered it)
    if (this.timeSinceLastTap > 5) {
      this.resetShowAnswerButton();

      this._drawService
        .getDrawHubConnection()
        .invoke('ShowNextPromptResult', this.roomCode)
        .catch((err) => console.log(`${err}`));
    }
  }

  showFinalScore() {
    this._drawService
      .getDrawHubConnection()
      .invoke('ShowFinalScore', this.roomCode)
      .catch((err) => console.log(`${err}`));
  }

  showNext() {
    let togglehiddenEles = document.querySelectorAll('.toggle-hidden');
    let togglearray = Array.from(togglehiddenEles);
    togglearray.forEach((ele) => {
      ele.classList.add('hidden');
      //   ele.classList.remove('fade-in');
    });

    // load the next wrong answer object
    this.answerObjectIndex++;
    if (this.answerObjectIndex == this.wrongAnswersArray.length) {
      this.showAnswerResults = true;
      // if that was the last one, show the correct answer object
      // load the correct answer object
      this.answerObject = this.rightAnswerObject;

      setTimeout(() => {
        this.correctScoresArray.forEach((correct) => {
          anime({
            targets: correct,
            value: [0, 1000],
            round: 1,
            easing: 'easeInOutExpo',
          });
        });
      }, 2500);
      setTimeout(() => {
        // let tempScoreArray : DrawPlayer[];

        console.log(this.answerObject);
        let that = this;
        this.scoreKeeperList.forEach(function (scorer, index) {
          that.answerObject.answerers.forEach((player) => {
            if (player.name == scorer.name && player.id == scorer.id) {
              scorer.score += 1000;
            }
          });
        }, this.scoreKeeperList);
        this.scoreKeeperList.sort((a, b) => b.score - a.score);
      }, 3500);

      setTimeout(() => {
        this.readyForNextRound = true;
      }, 4500);
    } else {
      setTimeout(() => {
        this.answerObject = this.wrongAnswersArray[this.answerObjectIndex];
      }, 500);

      setTimeout(() => {
        let inputs = <HTMLInputElement>document.querySelector('.correct-input');
        inputs.value = '0';
      }, 1000);

      setTimeout(() => {
        let togglehiddenEles = document.querySelectorAll('.toggle-hidden');
        let togglearray = Array.from(togglehiddenEles);
        togglearray.forEach((ele) => {
          //   ele.classList.add('hidden');
          ele.classList.remove('fade-in');
        });
      }, 500);

      setTimeout(() => {
        this.correctScoresArray.forEach((correct) => {
          // console.log('{ correct }');
          // console.log(correct);
          if (this.answerObject.answerers) {
            anime({
              targets: correct,
              value: [0, 1000 * this.answerObject.answerers.length],
              round: 1,
              easing: 'easeInOutExpo',
            });
          }
        });
      }, 2500);

      setTimeout(() => {
        // let tempScoreArray : DrawPlayer[];

        console.log(this.answerObject);
        let that = this;
        this.scoreKeeperList.forEach(function (scorer, index) {
          if (
            that.answerObject.submitter.name == scorer.name &&
            that.answerObject.submitter.id == scorer.id
          ) {
            scorer.score += 1000 * that.answerObject.answerers.length;
          }
        }, this.scoreKeeperList);
        this.scoreKeeperList.sort((a, b) => b.score - a.score);
      }, 3500);
    }

    setTimeout(() => {
      let hiddenEles = document.querySelectorAll('.hidden');
      let hiddenarray = Array.from(hiddenEles);
      hiddenarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 1000);

    setTimeout(() => {
      let correctScoresToIncrement = document.querySelectorAll('.correct');
      console.log(`correct nodes`);
      console.log(correctScoresToIncrement);

      let csa = Array.from(correctScoresToIncrement);

      csa.forEach((score) => {
        score.nodeValue = '0';
        this.correctScoresArray.push(score);
      });
    }, 1000);
  } // END OF SHOWNEXT()

  createWrongAnswersArray() {
    for (const [key, value] of Object.entries(
      this.roundResultsObject.playerAnswerHashMap.associations
    )) {
      if (key != this.answer) {
        this.wrongAnswersArray.push({
          answer: key,
          answerers: value, // [{},{}]
          submitter: this.roundResultsObject.guessAndItsSubmitter.filter(
            (submitter) => {
              return submitter.item2 == key;
            }
          )[0].item1,
        });
      }
    }
  }

  createAnswerObject() {
    for (const [key, value] of Object.entries(
      this.roundResultsObject.playerAnswerHashMap.associations
    )) {
      if (key == this.answer) {
        this.rightAnswerObject = {
          answer: key,
          answerers: value,
          players: this.roundResultsObject.players,
        };
      }
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.player.isAdmin) {
      this._drawService
        .getDrawHubConnection()
        .invoke('CalculateAndFetchRoundResults', this.roomCode)
        .catch((err) => console.log('error invoking round results' + err));
    }

    this._drawService
      .getDrawHubConnection()
      .on('ReturningCalculatedAndFetchedRoundResults', (results: any) => {
        console.log('round results from server : ');
        console.log(results);
        this.roundResultsObject = results;
        this.promptRoundURL = results.url;
        this.answer = results.answer;
        this.scoreKeeperList = results.players;

        this.scoreKeeperList.sort((a, b) => b.score - a.score);

        this.lastRound = results.lastRound;

        this.art.nativeElement.height = window.innerWidth - 240;
        this.art.nativeElement.width = window.innerWidth - 240;
        this.art.nativeElement.src =
          environment.get_prompt_image_url + this.promptRoundURL;

        this.createWrongAnswersArray();

        this.createAnswerObject();

        this.answerObject = this.wrongAnswersArray[this.answerObjectIndex];
        console.log('this.answerObject ');
        console.log(this.answerObject);
      });

    setTimeout(() => {
      let fadeIns1sec = document.querySelectorAll('.fade-in-1sec');
      let onesecsarray = Array.from(fadeIns1sec);
      onesecsarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 1000);

    setTimeout(() => {
      let fadeIns3sec = document.querySelectorAll('.fade-in-3sec');
      let threesecsarray = Array.from(fadeIns3sec);
      threesecsarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 3000);
    setTimeout(() => {
      let fadeIns4sec = document.querySelectorAll('.fade-in-4sec');
      let foursecsarray = Array.from(fadeIns4sec);
      foursecsarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 4000);
    setTimeout(() => {
      let fadeIns5sec = document.querySelectorAll('.fade-in-5sec');
      let sixsecsarray = Array.from(fadeIns5sec);
      sixsecsarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 5000);
    setTimeout(() => {
      let fadeIns7sec = document.querySelectorAll('.fade-in-7sec');
      let sevensecsarray = Array.from(fadeIns7sec);
      sevensecsarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 7000);
    setTimeout(() => {
      let fadeIns8sec = document.querySelectorAll('.fade-in-8sec');
      let eightsecsarray = Array.from(fadeIns8sec);
      eightsecsarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 8000);
    setTimeout(() => {
      let fadeIns9sec = document.querySelectorAll('.fade-in-9sec');
      let ninesecsarray = Array.from(fadeIns9sec);
      ninesecsarray.forEach((ele) => {
        ele.classList.remove('hidden');
        ele.classList.add('fade-in');
      });
    }, 9000);

    setTimeout(() => {
      let correctScoresToIncrement = document.querySelectorAll('.correct');
      let csa = Array.from(correctScoresToIncrement);

      csa.forEach((score) => {
        this.correctScoresArray.push(score);
      });
    }, 1000);

    setTimeout(() => {
      this.readyToShowAnswers = true;
      let correctScoresToIncrement = document.querySelector(
        '.admin-buttons-wrapper'
      );

      correctScoresToIncrement.classList.remove('hidden');
      correctScoresToIncrement.classList.add('fade-in');
    }, 10000);

    this._drawService
      .getDrawHubConnection()
      .on('GotNextRound', (gameRoundDTO: any) => {
        console.log('gameRoundDTO');
        console.log(gameRoundDTO);
        this.promptRoundURL = gameRoundDTO.url;
        this.headingToNextRound = true;
        this.timeLeftTillNextRoundTimer = setInterval(
          this.timeLeftInRoundFunction,
          1000
        );
      });

    this._drawService
      .getDrawHubConnection()
      .on('ShowingNextPromptResult', () => {
        this.showNext();
      });

    this._drawService.getDrawHubConnection().on('ShowingFinalScore', () => {
      console.log('FINAL SCORE');
      console.log(this.scoreKeeperList);
      this.scoreKeeperList.sort((a, b) => b.score - a.score);
      this.showFinalScoreScreen = true;
    });
  }
}
