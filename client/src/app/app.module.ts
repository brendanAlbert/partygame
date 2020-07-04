import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './Components/menu/menu.component';
import { LobbyComponent } from './Components/lobby/lobby.component';
import { TriviaComponent } from './Components/trivia/trivia.component';
import { HttpClientModule } from '@angular/common/http';
import { ProgressbarComponent } from './Components/progressbar/progressbar.component';
import { ScoreComponent } from './Components/score/score.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LobbyComponent,
    TriviaComponent,
    ProgressbarComponent,
    ScoreComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  exports: [ProgressbarComponent, ScoreComponent],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
