import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import { Tag } from '../models/tag';

@Injectable()
export class TagService {

  private allTags = new Subject<Tag[]>();

  private tags: Tag[] = [];

  constructor() { }

  public addTag(tag: Tag): void {
    this.tags.push(tag);
    this.allTags.next(this.tags);
  }

  public getTags(): Observable<Tag[]> {
    return this.allTags.asObservable();
  }

}
