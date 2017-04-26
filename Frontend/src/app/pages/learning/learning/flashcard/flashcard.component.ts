import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LearnService} from "../../../../services/learn.service";
import {LearnTag} from "../../../../models/learn-object";
import {InputReceiver} from "../../../../models/input-receiver";
import {InputService} from "../../../../services/input.service";

@Component({
  selector: 'flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent implements OnInit, InputReceiver {

  // TODO: set value?!
  focusHandle: ViewChild;

  private currentTag: LearnTag;
  private state: number = 0;

  // TODO: Maybe learnservice only in parent
  constructor(private learnService: LearnService,
              private inputService: InputService) {
    this.inputService.addReciever("Flashcard",this);
  }

  ngOnInit() {
    /*this.learnService.initLearning();
    this.currentTag = this.learnService.nextTag();*/
    this.inputService.setActive("Flashcard");
  }

  keyEvent(event: KeyboardEvent) {

    if(this.state == 0){
      // OnSubmit
      if(event.keyCode == 13){
        this.onReady();
      }
    } else {
      if(event.keyCode == 37){
        this.onSuccess(false);
      }else if(event.keyCode == 39){
        this.onSuccess(true);
      }
    }
  }

  /**
   * TODO: Show Answer
   */
  private onReady(){
      this.state = 1;
  }

  /**
   * TODO: Get new question
   * @param success
   */
  private onSuccess(success: boolean) {
    console.log("Success?",success);
    /*this.learnService.setSuccess(success);
    this.currentTag = this.learnService.nextTag();*/
  }


  /**
   * TODO: OnSelect if success
   * learnService.setSuccess();
   * learnService.nextTag(id, success)
   *    learnService calculates tag-level and sets progress
   */

}
