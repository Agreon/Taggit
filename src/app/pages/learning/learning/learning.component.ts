import { Component, OnInit } from '@angular/core';
import {LearnService} from "../../../services/learn.service";
import {LearnObject} from "../../../models/learn-object";

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

  constructor(private learnService: LearnService) {
  }

  ngOnInit() {
  }



}
