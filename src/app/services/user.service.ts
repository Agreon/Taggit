import { Injectable } from '@angular/core';
import {BehaviorSubject, ReplaySubject, Observable} from "rxjs";
import {User} from "../models/user";
import {DBService} from "./db.service";

@Injectable()
export class UserService {

  private currentUser: User;
  private currentUserSubject = new ReplaySubject<User>(1);

  constructor(private dbService: DBService) { }

  public getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  public signUp(username: string, password: string): Observable<any> {

    return this.dbService.create(new User(username, password, null)).map(res => {
      if(res.success){
        this.currentUser = User.fromJSON(res.user);
        this.currentUser.token = res.token;
        localStorage["taggitToken"] = res.token;
        this.currentUserSubject.next(this.currentUser);
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
        this.currentUser = User.fromJSON(res.user);
        this.currentUser.token = res.token;
        localStorage["taggitToken"] = res.token;
        this.currentUserSubject.next(this.currentUser);
      }else {
        Observable.throw(res.message);
      }
    });

    /*return this.http.post(request, body)
      .map((res: Response) => res.json())
      .map(res => {
        console.log("Got res", res);
        if(res.success){
          console.log("authenticate",res);
          this.userToken = res.token;
          localStorage["taggitToken"] = res.token;
          this.authenticated.next(true);
        }else {
          Observable.throw(res.message);
        }
      });*/
  }

  /**
   * TODO: Check DELETE token
   */
  public signOut(): void {
    this.currentUser = null;
    localStorage["taggitToken"] = null;
    this.currentUserSubject.next(null);
  }




}
