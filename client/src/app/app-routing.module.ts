import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './Components/menu/menu.component';
import { LobbyComponent } from './Components/lobby/lobby.component';
import { SimonComponent } from './Components/simon/simon.component';
import { SimonlobbyComponent } from './Components/simonlobby/simonlobby.component';
import { TriviaComponent } from './Components/trivia/trivia.component';
import { ScoreComponent } from './Components/score/score.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
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
