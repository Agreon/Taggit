import { Injectable } from '@angular/core';
import {Observable, Subject, BehaviorSubject, ReplaySubject} from "rxjs";
import {Tag, TagInput} from '../models/tag';
import {DBService} from "./db.service";
import {LogService} from "./log.service";
import {MessageType, UserInformationService, UserMessage} from "./User-Information.service";

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

  constructor(private dbService: DBService,
              private informationService: UserInformationService) {
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
    });
  }

  public createTag(name: string) {
    this.dbService.create(new Tag(name, null, null, null)).subscribe(tag => {
      this.tags.push(Tag.fromJSON(tag));
      this.allTagsSubject.next(this.tags);

      // Inform User
      this.informationService.showInformation(new UserMessage(
        MessageType.SUCCESS,
        "Tag "+tag.name+" created."
      ));
    });
  }

  public renameTag(tag: Tag, name: string): void {
    LogService.log("Rename Tag", name)
    tag.name = name;

    this.dbService.save(tag).subscribe(() => {
      this.informationService.showInformation(new UserMessage(
        MessageType.SUCCESS,
        "Tag "+tag.name+" renamed"
      ));
    });
  }

  public deleteTag(tag: Tag): void {
    this.dbService.remove(tag);
  }

  public getTags(): Observable<Tag[]> {
    return this.allTagsSubject.asObservable();
  }

}
