import {Component, Input, OnInit} from '@angular/core';
import {LearnService} from "../../../../services/learn.service";
import {LearnTag} from "../../../../models/learn-object";

@Component({
  selector: 'flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent implements OnInit {

  private currentTag: LearnTag;
  private state: number = 0;

  constructor(private learnService: LearnService) {

  }

  ngOnInit() {
    this.learnService.initLearning();
    this.currentTag = this.learnService.nextTag();
  }

  private onReady(){

  }

  private onSuccess(success: boolean) {
    this.learnService.setSuccess(success);
    this.currentTag = this.learnService.nextTag();
  }

  /**
   * TODO: OnSelect if success
   * learnService.setSuccess();
   * learnService.nextTag(id, success)
   *    learnService calculates tag-level and sets progress
   */

}
