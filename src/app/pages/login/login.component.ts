import { Component, OnInit } from '@angular/core';
import { ServerApiService } from 'app/servises/server-api.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/servises/auth.service';
import { IsLoggedService } from 'app/servises/is-logged.service';
import { User, UsersData, Product, ProductGroup } from 'app/app.component'; 
import { PersonService } from 'app/servises/person.service';


@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [
    ServerApiService 
  ]
})

export class LoginComponent implements OnInit {
  user = ''
  password = ''
  loginError = false;
  loginErrorText = '';
  constructor(
    private ServerApiService: ServerApiService,
    private IsLoggedService: IsLoggedService,
    private AuthService: AuthService, 
    private PersonService: PersonService,   
    private router: Router,
  ) { }
  ngOnInit() {
    this.IsLoggedService.setUserProfile("Login");
  }

  getLogin() {
    this.loginError = false;
    if (!this.user.trim() && !this.password.trim()) {
      return;
    }
    // request Login
    this.ServerApiService.fetchLogin(this.user,this.password)
    .subscribe((data:User)=>{
      sessionStorage.setItem('dates_request','login');
      this.AuthService.login();
      this.IsLoggedService.setUserLoggedIn(true);
      this.IsLoggedService.setUserData(data);  
      this.IsLoggedService.setUserProfile(data.user.role);
      this.IsLoggedService.setToken(data.user.token);  
      this.ServerApiService.fetchGet('/users/userlist')
      .subscribe((data:UsersData[])=>{
        this.IsLoggedService.setUsersData(data);  
        this.ServerApiService.fetchGet('/student/readproductgroup')
        .subscribe((data:ProductGroup[])=>{
          let st:string = JSON.stringify(data);
          sessionStorage.setItem('productgroup',st);
          this.ServerApiService.fetchGet('/student/readproduct')
          .subscribe((data:Product[])=>{
            let st:string = JSON.stringify(data);
            sessionStorage.setItem('product',st);
             

            this.PersonService.setPersons((p)=>{
              if (p) this.router.navigate(['/flow']);
              else console.log("error",p);
            });

          }, (error) => {
            console.log(error);
          });
        }, (error) => {
          console.log(error);
        });
      },(error) => {
        console.log(error);
        this.loginErrorText = error.statusText;
      });
    },(error) => {
      console.log(error);
      this.loginErrorText = error.statusText;
      setTimeout(this.loginErrorText ='',5000);
      this.user = '';
      this.password = '';
    });  }
}
