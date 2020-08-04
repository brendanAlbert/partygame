import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promptresults',
  templateUrl: './promptresults.component.html',
  styleUrls: ['./promptresults.component.sass'],
})
export class PromptresultsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  // sort the answers so that whoever voted for the correct answer, they go last
  // show the remaining chosen answers one at a time, show the name(s) of the people who voted for that
  // show the person who came up with that answer getting points
  // do that on the bottom half of the screen, at the top of the screen have the players "dance"
  // through the scoreboard as their scores update, rising and falling
}
