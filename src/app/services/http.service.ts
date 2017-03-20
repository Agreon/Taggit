import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from "rxjs";

@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  public getProjects() : Observable<any> {

    //let options = new RequestOptions({headers: new Headers('Content-Type': 'apllication/json')});

    return this.http.get("http://127.0.0.1:3000/projects")
      .map((res: Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'Server error'));
  }

}
