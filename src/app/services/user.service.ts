import { Injectable } from '@angular/core';
import {BehaviorSubject, ReplaySubject, Observable} from "rxjs";
import {User} from "../models/user";
import {DBService} from "./db.service";
import {Headers} from "@angular/http";
import {LogService} from "./log.service";

@Injectable()
export class UserService {

  private currentUser: User;
  private userToken: string;
  private currentUserSubject = new ReplaySubject<User>(1);

  constructor(private dbService: DBService) {
    if(localStorage["taggitToken"]){
     // TODO: Directly login
     LogService.log("Found localStorage", localStorage["taggitToken"]);
      this.dbService.getUserByToken(localStorage["taggitToken"]).subscribe(res => {
        LogService.log("User logged in from localStorage", res);

        this.setUser(res.user, localStorage["taggitToken"]);

        this.dbService.setHeaders(this.createAuthHeaders());
        this.currentUserSubject.next(User.fromJSON(res.user));
      }, err => {
        console.log("Could not get user by token",err);
        /*
          localStorage["taggitToken"] = null;
          this.userToken = null;
         */
      });
    }
  }

  public getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  public signUp(username: string, password: string): Observable<any> {

    return this.dbService.create(new User(username, password)).map(res => {
      if(res.success){
        this.setUser(res.user, res.token);
      } else {
        console.log("Could not create", res);
      }
    });

  }

  public logIn(username: string, password: string): Observable<any>{
    return this.dbService.authenticate(username, password)
      .map(res => {
      console.log("Got res", res);
      if(res.success){
        this.setUser(res.user, res.token);
      }else {
        Observable.throw(res.message);
      }
    });
  }

  /**
   * TODO: Check DELETE token
   */
  public signOut(): void {
    this.currentUser = null;
    localStorage["taggitToken"] = null;
    this.currentUserSubject.next(null);
  }

  private setUser(user: User, token?: string): void {
    this.currentUser = User.fromJSON(user);
    if(token){
      this.userToken = token;
      localStorage["taggitToken"] = token;
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
