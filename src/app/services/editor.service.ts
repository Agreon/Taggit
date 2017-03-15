import { Injectable } from '@angular/core';
import {Subject, Observable} from "rxjs";

@Injectable()
export class EditorService {

  // TODO: Wird nicht benötigt
  private contentInsertSource = new Subject<string>();

  constructor() { }

  public insertContent(content: string): void {
    this.contentInsertSource.next(content);
  }

  public getContentInsert(): Observable<string> {
    return this.contentInsertSource.asObservable();
  }

}
