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
import { SimonlobbyComponent } from './Components/simonlobby/simonlobby.component';
import { SimonComponent } from './Components/simon/simon.component';
import { DrawlobbyComponent } from './Components/drawlobby/drawlobby.component';
import { DrawComponent } from './Components/draw/draw.component';
import { PromptComponent } from './Components/prompt/prompt.component';
// import { PromptlobbyComponent } from './Components/promptlobby/promptlobby.component';
import { GuesspromptComponent } from './Components/guessprompt/guessprompt.component';
import { PromptresultsComponent } from './Components/promptresults/promptresults.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LobbyComponent,
    TriviaComponent,
    ProgressbarComponent,
    ScoreComponent,
    SimonlobbyComponent,
    SimonComponent,
    DrawlobbyComponent,
    DrawComponent,
    PromptComponent,
    // PromptlobbyComponent,
    GuesspromptComponent,
    PromptresultsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  exports: [ProgressbarComponent, ScoreComponent],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
