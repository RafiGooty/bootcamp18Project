import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  faSignInAlt = faSignInAlt ;
  faUserPlus = faUserPlus;
  faHome = faHome;
  faSignOutAlt = faSignOutAlt;
  faPlus =faPlus;


  constructor(private authService:AuthService) { }
  isAuthorized:boolean=false;
  authroizedSub:Subscription;
  ngOnInit() {
   this.authroizedSub=this.authService.getAuthroizationlistner().subscribe(isAuthorized=>{
    this.isAuthorized=isAuthorized;
  })
  this.isAuthorized=this.authService.getIsAuthorized();
  }

  ngOnDestroy(){
    this.authroizedSub.unsubscribe();
  }

  onLogOut(){
    this.authService.logOut();
  }
}
