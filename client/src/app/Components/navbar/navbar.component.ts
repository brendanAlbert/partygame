import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DrawService } from 'src/app/Services/draw.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('myNav') navelement: ElementRef;

  constructor(private router: Router, private _drawService: DrawService) {}

  ngOnInit(): void {}
  ngAfterViewInit() {}

  mainMenu() {
    this._drawService.stopConnection();

    this.router.navigate([`/`]);
  }
  openNav() {
    this.navelement.nativeElement.style.height = '100%';
  }
  closeNav() {
    this.navelement.nativeElement.style.height = '0%';
  }
  triviaLobby() {
    this._drawService.stopConnection();

    this.router.navigate([`/lobby`]);
  }
  memoryLobby() {
    this._drawService.stopConnection();

    this.router.navigate([`/simonlobby`]);
  }
  drawLobby() {
    this._drawService.stopConnection();

    this.router.navigate([`/`]);
    setTimeout(() => {
      this.router.navigate([`/drawlobby`]);
    }, 50);
  }
}
