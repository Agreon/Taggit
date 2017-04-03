import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Tag} from "../../models/tag";

@Component({
  selector: 'app-tag-button',
  templateUrl: './tag-button.component.html',
  styleUrls: ['./tag-button.component.css']
})
export class TagButtonComponent implements OnInit {

  @Input("Tag")
  tag: Tag;

  @Output("OnClick")
  onClick: EventEmitter<Tag> = new EventEmitter<Tag>();

  constructor() { }

  ngOnInit() {
  }

  private onclick(){
    this.onClick.emit(this.tag);
  }

}
