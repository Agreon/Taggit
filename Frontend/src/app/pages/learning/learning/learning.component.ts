import { Component, OnInit } from '@angular/core';
import {LearnService} from "../../../services/learn.service";
import {LearnObject, LearnTag} from "../../../models/learn-object";
import {Router} from "@angular/router";

/**
 * Requirements:
 * + show current progress
 * + show diffrent tags
 */
@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  /**
   * Get a Subset of learnobject of the learnservice?
   *
   * @param learnService
   */

  private currentTag: LearnTag;
  private learnProgress: number = 0;
  private inputEnabled: boolean = true;

  constructor(private learnService: LearnService,
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
            this.router.navigate(["/LearnSettings"]);
          } else {
            this.inputEnabled = true;
            this.currentTag = newTag;
            this.learnProgress = this.learnService.getLearnProgress();
          }

        },1000);

  }

}
