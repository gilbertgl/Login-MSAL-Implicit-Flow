import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MsalLoginService } from './msal.service';
const isIE = window.navigator.userAgent.indexOf('MSIE') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    HttpClientModule,
    MsalModule.forRoot(new PublicClientApplication({
        auth: {
          clientId: 'aac274af-1eb6-48a9-9383-bcb160a9a76c',
          redirectUri: 'http://localhost:4200',
          authority: 'https://login.microsoftonline.com/common',
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false,
          }
      }),
      {
        interactionType: InteractionType.Popup,
        authRequest: {
          scopes: ['user.read']
        }
      },
      {
        interactionType: InteractionType.Popup,
        protectedResourceMap: new Map(
          [
            ['https://graph.microsoft.com/v1.0/me', ['user.Read']]
          ]
        )
      }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard,
    MsalLoginService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
