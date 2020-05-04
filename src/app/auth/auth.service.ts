import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model'
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL=environment.apiUrl+"/user/";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router:Router) { }

  private token:string;
  private isAuthorized:boolean=false;
  private userId:string;
  timer:any;
  private authorizationListner= new Subject<boolean>();
  private userIdListner= new Subject<string>();

  getAuthroizationlistner(){
   return this.authorizationListner.asObservable();
  }

  getUserIdlistner(){
    return this.userIdListner.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  getToken(){
    return this.token
  }

  getIsAuthorized(){
    return this.isAuthorized
  }

  createUser(email:string,password:string){
    let signUpData:AuthData={email:email,password:password};

    this.http.post(BACKEND_URL+"/signup",signUpData)
    .subscribe(response=>{
      console.log(response);

    })
  }

  loginUser(email:string,password:string){
    let loginData:AuthData={email:email,password:password};
    this.http.post<{token:string,expiresIn:number,userId:string}>(BACKEND_URL+"/login",loginData)
    .subscribe(response=>{
      this.token=response.token
      if(this.token){
        this.isAuthorized=true;
        this.userId=response.userId;
        let expireTime=response.expiresIn*1000;
        let currentDate:Date =new Date();
        let futureDate:Date=new Date(currentDate.getTime() + expireTime);
        this.authorizationListner.next(true);
        this.userIdListner.next(this.userId);
        this.saveDataLocally(this.token,futureDate,this.userId);
        this.timer= setTimeout(()=>{
                                      this.logOut();
                                    },expireTime );
        this.router.navigate(['/']);
      }
    })
  }

  logOut(){
    this.isAuthorized=false;
    this.authorizationListner.next(false);
    this.userIdListner.next(null);
    this.token=null;
    this.resetSavedData();
    clearTimeout(this.timer);
    this.router.navigate(['login']);
  }

  saveDataLocally(token:string,expirDate:Date,userId:string){
    localStorage.setItem("token",token);
    localStorage.setItem("expirTime",expirDate.toISOString());
    localStorage.setItem("userId",userId);
  }

  resetSavedData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expirTime");
    localStorage.removeItem("userId");
  }

  setValuesOnRefresh(){
    this.token=localStorage.getItem("token");
    if(this.token){
      this.userIdListner.next(localStorage.getItem("userId")),
      this.userId=localStorage.getItem("userId");
      this.authorizationListner.next(true);
      this.isAuthorized=true;
    }
  }

}
