import { Component, OnInit } from '@angular/core';
import {LearnService} from "../../services/learn.service";

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor(private learnService: LearnService) {
  }

  ngOnInit() {
    console.log("Tags", this.learnService.getTags());
  }

}
