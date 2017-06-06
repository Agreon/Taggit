import { Component, OnInit } from '@angular/core';
import {LearnService} from "../../../services/learn.service";
import {LearnObject, LearnTag} from "../../../models/learn-object";
import {Router} from "@angular/router";
import {LogService} from "../../../services/log.service";

/**
 * Git-Issue[12]: Flashcard needs less margin in responsive mode >> Strange, even tho media-query is implemented, it wont work..<<[style]
 */
@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  private currentTag: LearnTag;
  private learnProgress: number = 0;
  private inputEnabled: boolean = true;

  constructor(private learnService: LearnService,
              private logService: LogService,
              private router: Router) {

  }

  ngOnInit() {
    this.currentTag = this.learnService.nextTag(false);
  }

  private onNavigateSettigs(){
    this.router.navigate(["/LearnSettings"]);
  }

  private onQuestionCompleted(success: boolean){
    let newTag = this.learnService.nextTag(success);

    this.inputEnabled = false;

        // Wait for Animation
        setTimeout(() => {
          if(!newTag){
            this.learnProgress = 100;
            setTimeout(() => {
              this.learnService.saveLearnObject().subscribe(() => {
                this.router.navigate(["/LearnSettings"]);
              });
            }, 600);
          } else {
            this.inputEnabled = true;
            this.currentTag = newTag;
            this.learnProgress = this.learnService.getLearnProgress();
            LogService.log("LearnProgress", this.learnProgress)
          }
        },500);

  }

}
