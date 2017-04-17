import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LearnTag} from "../../../../models/learn-object";

@Component({
  selector: 'tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  @Input("TagType")
  tagType: string = "";

  @Input("Tags")
  tags: Array<LearnTag> = [];

  @Output("TagChange")
  tagChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  private setActive(evt: any, tag: LearnTag){
    console.log("SetActive",evt);
   // tag.active = evt.
    this.tagChange.emit();
  }

  private resetProgress(tag: LearnTag) {
    tag.level = 0;
    this.tagChange.emit();
  }

}
