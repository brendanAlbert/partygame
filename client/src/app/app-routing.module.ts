import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './Components/menu/menu.component';
import { LobbyComponent } from './Components/lobby/lobby.component';
import { TriviaComponent } from './Components/trivia/trivia.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'trivia', component: TriviaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
