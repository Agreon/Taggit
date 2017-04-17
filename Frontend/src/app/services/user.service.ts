import { Injectable } from '@angular/core';
import {BehaviorSubject, ReplaySubject, Observable} from "rxjs";
import {User} from "../models/user";
import {DBService} from "./db.service";
import {Headers} from "@angular/http";
import {LogService} from "./log.service";
import {UserMessage, MessageType, UserInformationService} from "./User-Information.service";
import {ActivatedRoute} from "@angular/router";

@Injectable()
export class UserService {

  private currentUser: User;
  private userToken: string;
  private currentUserSubject = new ReplaySubject<User>(1);

  constructor(private dbService: DBService,
              private informationService: UserInformationService,
              private activeRoute: ActivatedRoute
            ) {

    let token = this.getToken();

    if(!token){
      //this.signOut();
    }


      token = "JWT "+token;
      // Directly login
      LogService.log("Found Token", token);
      this.dbService.getUserByToken(token).subscribe(res => {
        LogService.log("User logged in from localStorage", res);

        this.setUser(res.user, token);

        this.dbService.setHeaders(this.createAuthHeaders());
        this.currentUserSubject.next(User.fromJSON(res.user));
      }, err => {
        console.log("Could not get user by token",err);
        // TODO: Not for development
        window.location.href = ""
        /*
          localStorage["taggitToken"] = null;
          this.userToken = null;
         */
      });


  }

  private getToken(): string {
    console.log("URL", window.location.href);
    let params = window.location.href.split('?');

    if(!params || params.length < 2){
      return null;
    }
    let tokenpair = params[1].split('=');

    if(tokenpair.length < 2){
      return null;
    }

    return tokenpair[1];
  }

  public getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  public signUp(username: string, password: string): Observable<any> {

    return this.dbService.create(new User(username, password)).map(res => {
      if(res.success){
        this.setUser(res.user, res.token);
      }
      return res;
    });

  }

  public logIn(username: string, password: string): Observable<any>{
    return this.dbService.authenticate(username, password)
      .map(res => {
        if(res.success){
          this.setUser(res.user, res.token);
        }
        return res;
      });
  }

  /**
   * TODO: Check DELETE token
   */
  public signOut(): void {
    this.currentUser = null;
    this.currentUserSubject.next(null);
    // Inform User
    this.informationService.showInformation(new UserMessage(
      MessageType.SUCCESS,
      "logout successfull."
    ));
    //window.location.href = "";
    // TODO: Redircet to landingpage/logout
  }

  private setUser(user: User, token?: string): void {
    this.currentUser = User.fromJSON(user);
    if(token){
      this.userToken = token;
      this.dbService.setHeaders(this.createAuthHeaders());
    }
    this.currentUserSubject.next(this.currentUser);
  }

  private createAuthHeaders(): any {
    let headers = new Headers();
    headers.append("authorization", this.userToken);
    return {"headers": headers};
  }

}
