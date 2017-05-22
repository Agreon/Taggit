import { Injectable } from '@angular/core';
import {BehaviorSubject, ReplaySubject, Observable} from "rxjs";
import {User} from "../models/user";
import {DBService} from "./db.service";
import {Headers} from "@angular/http";
import {LogService} from "./log.service";
import {UserMessage, MessageType, UserInformationService} from "./User-Information.service";import {
  ActivatedRoute, NavigationEnd,
  Router
} from "@angular/router";

/**
 * TODO: Remove unused methods
 */
@Injectable()
export class UserService {

  private currentUser: User;
  private userToken: string;
  private currentUserSubject = new ReplaySubject<User>(1);

  private previousPage: string;

  constructor(private dbService: DBService,
              private informationService: UserInformationService,
              private router: Router) {
    this.getPreviousPage();
    let token = this.getTokenFromURL();

    // If token was not in url, check the localStorage
    if(!token){
      if(localStorage["taggitToken"]){
        token = localStorage["taggitToken"];
      }else {
        this.signOut();
      }
    }

      // Directly login
      LogService.log("Found Token", token);
      this.dbService.getUserByToken(token).subscribe(res => {
        LogService.log("User logged in from localStorage", res);
        localStorage["taggitToken"] = token;
        this.setUser(res.user, token);
      }, err => {
        console.log("Could not get user by token",err);
        this.signOut();
        // TODO: Not for development
       // window.location.href = ""
        /*
          localStorage["taggitToken"] = null;
          this.userToken = null;
         */
      });


  }

  private getTokenFromURL(): string {
    let params = window.location.href.split('?');

    if(!params || params.length < 2){
      return null;
    }
    let tokenpair = params[1].split('=');

    if(tokenpair.length < 2){
      return null;
    }

    return "JWT "+tokenpair[1];
  }

  private getPreviousPage() {

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

    // TODO: Redircet to landingpage/logout
    window.location.href = "https://taggit.agreon.de/logout";
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
