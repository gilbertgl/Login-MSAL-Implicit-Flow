import { Component, OnInit } from '@angular/core';
import { MsalLoginService } from '../msal.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Profile } from '../profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile?: Profile;
  profilePic?: SafeResourceUrl;

  constructor(private msalLoginService: MsalLoginService,
              private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getProfile();
    this.getProfilePic();
  }

  getProfile() {
    this.msalLoginService.getUserProfile().subscribe(profileInfo => {
      console.log(profileInfo)
      this.profile = profileInfo;
    });
  }

  getProfilePic() {
    this.msalLoginService.getProfilePic().subscribe(response => {
      var urlCreator = window.URL || window.webkitURL;
      this.profilePic = this.domSanitizer.bypassSecurityTrustResourceUrl(urlCreator.createObjectURL(response));
    });
  }
}
