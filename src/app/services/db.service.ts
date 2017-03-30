import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs";
import {Storeable} from "../models/storeable";

@Injectable()
export class DBService {

  private serverUrl: string = "http://127.0.0.1:3000";
  private userToken: string;

  constructor(private http: Http) {
    /*if(localStorage["taggitToken"]){
      this.userToken = localStorage["taggitToken"];
      console.log("Isthere",this.userToken);
      // TODO: Directly login
      this.authenticated.next(true);
    }*/
  }

  /**
   * Creates a new Storeable
   * @param storeable
   * @returns {Observable<R>} Created-DB-Object with id and dates
   */
  public create(storeable: Storeable): Observable<any> {
    let request = this.createRequestUrl(storeable.type);

    return this.http.post(request, storeable.getStoreableContent(), this.createAuthHeaders())
      .map((res: Response) => res.json());
  }

  public save(storeable: Storeable): Observable<any> {
    let request = this.createRequestUrl(storeable.type,storeable._id);

    return this.http.put(request, storeable.getStoreableContent(), this.createAuthHeaders())
      .catch((error:any) => Observable.throw(error || 'Server error'));;
  }

  public get(type: string, id?: string): Observable<any> {
    let request = this.createRequestUrl(type,id);

    return this.http.get(request, this.createAuthHeaders())
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  public remove(storeable: Storeable): Observable<any> {
    let request = this.createRequestUrl(storeable.type,storeable._id);

    return this.http.delete(request, this.createAuthHeaders())
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  public authenticate(username: string, password: string): Observable<any>{
    let request = this.createRequestUrl("authenticate");

    let body = {"username": username, "password": password};

    return this.http.post(request, body)
      .map((res: Response) => res.json())
      .map(res => {
        if(res.success){
          this.userToken = res.token;
        }
        return res;
      });
     /* .map(res => {
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

  private createRequestUrl(request: string, id?: string){
    let url = this.serverUrl + "/" + request;
    if(id){
      url += "/"+id;
    }
    return url;
  }

  private createAuthHeaders(): any {
    let headers = new Headers();
    headers.append("authorization", this.userToken);
    return {"headers": headers};
  }

}
