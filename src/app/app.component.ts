import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MsalLoginService } from './msal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;
  userName?:string='';
  private readonly _destroy = new Subject<void>();
  title = 'MsalLoginApp';

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private msalBroadCastService: MsalBroadcastService,
              private authService: MsalService,
              private msalLoginService: MsalLoginService) { }

  ngOnInit(): void {
    this.msalBroadCastService.inProgress$.pipe
    (filter((interactionStatus:InteractionStatus)=>
    interactionStatus==InteractionStatus.None),
    takeUntil(this._destroy))
    .subscribe(x=>
      {
        this.isUserLoggedIn=this.authService.instance.getAllAccounts().length>0;

        if(this.isUserLoggedIn)
        {
          this.userName = this.authService.instance.getAllAccounts()[0].name;
        }
        this.msalLoginService.isUserLoggedIn.next(this.isUserLoggedIn);
      })
  }

  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }

  login() {
    if(this.msalGuardConfig.authRequest){
      this.authService.loginPopup({... this.msalGuardConfig.authRequest} as PopupRequest)
    } else {
      this.authService.loginPopup();
    }
  }

  logout() {
    this.authService.logoutPopup({postLogoutRedirectUri: environment.postLogoutUrl});
  }
}
