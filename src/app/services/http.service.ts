import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from "rxjs";
import {Storeable} from "../models/storeable";

@Injectable()
export class HttpService {

  private serverUrl: string = "http://127.0.0.1:3000";

  constructor(private http: Http) { }

  public create(storeable: Storeable): Observable<any> {
    return this.http.post(this.serverUrl + "/" + storeable.type, storeable.getStoreableContent())
      .map((res: Response) => res.json());
  }

  public save(storeable: Storeable): Observable<any> {
    return this.http.put(this.serverUrl + "/" + storeable.type + "/" + storeable._id, storeable.getStoreableContent())
      .catch((error:any) => Observable.throw(error || 'Server error'));;
  }

  public get(type: string, id?: string): Observable<any> {
    let request = this.serverUrl + "/" + type;
    if(id){
      request += "/"+id;
    }

    return this.http.get(request)
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

  public remove(storeable: Storeable): Observable<any> {
    return this.http.delete(this.serverUrl + "/" + storeable.type + "/" + storeable._id)
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }
}
