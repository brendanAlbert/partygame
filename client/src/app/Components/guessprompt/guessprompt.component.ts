import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DrawService } from '../../Services/draw.service';
import { DrawPlayer } from 'src/app/Models/DrawPlayer';
import { IDrawPlayer } from 'src/app/Models/IDrawPlayer';

@Component({
  selector: 'app-guessprompt',
  templateUrl: './guessprompt.component.html',
  styleUrls: ['./guessprompt.component.sass'],
})
export class GuesspromptComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('art') art: ElementRef;
  roomCode: string = '';
  player: DrawPlayer;
  promptRoundURL: string = '';
  isAdmin: boolean = false;
  guessAdded: boolean = false;
  playersWhoHaveGuessed: DrawPlayer[] = [];
  seeAllGuesses: boolean = false;
  allGuesses: string[] = [];
  myGuess: string = '';
  guessBorders: any[] = [];
  originalGuessBorders: any[] = [];
  selectedAnswer: number;
  selectedAnswerText: string = '';
  showModal: boolean = false;
  timeToSeeResults: boolean = false;
  navigationExtras: NavigationExtras = {};

  colorsList: string[] = [
    '#0d6efd',
    '#6610f2',
    '#d63384',
    '#dc3545',
    '#fd7e14',
    '#ffc107',
    '#28a745',
    '#20c997',
    '#17a2b8',
  ];

  borderTypes: string[] = ['solid', 'dashed', 'dotted'];

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

    if (this.player.isAdmin) {
      this.isAdmin = true;
    }
  }
  ngOnDestroy(): void {
    this._drawService.getDrawHubConnection().off('FetchedNewPlayerGuesses');
    this._drawService
      .getDrawHubConnection()
      .off('FetchPlayersWaitingToSeeResults');
    this._drawService
      .getDrawHubConnection()
      .off('FetchedAllGuessesForPromptRound');
  }

  ngOnInit(): void {
    this._drawService
      .getDrawHubConnection()
      .on('FetchedNewPlayerGuesses', (playersWhoHaveGuessed: IDrawPlayer[]) => {
        this.playersWhoHaveGuessed = playersWhoHaveGuessed;
      });

    this._drawService
      .getDrawHubConnection()
      .on('FetchedAllGuessesForPromptRound', (allAnswers: string[]) => {
        console.log('receiving fetched all guesses ?? ');

        this.playersWhoHaveGuessed = [];

        this.seeAllGuesses = true;

        // we don't want players picking their own guesses
        allAnswers = allAnswers.filter((ans) => ans != this.myGuess);

        this.allGuesses = allAnswers;
        allAnswers.forEach((answer, index) => {
          let newborder = this.buildRandomBorder(index);
          this.guessBorders.push(newborder);
          this.originalGuessBorders.push(newborder);
        });
      });

    this._drawService
      .getDrawHubConnection()
      .on(
        'FetchPlayersWaitingToSeeResults',
        (playersWaiting: IDrawPlayer[]) => {
          this.playersWhoHaveGuessed = playersWaiting;

          if (this.isAdmin) {
            this.timeToSeeResults = true;
          }
        }
      );

    this._drawService.getDrawHubConnection().on('HeadToResultsScreen', () => {
      this.navigationExtras = {
        state: {
          roomCode: this.roomCode,
          player: this.player,
          promptRoundURL: this.promptRoundURL,
        },
      };

      this.router.navigate([`/promptresults`], this.navigationExtras);
    });
  }

  ngAfterViewInit() {
    this.art.nativeElement.height = window.innerWidth - 50;
    this.art.nativeElement.width = window.innerWidth - 50;
    this.art.nativeElement.src =
      environment.get_prompt_image_url + this.promptRoundURL;
  }

  adduserguess(userGuess: string) {
    this.guessAdded = true;
    this.myGuess = userGuess;
    this._drawService.addUserGuessForPrompt(
      this.roomCode,
      this.player,
      userGuess
    );
  }

  getColor1(player: DrawPlayer) {
    return {
      color: player.color1,
      'border-color': player.color1,
    };
  }

  seeGuesses() {
    // invoke see all guesses
    this._drawService.fetchAllGuessesForPromptRound(this.roomCode);
  }

  buildRandomBorder(index: number) {
    let randomBorderIndex = Math.floor(Math.random() * this.borderTypes.length);
    let randomColor = Math.floor(Math.random() * this.colorsList.length);
    let numberDegreesRotated,
      numberDegreesSkewed,
      minDegrees = 0,
      maxDegrees = 6,
      maxDegreesSkewed = 3;
    numberDegreesRotated = Math.floor(Math.random() * maxDegrees + minDegrees);
    numberDegreesSkewed = Math.floor(
      Math.random() * maxDegreesSkewed + minDegrees
    );
    if (index % 2 == 0) {
      numberDegreesRotated *= -1;
    }
    return {
      border: `2px ${this.borderTypes[randomBorderIndex]} ${this.colorsList[randomColor]}`,
      transform: `rotate(${numberDegreesRotated}deg) skew(${numberDegreesSkewed}deg)`,
    };
  }

  selectAnswer(selection: number) {
    this.selectedAnswer = selection;
    this.selectedAnswerText = this.allGuesses[selection];
    this.allGuesses.forEach((answer, index) => {
      if (selection == index) {
        this.guessBorders[selection] = {
          border: `4px solid green`,
          transform: `rotate(${0}deg) skew(${-10}deg)`,
        };
      } else {
        this.guessBorders[index] = this.originalGuessBorders[index];
      }
    });

    setTimeout(() => {
      this.showModal = true;
    }, 700);
  }

  confirmAnswer() {
    console.log('player we are adding to list waiting to see results');
    console.log(this.player);
    this.seeAllGuesses = false;
    this.showModal = false;
    this._drawService.addPlayerToListWaitingToSeeResults(
      this.roomCode,
      this.player,
      this.selectedAnswerText
    );
  }

  chooseDifferent() {
    setTimeout(() => {
      this.showModal = false;
      this.allGuesses.forEach((answer, index) => {
        this.guessBorders[index] = this.originalGuessBorders[index];
      });
    }, 100);
  }

  resultsScreen() {
    this._drawService.takePlayersToResultsScreen(this.roomCode);
  }
}
