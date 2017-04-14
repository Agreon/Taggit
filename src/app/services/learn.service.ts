import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {StoreTag} from "../models/store-tag";
import {LearnObject} from "../models/learn-object";
import {DBService} from "./db.service";
import {Project} from "../models/project";
import {Document} from "../models/document";
import {Storeable} from "../models/storeable";

@Injectable()
export class LearnService {

  // TODO: HoldsTags ist nicht nutzbar.. (Vlt. kann man als parameter mehrer typen angeben? |
  private currentObject: Document;
  //private currentObject: HoldsTags;
  private learnObject: LearnObject;

  constructor(private router: Router,
              private dbService: DBService) { }

  public startProjectLearning(learnable: Project){

  }

  public startDocumentLearning(learnable: Document){

    /*this.currentObject = learnable;

    let id = this.currentObject._id;

    // Get LearnObject from Server
    this.dbService.get("learnobject",id).subscribe(res => {

      this.router.navigate(['/Learning']);
    });*/
  }

  public getTags(): Array<StoreTag> {
   // return this.currentObject.tags;
    return [];
  }

  /**
   * TODO: Check wich ones are already asked, weights..
   */
  public getRandomTag(): StoreTag {
    //let rand =  Math.floor((Math.random() * this.currentObject.tags.length));
    return null;
    //return this.currentObject.tags[rand];
  }

 /*
 public setTagSuccess(bool)*/

}
