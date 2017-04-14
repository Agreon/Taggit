import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  @Input("TagType")
  tagType: string = "";

  @Input("Tags")
  tags: any = [];


  constructor() { }

  ngOnInit() {
  }

}
