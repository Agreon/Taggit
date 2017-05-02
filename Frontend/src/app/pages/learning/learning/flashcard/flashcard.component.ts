import {Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {LearnTag} from "../../../../models/learn-object";
import {InputReceiver} from "../../../../models/input-receiver";
import {InputService} from "../../../../services/input.service";
import {Helper} from "../../../../models/Helper";

@Component({
  selector: 'flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent implements OnInit, InputReceiver {

  @Input("LearnTag")
  learnTag: LearnTag;

  @Input("CurrTag")
  currTag: number;

  @Input("TotalTags")
  totalTags: number;

  @Input("Active")
  active: boolean;

  @Output("QuestionCompleted")
  questionCompleted: EventEmitter<any> = new EventEmitter();

  // TODO: set value?!
  public focusHandle: ViewChild;
  private state: number = 0;

  constructor(private inputService: InputService) {
    this.inputService.addReciever("Flashcard",this);
  }

  ngOnInit() {
    this.inputService.setActive("Flashcard");
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes["learnTag"]){
      console.log("New Question", this.learnTag);
      this.learnTag.tagData.inputs[0].value = Helper.convertUmlautes(this.learnTag.tagData.inputs[0].value);
      this.learnTag.tagData.inputs[1].value = Helper.convertUmlautes(this.learnTag.tagData.inputs[1].value);
      this.state = 0;
    }
  }

  keyEvent(event: KeyboardEvent) {

    if(!this.active){
      return;
    }

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

  private onSuccess(success: boolean) {
    console.log("Success?",success);
    this.questionCompleted.emit(success);
  }

}
