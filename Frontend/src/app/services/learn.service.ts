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

@Injectable()
export class LearnService {

  private learnObject: LearnObject;
  private currentObject: HoldsTags;

  private learnObjectSubject = new ReplaySubject<LearnObject>(1);


  // Learning
  private currentTag: number;

  constructor(private router: Router,
              private dbService: DBService) { }


  public startLearning(learnable: HoldsTags){
    this.currentObject = learnable;

    console.log("Learning with", learnable);

    this.dbService.get("learnObject", learnable._id).subscribe(res => {

      if(res.length == 0){
        console.log("Not found", learnable);
        this.learnObject = new LearnObject(learnable._id);
      } else {
        this.learnObject = res[0];
      }

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
   * TODO: Init parameters for one learn-set
   *
   * If one quesiton is answered false,it will be appended at the end,
   * but if it is answered false a second time it wont be appended
   *
   */
  public initLearning(): void {
    let learnQueue: Array<number>;
    for(let i = 0; i < learnQueue.length; i++){
      learnQueue.push(i);
    }
    let a = learnQueue.pop();
    console.log("LEARNQUEQU pop",a);
  }

  /**
   * TODO: Fine-tuning
   * @param success
   */
  public setSuccess(success: boolean){
    if(!success){
      if(this.learnObject.tags[this.currentTag].level > 0){
        this.learnObject.tags[this.currentTag].level--;
      }



    } else {
      if(this.learnObject.tags[this.currentTag].level < 3){
        this.learnObject.tags[this.currentTag].level++;
      }
    }
  }


  /**
   * TODO: Check wich ones are already asked, weights..
   * Maybe instead of random: Queue with tags
   */
  public nextTag(): LearnTag {
    this.currentTag =  Math.floor((Math.random() * this.learnObject.tags.length));

    return this.learnObject.tags[this.currentTag];
  }
}
