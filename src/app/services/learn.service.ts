import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HoldsTags, StoreTag} from "../models/learnable";

@Injectable()
export class LearnService {

  private currentObject: HoldsTags;

  constructor(private router: Router) { }

  public startLearning(learnable: HoldsTags){
    this.currentObject = learnable;
    this.router.navigate(['/Learning']);
  }

  public getTags(): Array<StoreTag> {
    return this.currentObject.tags;
  }

  /**
   * TODO: Check wich ones are already asked, weights..
   */
  public getRandomTag(): StoreTag {
    let rand =  Math.floor((Math.random() * this.currentObject.tags.length));
    return this.currentObject.tags[rand];
  }

 /*
 public setTagSuccess(bool)*/

}
