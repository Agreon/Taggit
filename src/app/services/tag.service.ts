import { Injectable } from '@angular/core';
import {Observable, Subject, BehaviorSubject, ReplaySubject} from "rxjs";
import {Tag, TagInput} from '../models/tag';
import {DBService} from "./db.service";
import {LogService} from "./log.service";

@Injectable()
export class TagService {

  private allTagsSubject = new ReplaySubject<Tag[]>(1);
  //private tags: Tag[] = [];

  private tags: Tag[] = [
    new Tag("Question",
      "Add a Question with Answer",
      "ctrl+1",
      [new TagInput("Question", ""),
        new TagInput("Answer", "")]),
    new Tag("TODO",
      "Add a Todo-Item",
      "ctrl+2",
      [new TagInput("TODO", "")]),
    new Tag("Important",
      "Add a Important Tag",
      "ctrl+3",
      [new TagInput("Text", "")])
  ];

  constructor(private dbService: DBService) {
    this.allTagsSubject.next(this.tags);

  }

  /**
   * Load all tags of a user
   */
  public loadTags(): void {
    this.dbService.get("tag").subscribe( tags => {
      console.log("Got tags",tags);
      tags = tags.data;

      this.tags = tags.map(tag=> {
        return Tag.fromJSON(tag);
      });
      console.log("Save them as",this.tags);

      //this.tags = tags;
      this.allTagsSubject.next(this.tags);
    }, err => {
      console.log("Err", err);
    });
  }

  public createTag(name: string) {
    this.dbService.create(new Tag(name,null, null, null)).subscribe(tag => {
      this.tags.push(Tag.fromJSON(tag));
      this.allTagsSubject.next(this.tags);
    }, err => {
      console.log("Err Creating tag", err);
    });
  }

  public renameTag(tag: Tag, name: string): Observable<Tag> {
    LogService.log("Rename Tag", name)
    tag.name = name;

    return this.dbService.save(tag);
  }

  public deleteTag(tag: Tag): Observable<any> {
    return this.dbService.remove(tag);
  }

  public getTags(): Observable<Tag[]> {
    return this.allTagsSubject.asObservable();
  }

}
