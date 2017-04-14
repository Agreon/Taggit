import { Component, OnInit } from '@angular/core';
import {LearnService} from "../../../services/learn.service";

@Component({
  selector: 'flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent implements OnInit {

  constructor(private learnService: LearnService) {

  }

  ngOnInit() {
  }

  /**
   * TODO: OnSelect if success
   * learnService.setSuccess();
   * learnService.nextTag(id, success)
   */

}
