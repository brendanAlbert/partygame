import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './Components/menu/menu.component';
import { DrawComponent } from './Components/draw/draw.component';
import { DrawlobbyComponent } from './Components/drawlobby/drawlobby.component';
import { LobbyComponent } from './Components/lobby/lobby.component';
import { PromptComponent } from './Components/prompt/prompt.component';
import { GuesspromptComponent } from './Components/guessprompt/guessprompt.component';
import { PromptlobbyComponent } from './Components/promptlobby/promptlobby.component';
import { PromptresultsComponent } from './Components/promptresults/promptresults.component';
import { SimonComponent } from './Components/simon/simon.component';
import { SimonlobbyComponent } from './Components/simonlobby/simonlobby.component';
import { TriviaComponent } from './Components/trivia/trivia.component';
import { ScoreComponent } from './Components/score/score.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'drawlobby', component: DrawlobbyComponent },
  { path: 'draw', component: DrawComponent },
  { path: 'promptlobby', component: PromptlobbyComponent },
  { path: 'promptresults', component: PromptresultsComponent },
  { path: 'guessprompt', component: GuesspromptComponent },
  { path: 'prompt', component: PromptComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'trivia', component: TriviaComponent },
  { path: 'score', component: ScoreComponent },
  { path: 'simonlobby', component: SimonlobbyComponent },
  { path: 'simon', component: SimonComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
