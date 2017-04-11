import {Component, OnInit, Output, Input} from '@angular/core';
import {Subject} from "rxjs";
import {Slot} from "../../models/slot";

/**
 * TODO:
 * + Loading Icons + methods
 */
@Component({
  selector: 'app-menu-template',
  templateUrl: './menu-template.component.html',
  styleUrls: ['./menu-template.component.css']
})
export class MenuTemplateComponent implements OnInit {

  @Input("Param")
  param: any;
  @Output("ChangeMenu")
  changeMenu: Subject<any> = new Subject<any>();

  protected slots: Slot[] = [];
  protected loading: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

}
