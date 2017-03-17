import { Injectable } from '@angular/core';
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {Tag, TagInput} from '../models/tag';

@Injectable()
export class TagService {

  private tags: Tag[] = [
    new Tag("Question",
      "Add a Question with Answer",
      "ctrl+1",
      [new TagInput("Question", "Input", "What does BMI mean?"),
        new TagInput("Answer", "Input", "Body Mass Index")]),
    new Tag("TODO",
      "Add a Todo-Item",
      "ctrl+2",
      [new TagInput("TODO", "Input", "Folie 34")])
  ];


  private allTags = new BehaviorSubject<Tag[]>(this.tags);

  constructor() { }

  public addTag(tag: Tag): void {
    this.tags.push(tag);
    this.allTags.next(this.tags);
  }

  public getTags(): Observable<Tag[]> {
    return this.allTags.asObservable();
  }

}
