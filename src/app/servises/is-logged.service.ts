import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User, UsersData } from 'app/app.component';

@Injectable({providedIn: 'root'})
export class IsLoggedService {
  constructor() { }
  token:string;
  usersData:UsersData[] =[];
  currentUser:User;
  setToken(token:string) {
    this.token = token;
  }
  getToken() {
    return this.token;
  }
  getCurrentUser() {
    return this.currentUser;
  }
  setUsersData(usersData: UsersData[]) {
    return this.usersData = usersData;
  }
  getUsersData() {
    return this.usersData;
  }
  isUserLoggedIn = new Subject();
  setUserLoggedIn(loggedIn: boolean) {
    return this.isUserLoggedIn.next(loggedIn);
  }
  userProfile = new Subject();
  setUserProfile(profile: string) {
    return this.userProfile.next(profile);
  }
  userData = new Subject();
  setUserData(userData: User) {
    this.currentUser = userData
    return this.userData.next(userData);
  }
}
