import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable()
export class LogService {

  constructor() { }

  public static log(message: any, message2: any = ""): void {
    if(!environment.production) {
      console.log(message, message2);
    }
  }

}
