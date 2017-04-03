import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs";
import {Storeable} from "../models/storeable";

@Injectable()
export class DBService {

  private serverUrl: string = "http://agreon.de:3000";
  //private serverUrl: string = "http://127.0.0.1:3000";
  private headers: Headers = new Headers();


  constructor(private http: Http) {  }

  /**
   * Creates a new Storeable
   * @param storeable
   * @returns {Observable<R>} Created-DB-Object with id and dates
   */
  public create(storeable: Storeable): Observable<any> {
    let request = this.createRequestUrl(storeable.type);

    return this.http.post(request, storeable.getStoreableContent(), this.headers)
      .map((res: Response) => res.json());
  }

  public save(storeable: Storeable): Observable<any> {
    let request = this.createRequestUrl(storeable.type,storeable._id);

    return this.http.put(request, storeable.getStoreableContent(), this.headers)
      .catch((error:any) => Observable.throw(error || 'Server error'));;
  }

  public get(type: string, id?: string): Observable<any> {
    let request = this.createRequestUrl(type,id);

    return this.http.get(request, this.headers)
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  public remove(storeable: Storeable): Observable<any> {
    let request = this.createRequestUrl(storeable.type,storeable._id);

    return this.http.delete(request, this.headers)
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  public authenticate(username: string, password: string): Observable<any>{
    let request = this.createRequestUrl("authenticate");

    let body = {"username": username, "password": password};

    return this.http.post(request, body)
      .map((res: Response) => res.json());
  }

  public getUserByToken(token: string): Observable<any> {
    let request = this.createRequestUrl("userByToken");

    return this.http.post(request, { "token": token })
      .map((res: Response) => res.json());
  }

  public setHeaders(headers: Headers): void {
    this.headers = headers;
  }

  private createRequestUrl(request: string, id?: string){
    let url = this.serverUrl + "/" + request;
    if(id){
      url += "/"+id;
    }
    return url;
  }

}
