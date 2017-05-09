import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {StoreTag} from "../models/store-tag";
import {LearnObject, LearnTag} from "../models/learn-object";
import {DBService} from "./db.service";
import {Project} from "../models/project";
import {Document} from "../models/document";
import {Storeable} from "../models/storeable";
import {HoldsTags} from "../models/HoldsTags";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import {Helper} from "../models/Helper";

@Injectable()
export class LearnService {

  private learnObject: LearnObject;
  private currentObject: HoldsTags;

  private learnObjectSubject = new ReplaySubject<LearnObject>(1);

  // Learning
  private currentTag: number;
  private tagAmount: number;
  private learnQueue1: Array<number>;
  private learnQueue2: Array<number>;


  constructor(private router: Router,
              private dbService: DBService) { }

  public startLearning(learnable: HoldsTags){
    this.currentObject = learnable;

    console.log("Learning with", learnable);

    this.dbService.get("learnObject", learnable._id).subscribe(res => {

      if(res.length == 0){

        console.log("Creating new LearnObject");

        this.learnObject = new LearnObject(learnable._id);
        this.dbService.create(this.learnObject).subscribe((learnObject) => {
          console.log("Created new LearnObject", learnObject);
          this.learnObjectSubject.next(this.learnObject);
          this.router.navigate(['/LearnSettings']);
        });
        return;
      }
      this.learnObject = LearnObject.fromJSON(res[0]);

      // Get Tags and Fill LearnObject with Tagsdata
      let tags = learnable.getTags();
      // TODO: Only add those of types, that are already added
      this.learnObject.fillTagData(tags);
      this.learnObjectSubject.next(this.learnObject);
      this.router.navigate(['/LearnSettings']);
    });
  }


  public getLearnObject(): Observable<LearnObject> {
    return this.learnObjectSubject.asObservable();
  }

  public setLearnObject(learnObject: LearnObject) {
    this.learnObject = learnObject;
    this.learnObjectSubject.next(this.learnObject);
  }

  public getObjectTags(): Array<StoreTag> {
    return this.currentObject.getTags();
  }


  /**
   * Init parameters for one learn-set
   *
   * If one quesiton is answered false,it will be appended at the end,
   * but if it is answered false a second time it wont be appended
   *
   */
  public initLearning(): void {

    this.learnQueue1 = [];
    this.learnQueue2 = [];
    this.currentTag = null;

    /**
     * TODO: Filter tags: maybe with starting at level-param
     */
    let tags = this.learnObject.tags.filter(tag => {
        return tag.active;
    });


    // Make Index for every Tag
    let indexes = [];
    for(let i = 0; i < tags.length; i++){
      indexes.push(i);
    }

    // Shuffle Indexes and enter in queue
    this.learnQueue1 = Helper.shuffleArray(indexes);

    this.tagAmount = this.learnQueue1.length;

    this.router.navigate(["/Learning"]);
  }

  /**
   * TODO: Maybe we only need one queue ( but how do we distinguis answered false a second time?
   * Sets Tag-Level according to success and returns a new one from the queue
   * @param success result of the last question
   * @returns {LearnTag} A new Tag from the queue
   */
  public nextTag(success: boolean): LearnTag {

    if(this.currentTag){
      if(success){
        if(this.learnObject.tags[this.currentTag].level < 3){
          this.learnObject.tags[this.currentTag].level++;
        }
      } else {

        /**
         * Put at second queue
         */
        this.learnQueue2.push(this.currentTag);
        this.tagAmount++;

        if(this.learnObject.tags[this.currentTag].level > 0){
          this.learnObject.tags[this.currentTag].level--;
        }
      }
    }

    if(this.learnQueue1.length > 0){
      this.currentTag = this.learnQueue1.pop();
    }else {
      this.currentTag = this.learnQueue2.pop();
    }
    return this.learnObject.tags[this.currentTag];
  }

  /**
   * Return progress in %
   * @returns {number}
   */
  public getLearnProgress(): number {
    return (this.getCurrentTagNum() / this.tagAmount)*100;
  }

  public getTagAmount(): number {
    return this.tagAmount;
  }

  public getCurrentTagNum(): number {
    return this.tagAmount - (this.learnQueue1.length + this.learnQueue2.length);
  }

}
