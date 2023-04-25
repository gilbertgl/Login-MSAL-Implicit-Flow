import { Component, OnInit } from '@angular/core';
import { MsalLoginService } from '../msal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  isUserLoggedIn: boolean = false;

  constructor(private msalLoginService: MsalLoginService) {}

  ngOnInit(): void {
    this.msalLoginService.isUserLoggedIn.subscribe(x => {
      this.isUserLoggedIn = x
    })
  }
}
