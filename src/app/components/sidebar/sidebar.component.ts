import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/app.component';
import { AuthService } from '../../servises/auth.service';
import { IsLoggedService } from '../../servises/is-logged.service';


declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
//  { path: '/notifications', title: 'notifications',  icon: 'dashboard', class: 'Teacher' },
  { path: '/', title:     'Login',  icon: 'login', class: 'Login' },
  //ADMIN
  { path: '/flow', title: 'Flow',  icon:'person', class: 'admin' },
  { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: 'admin' },

//  { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: 'Teacher' },
//  { path: '/message', title: 'Messaging',  icon:'notifications', class: 'Teacher' },
//  { path: '/ticket', title: 'Tickets',  icon:'notifications', class: 'Teacher' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  first_name: string = '';
  last_name: string = '';

  userProfile:string = "Login";
  menuItems: any[];

  constructor(
    private router: Router,
    private IsLoggedService: IsLoggedService,
    private AuthService: AuthService
  ) { }

  ngOnInit() {
    this.IsLoggedService.isUserLoggedIn.subscribe((userLoggedIn: boolean) => {
      if (userLoggedIn) {
        this.isUserLoggedIn = userLoggedIn;
        //oleg
      }
    });
    this.IsLoggedService.userData.subscribe((userData:User) => {
      this.first_name = userData.user.first_name;
      this.last_name = userData.user.last_name;
    }); 
    this.IsLoggedService.userProfile.subscribe((userProfile: string) => {
      this.userProfile = userProfile;
    });
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  startLogout() {
    this.IsLoggedService.setUserLoggedIn(false);
    this.isUserLoggedIn = false;
    sessionStorage.clear();
    this.AuthService.logout();
    this.router.navigate(['/']);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
  };

}
