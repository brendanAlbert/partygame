import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.sass'],
})
export class ScoreComponent implements OnInit {
  scoreResults: any;

  navigationExtras: NavigationExtras = {};

  constructor(private router: Router) {
    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      roundResults: any;
    };
    this.scoreResults = state.roundResults;
  }

  ngOnInit(): void {
    // get results from latest round
    console.log('here is the result object in the score component');
    console.log(this.scoreResults);
  }
}
